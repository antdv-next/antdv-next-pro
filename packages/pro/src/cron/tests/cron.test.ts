import { mount } from '@vue/test-utils'
import { ConfigProvider, Form, FormItem } from 'antdv-next'
import enUS from 'antdv-next/locale/en_US'
import frFR from 'antdv-next/locale/fr_FR'
import zhCN from 'antdv-next/locale/zh_CN'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, reactive, ref } from 'vue'
import { useProConfigProvider } from '../../config-provider/context'
import proFrFR from '../../locale/fr_FR'
import proZhCN from '../../locale/zh_CN'
import Cron from '../index'
import { validateExpression } from '../utils'

describe('Cron', () => {
  it('exports Cron and its validator from the package entry', async () => {
    const module = await import('../../index')
    expect(module.Cron).toBeDefined()
    expect(module.validateCronExpression('0 0 9 * * ?').status).toBe('valid')
  })

  it('syncs valid, invalid, and empty manual expressions', async () => {
    const wrapper = mount(Cron)
    const input = wrapper.find('input')

    await input.setValue('0 0 9 * * *')
    expect(wrapper.emitted('input')).toEqual([['0 0 9 * * *']])
    expect(wrapper.emitted('update:value')).toEqual([['0 0 9 * * *']])
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.emitted('validate')?.slice(-1)[0]?.[0]).toMatchObject({ status: 'invalid' })

    await input.setValue('')
    expect(wrapper.emitted('update:value')?.slice(-1)).toEqual([['']])
    expect(wrapper.emitted('validate')?.slice(-1)[0]?.[0]).toMatchObject({ status: 'empty' })
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)

    await input.setValue('0 0 9 * * ?')
    expect(wrapper.emitted('update:value')?.slice(-1)).toEqual([['0 0 9 * * ?']])
    expect(wrapper.emitted('change')?.slice(-1)).toEqual([['0 0 9 * * ?']])
    expect(wrapper.emitted('validate')?.slice(-1)[0]?.[0]).toMatchObject({ status: 'valid' })
  })

  it('emits change only for valid state transitions', async () => {
    const wrapper = mount(Cron)
    const input = wrapper.find('input')

    await input.setValue('0 0 9 * * ?')
    await input.setValue('invalid')
    await input.setValue('still invalid')
    await input.setValue('0 0 9 * * ?')

    expect(wrapper.emitted('update:value')).toEqual([
      ['0 0 9 * * ?'],
      ['invalid'],
      ['still invalid'],
      ['0 0 9 * * ?'],
    ])
    expect(wrapper.emitted('change')).toEqual([
      ['0 0 9 * * ?'],
      ['0 0 9 * * ?'],
    ])
  })

  it('does not emit duplicate change events for the same valid expression', async () => {
    const wrapper = mount(Cron)
    const input = wrapper.find('input')

    await input.setValue('0 0 9 * * ?')
    await input.setValue('0 0 9 * * ?')

    expect(wrapper.emitted('change')).toEqual([['0 0 9 * * ?']])
  })

  it('keeps raw direct input while validating its canonical expression', async () => {
    const wrapper = mount(Cron)
    const input = wrapper.find('input')
    const rawExpression = ' 0  0  9 * * ? '

    await input.setValue(rawExpression)

    expect(wrapper.find('input').element.value).toBe(rawExpression)
    expect(wrapper.emitted('update:value')).toEqual([[rawExpression]])
    expect(wrapper.emitted('validate')?.slice(-1)[0]?.[0]).toMatchObject({
      status: 'valid',
      expression: '0 0 9 * * ?',
    })
  })

  it('applies a preset through the same valid change path', async () => {
    const wrapper = mount(Cron, {
      props: {
        presets: [{ label: 'Daily', value: '0 0 9 * * ?' }],
      },
    })

    const preset = wrapper.findAll('button').find(button => button.text() === 'Daily')
    await preset?.trigger('click')

    expect(wrapper.emitted('update:value')).toEqual([['0 0 9 * * ?']])
    expect(wrapper.emitted('change')).toEqual([['0 0 9 * * ?']])
  })

  it('supports readonly without disabling expression selection', async () => {
    const wrapper = mount(Cron, {
      props: {
        value: '0 0 9 * * ?',
        readonly: true,
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('readonly')).toBeDefined()
    await input.setValue('0 0 10 * * ?')
    expect(wrapper.emitted('update:value')).toBeUndefined()
  })

  it('merges ProConfigProvider defaults and semantic customization', () => {
    const ConfiguredCron = defineComponent(() => {
      useProConfigProvider(ref({
        cron: {
          preview: true,
          class: 'from-provider',
          classes: { preview: 'custom-preview' },
          styles: { preview: { padding: '4px' } },
        },
      }))
      return () => h(Cron, { value: '0 */5 * * * ?' })
    })
    const wrapper = mount(ConfiguredCron)

    expect(wrapper.find('.ant-cron').classes()).toContain('from-provider')
    expect(wrapper.find('.custom-preview').attributes('style')).toContain('padding: 4px')
    expect(wrapper.find('.custom-preview').text()).toContain('Start at minute 0, then execute every 5 minutes')
  })

  it('uses the Antdv ConfigProvider locale and DatePicker date-time format', () => {
    const locale = {
      ...zhCN,
      DatePicker: {
        ...zhCN.DatePicker!,
        lang: {
          ...zhCN.DatePicker!.lang,
          fieldDateTimeFormat: 'YYYY年MM月DD日 HH:mm:ss',
        },
      },
    }
    const wrapper = mount(ConfigProvider, {
      props: {
        locale,
      },
      slots: {
        default: () => h(Cron, { value: '0 */5 * * * ?', preview: true }),
      },
    })

    expect(wrapper.find('[data-field="second"].ant-cron-field-tab-label').text()).toBe('Second')
    expect(wrapper.find('.ant-cron-preview').text()).toContain('Start at minute 0, then execute every 5 minutes')
    expect(wrapper.find('.ant-cron-preview').text()).toMatch(/Next run: \d{4}年\d{2}月\d{2}日/)
  })

  it('ignores the deprecated DatePicker date-time format and uses the picker default', () => {
    const locale = {
      ...enUS,
      DatePicker: {
        ...enUS.DatePicker!,
        dateTimeFormat: '[deprecated]',
      },
    }
    const wrapper = mount(ConfigProvider, {
      props: { locale },
      slots: {
        default: () => h(Cron, { value: '0 */5 * * * ?', preview: true }),
      },
    })

    expect(wrapper.find('.ant-cron-preview').text()).toMatch(/Next run: \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)
    expect(wrapper.find('.ant-cron-preview').text()).not.toContain('deprecated')
  })

  it('renders Cron messages from a translated Pro locale wrapper', () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: proFrFR },
      slots: {
        default: () => h(Cron, { value: '0 */5 * * * ?', preview: true }),
      },
    })

    expect(wrapper.find('[data-field="second"].ant-cron-field-tab-label').text()).toBe('Seconde')
    expect(wrapper.find('.ant-cron-preview').text()).toContain('Commencer à minute 0, puis exécuter toutes les 5 minutes')
  })

  it('follows dynamic and nested Antdv locales with an English fallback', async () => {
    const activeLocale = ref(enUS)
    const DynamicLocale = defineComponent(() => () => h(ConfigProvider, { locale: activeLocale.value }, {
      default: () => h(Cron, { value: '0 */5 * * * ?' }),
    }))
    const dynamicWrapper = mount(DynamicLocale)

    expect(dynamicWrapper.find('[data-field="second"].ant-cron-field-tab-label').text()).toBe('Second')
    activeLocale.value = zhCN
    await nextTick()
    expect(dynamicWrapper.find('[data-field="second"].ant-cron-field-tab-label').text()).toBe('Second')

    const nestedWrapper = mount(ConfigProvider, {
      props: { locale: zhCN },
      slots: {
        default: () => h(ConfigProvider, { locale: enUS }, {
          default: () => h(Cron, { value: '0 */5 * * * ?' }),
        }),
      },
    })
    expect(nestedWrapper.find('[data-field="second"].ant-cron-field-tab-label').text()).toBe('Second')

    const fallbackWrapper = mount(ConfigProvider, {
      props: { locale: frFR },
      slots: { default: () => h(Cron, { value: '0 */5 * * * ?' }) },
    })
    expect(fallbackWrapper.find('[data-field="second"].ant-cron-field-tab-label').text()).toBe('Second')
  })

  it('integrates draft values, validation, and reset with Form.Item', async () => {
    const initialValue = '0 0 9 * * ?'
    const model = reactive({ cron: initialValue })
    const formRef = ref<any>()
    const FormDemo = defineComponent(() => () => h(Form, { ref: formRef, model }, {
      default: () => h(FormItem, {
        name: 'cron',
        rules: [
          { required: true, message: 'Cron is required' },
          {
            validator: async (_rule: unknown, value: string) => {
              if (value && validateExpression(value).status !== 'valid')
                throw new Error('Invalid Cron expression')
            },
          },
        ],
      }, {
        default: () => h(Cron, {
          value: model.cron,
          'onUpdate:value': (value: string) => (model.cron = value),
        }),
      }),
    }))
    const wrapper = mount(FormDemo)
    const input = wrapper.find('input')

    await input.setValue('invalid')
    expect(model.cron).toBe('invalid')
    await expect(formRef.value.validateFields()).rejects.toBeDefined()

    await input.setValue('0 0 10 * * ?')
    await expect(formRef.value.validateFields()).resolves.toMatchObject({ cron: '0 0 10 * * ?' })

    await input.setValue('')
    await expect(formRef.value.validateFields()).rejects.toBeDefined()
    formRef.value.resetFields()
    await nextTick()
    expect(model.cron).toBe(initialValue)
    expect(wrapper.find('input').element.value).toBe(initialValue)
  })

  it('inherits disabled, size, and status from Antdv Form', () => {
    const wrapper = mount(Form, {
      props: { disabled: true, model: { cron: '0 0 9 * * ?' }, size: 'large' },
      slots: {
        default: () => h(FormItem, { name: 'cron', validateStatus: 'warning' }, {
          default: () => h(Cron, { value: '0 0 9 * * ?' }),
        }),
      },
    })
    const cron = wrapper.find('.ant-cron')

    expect(cron.attributes('data-disabled')).toBe('true')
    expect(cron.attributes('data-size')).toBe('large')
    expect(cron.attributes('data-status')).toBe('warning')
    expect(cron.classes()).toContain('ant-cron-status-warning')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('applies the Cron size to the root layout', () => {
    for (const size of ['small', 'medium', 'large'] as const) {
      const wrapper = mount(Cron, { props: { size } })
      const cron = wrapper.find('.ant-cron')
      expect(cron.attributes('data-size')).toBe(size)
      expect(cron.classes()).toContain(`ant-cron-${size}`)
    }
  })

  it('keeps numeric and named month lists visible in the Select', async () => {
    const wrapper = mount(Cron, { props: { value: '0 0 9 ? 1 MON' } })
    await wrapper.find('[data-field="month"].ant-cron-field-tab-label').trigger('click')
    expect(wrapper.find('.ant-cron-specific-select').exists()).toBe(true)
    expect(wrapper.findAll('.ant-select-selection-item').map(item => item.text())).toContain('Jan')

    await wrapper.setProps({ value: '0 0 9 ? JAN,MAR MON' })
    expect(wrapper.find('.ant-cron-field[data-field="month"]').attributes('data-mode')).toBe('specified')
    expect(wrapper.findAll('.ant-select-selection-item').map(item => item.text())).toEqual(['Jan', 'Mar'])
  })

  it('uses full-width Select controls for every specified field', async () => {
    const wrapper = mount(Cron, { props: { value: '0 0 9 15 1 ?' } })

    expect(wrapper.find('.ant-cron-specific-select').exists()).toBe(true)

    await wrapper.find('[data-field="second"].ant-cron-field-tab-label').trigger('click')
    expect(wrapper.find('.ant-cron-specific-select').exists()).toBe(true)

    await wrapper.find('[data-field="hour"].ant-cron-field-tab-label').trigger('click')
    expect(wrapper.find('.ant-cron-specific-select').exists()).toBe(true)

    await wrapper.find('[data-field="day"].ant-cron-field-tab-label').trigger('click')
    expect(wrapper.find('.ant-cron-specific-select').exists()).toBe(true)

    await wrapper.find('[data-field="month"].ant-cron-field-tab-label').trigger('click')
    expect(wrapper.find('.ant-cron-specific-select').exists()).toBe(true)

    const weekWrapper = mount(Cron, { props: { value: '0 0 9 ? * MON' } })
    await weekWrapper.find('[data-field="week"].ant-cron-field-tab-label').trigger('click')
    expect(weekWrapper.find('.ant-cron-specific-select').exists()).toBe(true)
  })

  it('renders an accessible field tab interface', async () => {
    const wrapper = mount(Cron)
    const tabs = wrapper.findAll('[role="tab"]')
    const panel = wrapper.find('[role="tabpanel"]')

    expect(tabs).toHaveLength(6)
    expect(wrapper.find('[role="tablist"]').attributes('aria-label')).toBe('Cron fields')
    expect(tabs[0]!.element.tagName).toBe('SPAN')
    expect(tabs[1]!.attributes('aria-controls')).toBe(panel.attributes('id'))
    expect(panel.attributes('aria-labelledby')).toBe(tabs[1]!.attributes('id'))

    await tabs[1]!.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.find('[role="tabpanel"]').attributes('data-field')).toBe('hour')
  })

  it('renders clear inline mode summaries without legacy description blocks', async () => {
    const mountCron = (value: string) => mount(ConfigProvider, {
      props: { locale: proZhCN },
      slots: { default: () => h(Cron, { value }) },
    })
    let wrapper = mountCron('0 */5 9 * * ?')

    expect(wrapper.find('.ant-cron-field-control-summary').text()).toBe('每 5 分钟执行一次')
    expect((wrapper.find('.ant-cron-controls input').element as HTMLInputElement).value).toBe('5')
    expect(wrapper.find('.ant-cron-description').exists()).toBe(false)
    expect(wrapper.find('.ant-cron-field-mode-description').exists()).toBe(false)

    wrapper = mountCron('0 10,20,30 9 * * ?')
    expect(wrapper.find('.ant-cron-field-control-summary').text()).toBe('每小时的第 10、20、30 分钟执行')

    wrapper = mountCron('0 10-30 9 * * ?')
    expect(wrapper.find('.ant-cron-field-control-summary').text()).toBe('每小时第 10～30 分钟执行')
  })

  it('keeps day and week every-mode mutually exclusive', async () => {
    const mountCron = (value: string) => mount(ConfigProvider, {
      props: { locale: proZhCN },
      slots: { default: () => h(Cron, { value }) },
    })

    let wrapper = mountCron('0 0 9 * * ?')
    await wrapper.find('[data-field="week"].ant-cron-field-tab-label').trigger('click')
    expect(wrapper.find('.ant-cron-field').attributes('data-mode')).toBe('unspecified')
    expect(wrapper.find('.ant-cron-field-control-summary').text()).toBe('不指定星期，按日期执行')
    await wrapper.find('[data-field="day"].ant-cron-field-tab-label').trigger('click')
    expect(wrapper.find('.ant-cron-field').attributes('data-mode')).toBe('every')
    expect(wrapper.find('.ant-cron-field-control-summary').text()).toBe('每天执行一次')

    wrapper = mountCron('0 0 9 ? * *')
    await wrapper.find('[data-field="week"].ant-cron-field-tab-label').trigger('click')
    expect(wrapper.find('.ant-cron-field').attributes('data-mode')).toBe('every')
    expect(wrapper.find('.ant-cron-field-control-summary').text()).toBe('每天执行一次')
    await wrapper.find('[data-field="day"].ant-cron-field-tab-label').trigger('click')
    expect(wrapper.find('.ant-cron-field').attributes('data-mode')).toBe('unspecified')
    expect(wrapper.find('.ant-cron-field-control-summary').text()).toBe('不指定日期，按星期执行')
  })

  it('renders unix five fields and keeps both day and week specified', async () => {
    const wrapper = mount(Cron, {
      props: {
        format: 'unix',
        value: '0 9 * * 1-5',
      },
    })

    expect(wrapper.find('.ant-cron').attributes('data-format')).toBe('unix')
    expect(wrapper.findAll('[role="tab"]')).toHaveLength(5)
    expect(wrapper.find('[data-field="second"]').exists()).toBe(false)
    expect(wrapper.find('[role="alert"]').exists()).toBe(false)
    expect(wrapper.find('input').element.value).toBe('0 9 * * 1-5')

    const both = mount(Cron, {
      props: {
        format: 'unix',
        value: '0 9 1 * 1',
      },
    })
    expect(both.find('[role="alert"]').exists()).toBe(false)
    expect(both.find('input').element.value).toBe('0 9 1 * 1')

    await both.find('[data-field="day"].ant-cron-field-tab-label').trigger('click')
    expect(both.find('.ant-cron-field').attributes('data-mode')).toBe('specified')
    await both.find('[data-field="week"].ant-cron-field-tab-label').trigger('click')
    expect(both.find('.ant-cron-field').attributes('data-mode')).toBe('specified')
  })

  it('ignores showYear when format is unix', () => {
    const wrapper = mount(Cron, {
      props: {
        format: 'unix',
        showYear: true,
        value: '* * * * *',
      },
    })

    expect(wrapper.findAll('[role="tab"]')).toHaveLength(5)
    expect(wrapper.find('[data-field="year"]').exists()).toBe(false)
  })

  it('edits quartz special day and week syntax', async () => {
    const wrapper = mount(Cron, { props: { value: '0 0 9 L * ?' } })
    await wrapper.find('[data-field="day"].ant-cron-field-tab-label').trigger('click')
    expect(wrapper.find('.ant-cron-field').attributes('data-mode')).toBe('special')
    expect(wrapper.find('.ant-cron-special').exists()).toBe(true)

    const weekWrapper = mount(Cron, { props: { value: '0 0 9 ? * 6#3' } })
    await weekWrapper.find('[data-field="week"].ant-cron-field-tab-label').trigger('click')
    expect(weekWrapper.find('.ant-cron-field').attributes('data-mode')).toBe('special')
    expect(weekWrapper.find('.ant-cron-special').exists()).toBe(true)
    expect(weekWrapper.find('.ant-cron-field-control-summary').text()).toContain('3rd')
  })
})
