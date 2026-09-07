import { mount } from '@vue/test-utils'
import { ConfigProvider, Form, FormItem } from 'antdv-next'
import enUS from 'antdv-next/locale/en_US'
import frFR from 'antdv-next/locale/fr_FR'
import zhCN from 'antdv-next/locale/zh_CN'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, reactive, ref } from 'vue'
import { useProConfigProvider } from '../../config-provider/context'
import proFrFR from '../../locale/fr_FR'
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
    expect(wrapper.emitted('change')).toEqual([['0 0 9 * * *']])
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
    expect(wrapper.find('.custom-preview').text()).toContain('Every 5 minutes')
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

    expect(wrapper.find('[data-field="second"]').text()).toBe('秒')
    expect(wrapper.find('.ant-cron-preview').text()).toContain('每 5 分钟')
    expect(wrapper.find('.ant-cron-preview').text()).toMatch(/下次执行：\d{4}年\d{2}月\d{2}日/)
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

    expect(wrapper.find('[data-field="second"]').text()).toBe('Seconde')
    expect(wrapper.find('.ant-cron-preview').text()).toContain('Toutes les 5 minutes')
  })

  it('follows dynamic and nested Antdv locales with an English fallback', async () => {
    const activeLocale = ref(enUS)
    const DynamicLocale = defineComponent(() => () => h(ConfigProvider, { locale: activeLocale.value }, {
      default: () => h(Cron, { value: '0 */5 * * * ?' }),
    }))
    const dynamicWrapper = mount(DynamicLocale)

    expect(dynamicWrapper.find('[data-field="second"]').text()).toBe('Second')
    activeLocale.value = zhCN
    await nextTick()
    expect(dynamicWrapper.find('[data-field="second"]').text()).toBe('秒')

    const nestedWrapper = mount(ConfigProvider, {
      props: { locale: zhCN },
      slots: {
        default: () => h(ConfigProvider, { locale: enUS }, {
          default: () => h(Cron, { value: '0 */5 * * * ?' }),
        }),
      },
    })
    expect(nestedWrapper.find('[data-field="second"]').text()).toBe('Second')

    const fallbackWrapper = mount(ConfigProvider, {
      props: { locale: frFR },
      slots: { default: () => h(Cron, { value: '0 */5 * * * ?' }) },
    })
    expect(fallbackWrapper.find('[data-field="second"]').text()).toBe('Second')
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

  it('keeps numeric and named month lists visible in the same selector', async () => {
    const wrapper = mount(Cron, { props: { value: '0 0 9 ? 1 MON' } })
    await wrapper.find('button[data-field="month"]').trigger('click')
    expect(wrapper.find('.ant-select-selection-item').text()).toBe('JAN')

    await wrapper.setProps({ value: '0 0 9 ? JAN,MAR MON' })
    expect(wrapper.find('.ant-cron-field[data-field="month"]').attributes('data-mode')).toBe('list')
    expect(wrapper.findAll('.ant-select-selection-item').map(item => item.text())).toEqual(['JAN', 'MAR'])
  })
})
