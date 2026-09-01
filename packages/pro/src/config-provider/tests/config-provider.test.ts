/// <reference types="vite/client" />

import type { ProConfigProviderProps } from '../define'
import { mount } from '@vue/test-utils'
import AntConfigProvider from 'antdv-next/config-provider'
import { useBaseConfig, useComponentConfig, useConfig } from 'antdv-next/config-provider/context'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import enUS from '../../locale/en_US'
import ProConfigProvider, { useProComponentConfig } from '../index'

const ContextProbe = defineComponent(() => {
  const config = useConfig()
  const baseConfig = useBaseConfig('probe')
  const tableConfig = useComponentConfig('table')
  const scrollbarConfig = useProComponentConfig('scrollbar')

  return () => h('pre', { class: 'context-probe' }, JSON.stringify({
    locale: config.value.locale?.locale,
    direction: config.value.direction,
    themeColor: (config.value.theme as any)?.token?.colorPrimary,
    variant: config.value.variant,
    prefixCls: baseConfig.prefixCls.value,
    tableClass: tableConfig.value.class,
    scrollbarClass: scrollbarConfig.value.class,
  }))
})

const SlotProbe = defineComponent(() => {
  const config = useConfig()

  return () => h('div', { class: 'slot-probe' }, [
    h('span', { class: 'render-empty-result' }, config.value.renderEmpty?.('Probe' as any) as any),
    h('span', { class: 'transform-cell-result' }, config.value.transformCellText?.({
      text: 'raw',
      column: {} as any,
      record: {},
      index: 0,
    })),
  ])
})

function readContext(wrapper: ReturnType<typeof mount>) {
  return JSON.parse(wrapper.find('.context-probe').text()) as {
    locale?: string
    direction?: string
    themeColor?: string
    variant?: string
    prefixCls?: string
    tableClass?: string
    scrollbarClass?: string
  }
}

describe('ProConfigProvider', () => {
  it('accepts and forwards the complete antdv-next ConfigProvider prop surface', () => {
    const getPopupContainer = vi.fn()
    const getTargetContainer = vi.fn()
    const renderEmpty = vi.fn(() => h('span', 'empty'))
    const transformCellText = vi.fn(({ text }: { text: string }) => `transformed-${text}`)
    const props = {
      locale: enUS,
      prefixCls: 'custom',
      iconPrefixCls: 'custom-icon',
      direction: 'rtl',
      theme: { token: { colorPrimary: '#1677ff' } },
      componentSize: 'large',
      componentDisabled: true,
      getPopupContainer,
      getTargetContainer,
      csp: { nonce: 'nonce' },
      renderEmpty,
      transformCellText,
      virtual: false,
      popupMatchSelectWidth: false,
      popupOverflow: 'scroll',
      variant: 'filled',
      input: { allowClear: true },
      table: { class: 'table-from-provider' } as any,
      scrollbar: { class: 'scrollbar-from-provider' },
    } satisfies ProConfigProviderProps

    const wrapper = mount(ProConfigProvider, {
      props: props as any,
      slots: {
        default: () => h(ContextProbe),
      },
    })
    const antProvider = wrapper.findComponent(AntConfigProvider)

    expect(antProvider.exists()).toBe(true)
    expect(antProvider.props()).toMatchObject({
      locale: enUS,
      prefixCls: 'custom',
      iconPrefixCls: 'custom-icon',
      direction: 'rtl',
      theme: props.theme,
      componentSize: 'large',
      componentDisabled: true,
      getPopupContainer,
      getTargetContainer,
      csp: { nonce: 'nonce' },
      renderEmpty,
      transformCellText,
      virtual: false,
      popupMatchSelectWidth: false,
      popupOverflow: 'scroll',
      variant: 'filled',
      input: { allowClear: true },
      table: { class: 'table-from-provider' },
    })
    expect('scrollbar' in antProvider.props()).toBe(false)
    expect(readContext(wrapper)).toMatchObject({
      locale: 'en',
      direction: 'rtl',
      variant: 'filled',
      prefixCls: 'custom-probe',
      tableClass: 'table-from-provider',
      scrollbarClass: 'scrollbar-from-provider',
    })
  })

  it('inherits outer ConfigProvider values and lets explicit inner values win', () => {
    const outerLocale = { ...enUS, locale: 'outer-locale' }
    const innerLocale = { ...enUS, locale: 'inner-locale' }
    const wrapper = mount(AntConfigProvider, {
      props: {
        locale: outerLocale,
        direction: 'ltr',
        theme: { token: { colorPrimary: '#111111' } },
      },
      slots: {
        default: () => h(ProConfigProvider, {
          locale: innerLocale,
          direction: 'rtl',
          theme: { token: { colorPrimary: '#222222' } },
        }, {
          default: () => h(ContextProbe),
        }),
      },
    })

    expect(readContext(wrapper)).toMatchObject({
      locale: 'inner-locale',
      direction: 'rtl',
      themeColor: '#222222',
    })
  })

  it('inherits outer ConfigProvider values when the inner provider omits them', () => {
    const outerLocale = { ...enUS, locale: 'outer-locale' }
    const wrapper = mount(AntConfigProvider, {
      props: {
        locale: outerLocale,
        direction: 'ltr',
        theme: { token: { colorPrimary: '#111111' } },
      },
      slots: {
        default: () => h(ProConfigProvider, {}, {
          default: () => h(ContextProbe),
        }),
      },
    })

    expect(readContext(wrapper)).toMatchObject({
      locale: 'outer-locale',
      direction: 'ltr',
      themeColor: '#111111',
    })
  })

  it('updates forwarded props and Pro config when props change', async () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        direction: 'ltr',
        scrollbar: { class: 'initial-scrollbar' },
      },
      slots: {
        default: () => h(ContextProbe),
      },
    })
    const antProvider = wrapper.findComponent(AntConfigProvider)

    expect(antProvider.props()).toMatchObject({ direction: 'ltr' })
    expect(readContext(wrapper)).toMatchObject({
      direction: 'ltr',
      scrollbarClass: 'initial-scrollbar',
    })

    await wrapper.setProps({
      direction: 'rtl',
      scrollbar: { class: 'updated-scrollbar' },
    })

    expect(antProvider.props()).toMatchObject({ direction: 'rtl' })
    expect(readContext(wrapper)).toMatchObject({
      direction: 'rtl',
      scrollbarClass: 'updated-scrollbar',
    })
  })

  it('forwards the default and ConfigProvider named slots', () => {
    const wrapper = mount(ProConfigProvider, {
      slots: {
        default: () => h(SlotProbe),
        renderEmpty: () => 'slot-empty',
        transformCellText: ({ text }: any) => `slot-${text}`,
        custom: () => h('span', { class: 'custom-slot' }, 'custom'),
      },
    })
    const antProvider = wrapper.findComponent(AntConfigProvider)

    expect(wrapper.find('.slot-probe').exists()).toBe(true)
    expect(wrapper.find('.render-empty-result').text()).toBe('slot-empty')
    expect(wrapper.find('.transform-cell-result').text()).toBe('slot-raw')
    expect(antProvider.vm.$slots.custom?.()).toEqual(expect.arrayContaining([
      expect.objectContaining({ props: expect.objectContaining({ class: 'custom-slot' }) }),
    ]))
  })
})
