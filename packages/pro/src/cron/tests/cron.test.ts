import { mount } from '@vue/test-utils'
import { ConfigProvider } from 'antdv-next'
import zhCN from 'antdv-next/locale/zh_CN'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import ProConfigProvider from '../../config-provider'
import Cron from '../index'

describe('Cron', () => {
  it('exports Cron from the component entry', async () => {
    const module = await import('../../index')
    expect(module.Cron).toBeDefined()
  })

  it('only commits valid manual expressions', async () => {
    const wrapper = mount(Cron)
    const input = wrapper.find('input')

    await input.setValue('0 0 9 * * *')
    expect(wrapper.emitted('input')).toEqual([['0 0 9 * * *']])
    expect(wrapper.emitted('update:value')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()
    expect(wrapper.emitted('validate')?.slice(-1)[0]?.[0]).toMatchObject({ status: 'invalid' })

    await input.setValue('0 0 9 * * ?')
    expect(wrapper.emitted('update:value')).toEqual([['0 0 9 * * ?']])
    expect(wrapper.emitted('change')).toEqual([['0 0 9 * * ?']])
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
    const wrapper = mount(ProConfigProvider, {
      props: {
        cron: {
          preview: true,
          class: 'from-provider',
          classes: { preview: 'custom-preview' },
          styles: { preview: { padding: '4px' } },
        },
      },
      slots: {
        default: () => h(Cron, { value: '0 */5 * * * ?' }),
      },
    })

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
})
