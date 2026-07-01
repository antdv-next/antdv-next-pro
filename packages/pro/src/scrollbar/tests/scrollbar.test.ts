import { mount } from '@vue/test-utils'
import { useBaseConfig } from 'antdv-next/config-provider/context'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { useProComponentConfig } from '../../config-provider'
import { ProConfigProvider, Scrollbar } from '../../index'

const PrefixProbe = defineComponent(() => {
  const { prefixCls } = useBaseConfig('scrollbar')
  return () => h('div', { class: 'prefix-probe' }, prefixCls.value)
})

const ProScrollbarProbe = defineComponent(() => {
  const config = useProComponentConfig('scrollbar')
  return () => h('div', { class: 'pro-scrollbar-probe' }, config.value.class ?? 'empty')
})

function mockScrollMetrics(element: Element, metrics: Partial<Record<'clientWidth' | 'clientHeight' | 'scrollWidth' | 'scrollHeight' | 'scrollLeft' | 'scrollTop', number>>) {
  Object.entries(metrics).forEach(([key, value]) => {
    Object.defineProperty(element, key, {
      configurable: true,
      writable: true,
      value,
    })
  })
}

class TestResizeObserver {
  static instances: TestResizeObserver[] = []

  private readonly observed = new Set<Element>()
  private readonly callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
    TestResizeObserver.instances.push(this)
  }

  observe = vi.fn((target: Element) => {
    this.observed.add(target)
  })

  unobserve = vi.fn((target: Element) => {
    this.observed.delete(target)
  })

  disconnect = vi.fn(() => {
    this.observed.clear()
  })

  trigger(target: Element) {
    if (!this.observed.has(target)) {
      return
    }

    this.callback([{ target } as ResizeObserverEntry], this as unknown as ResizeObserver)
  }

  static reset() {
    TestResizeObserver.instances = []
  }

  static trigger(target: Element) {
    TestResizeObserver.instances.forEach(instance => instance.trigger(target))
  }
}

function installResizeObserverMock() {
  const originResizeObserver = globalThis.ResizeObserver

  TestResizeObserver.reset()
  globalThis.ResizeObserver = TestResizeObserver as unknown as typeof ResizeObserver

  return () => {
    globalThis.ResizeObserver = originResizeObserver
    TestResizeObserver.reset()
  }
}

describe('Scrollbar', () => {
  it('exports Scrollbar from package entry', async () => {
    const mod = await import('../../index')
    expect(mod.Scrollbar).toBeDefined()
  })

  it('exports ProConfigProvider from package entry', async () => {
    const mod = await import('../../index')
    expect(mod.ProConfigProvider).toBeDefined()
  })

  it('passes shared config through ProConfigProvider', () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        prefixCls: 'custom',
      },
      slots: {
        default: () => h(PrefixProbe),
      },
    })

    expect(wrapper.find('.prefix-probe').text()).toBe('custom-scrollbar')
  })

  it('provides pro scrollbar defaults from ProConfigProvider', () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        scrollbar: {
          class: 'from-provider',
        },
      },
      slots: {
        default: () => h(ProScrollbarProbe),
      },
    })

    expect(wrapper.find('.pro-scrollbar-probe').text()).toBe('from-provider')
  })

  it('renders slot content in Scrollbar', () => {
    const wrapper = mount(Scrollbar, {
      slots: {
        default: () => h('div', { class: 'scroll-content' }, 'content'),
      },
    })

    expect(wrapper.find('.scroll-content').exists()).toBe(true)
  })

  it('uses the shared prefixCls and provider class in Scrollbar', () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        prefixCls: 'custom',
        scrollbar: {
          class: 'from-provider',
        },
      },
      slots: {
        default: () => h(Scrollbar),
      },
    })

    expect(wrapper.find('.custom-scrollbar').exists()).toBe(true)
    expect(wrapper.find('.from-provider').exists()).toBe(true)
  })

  it('supports semantic classes and styles as objects', async () => {
    const wrapper = mount(Scrollbar, {
      props: {
        visibilityX: 'always',
        visibilityY: 'always',
        classes: {
          root: 'scrollbar-root',
          container: 'scrollbar-container',
          content: 'scrollbar-content',
          track: 'scrollbar-track',
          trackY: 'scrollbar-track-y',
          trackX: 'scrollbar-track-x',
          thumb: 'scrollbar-thumb',
          thumbY: 'scrollbar-thumb-y',
          thumbX: 'scrollbar-thumb-x',
        },
        styles: {
          root: { padding: '4px' },
          container: { outline: '1px solid red' },
          content: { minWidth: '320px' },
          track: { backgroundColor: 'rgb(1, 2, 3)' },
          thumb: { backgroundColor: 'rgb(4, 5, 6)' },
        },
      },
    })

    await nextTick()

    expect(wrapper.find('.ant-scrollbar').classes()).toContain('scrollbar-root')
    expect(wrapper.find('.ant-scrollbar').attributes('style')).toContain('padding: 4px')
    expect(wrapper.find('.ant-scrollbar-container').classes()).toContain('scrollbar-container')
    expect(wrapper.find('.ant-scrollbar-container').attributes('style')).toContain('outline: 1px solid red')
    expect(wrapper.find('.ant-scrollbar-content').classes()).toContain('scrollbar-content')
    expect(wrapper.find('.ant-scrollbar-content').attributes('style')).toContain('min-width: 320px')
    expect(wrapper.find('.ant-scrollbar-track-y').classes()).toContain('scrollbar-track')
    expect(wrapper.find('.ant-scrollbar-track-y').classes()).toContain('scrollbar-track-y')
    expect(wrapper.find('.ant-scrollbar-track-y').attributes('style')).toContain('background-color: rgb(1, 2, 3)')
    expect(wrapper.find('.ant-scrollbar-thumb-y').classes()).toContain('scrollbar-thumb')
    expect(wrapper.find('.ant-scrollbar-thumb-y').classes()).toContain('scrollbar-thumb-y')
    expect(wrapper.find('.ant-scrollbar-thumb-y').attributes('style')).toContain('background-color: rgb(4, 5, 6)')
    expect(wrapper.find('.ant-scrollbar-track-x').classes()).toContain('scrollbar-track-x')
    expect(wrapper.find('.ant-scrollbar-thumb-x').classes()).toContain('scrollbar-thumb-x')
  })

  it('supports semantic classes and styles as functions', async () => {
    const classes = vi.fn((info: { props: any }) => ({
      root: info.props.native ? 'native-root' : 'custom-root',
      content: 'dynamic-content',
      trackY: info.props.visibilityY === 'always' ? 'always-track-y' : 'auto-track-y',
      thumbY: 'dynamic-thumb-y',
    }))

    const styles = vi.fn((info: { props: any }) => ({
      root: { margin: info.props.native ? '1px' : '2px' },
      content: { paddingBottom: info.props.native ? '3px' : '5px' },
      thumbY: { backgroundColor: info.props.visibilityY === 'always' ? 'rgb(7, 8, 9)' : 'rgb(9, 8, 7)' },
    }))

    const wrapper = mount(Scrollbar, {
      props: {
        visibilityY: 'always',
        classes,
        styles,
      },
    })

    await nextTick()

    expect(classes).toHaveBeenCalled()
    expect(styles).toHaveBeenCalled()
    expect(wrapper.find('.ant-scrollbar').classes()).toContain('custom-root')
    expect(wrapper.find('.ant-scrollbar').attributes('style')).toContain('margin: 2px')
    expect(wrapper.find('.ant-scrollbar-content').classes()).toContain('dynamic-content')
    expect(wrapper.find('.ant-scrollbar-content').attributes('style')).toContain('padding-bottom: 5px')
    expect(wrapper.find('.ant-scrollbar-track-y').classes()).toContain('always-track-y')
    expect(wrapper.find('.ant-scrollbar-thumb-y').classes()).toContain('dynamic-thumb-y')
    expect(wrapper.find('.ant-scrollbar-thumb-y').attributes('style')).toContain('background-color: rgb(7, 8, 9)')

    await wrapper.setProps({
      native: true,
      visibilityY: 'auto',
    })

    expect(wrapper.find('.ant-scrollbar').classes()).toContain('native-root')
  })

  it('merges semantic classes and styles from ProConfigProvider and component props', async () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        scrollbar: {
          classes: {
            root: 'provider-root',
            content: 'provider-content',
            trackY: 'provider-track-y',
          },
          styles: {
            root: { border: '1px solid blue' },
            content: { borderBottom: '1px solid red' },
            thumbY: { borderRadius: '20px' },
          },
        },
      },
      slots: {
        default: () =>
          h(Scrollbar, {
            visibilityY: 'always',
            classes: {
              root: 'props-root',
              content: 'props-content',
              thumbY: 'props-thumb-y',
            },
            styles: {
              root: { padding: '6px' },
              content: { backgroundColor: 'rgb(200, 201, 202)' },
              thumbY: { backgroundColor: 'rgb(10, 11, 12)' },
            },
          }),
      },
    })

    await nextTick()

    const root = wrapper.find('.ant-scrollbar')
    const content = wrapper.find('.ant-scrollbar-content')
    const thumbY = wrapper.find('.ant-scrollbar-thumb-y')

    expect(root.classes()).toContain('provider-root')
    expect(root.classes()).toContain('props-root')
    expect(root.attributes('style')).toContain('border: 1px solid blue')
    expect(root.attributes('style')).toContain('padding: 6px')
    expect(content.classes()).toContain('provider-content')
    expect(content.classes()).toContain('props-content')
    expect(content.attributes('style')).toContain('border-bottom: 1px solid red')
    expect(content.attributes('style')).toContain('background-color: rgb(200, 201, 202)')
    expect(wrapper.find('.ant-scrollbar-track-y').classes()).toContain('provider-track-y')
    expect(thumbY.classes()).toContain('props-thumb-y')
    expect(thumbY.attributes('style')).toContain('border-radius: 20px')
    expect(thumbY.attributes('style')).toContain('background-color: rgb(10, 11, 12)')
  })

  it('uses provider visibility defaults when component props are absent', async () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        scrollbar: {
          visibilityY: 'always',
        },
      },
      slots: {
        default: () => h(Scrollbar),
      },
    })

    await nextTick()

    expect(wrapper.find('.ant-scrollbar').attributes('data-visibility-y')).toBe('always')
    expect(wrapper.find('.ant-scrollbar-track-y').exists()).toBe(true)
  })

  it('adds the css var root class when cssVar mode is enabled', () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        theme: {
          cssVar: {
            key: 'pro-scrollbar-test',
          },
        },
      },
      slots: {
        default: () => h(Scrollbar),
      },
    })

    expect(wrapper.find('.ant-scrollbar-css-var').exists()).toBe(true)
  })

  it('renders a vertical custom scrollbar when vertical overflow exists', async () => {
    const wrapper = mount(Scrollbar, {
      slots: {
        default: () => h('div', { class: 'scroll-content' }, 'content'),
      },
    })

    const container = wrapper.find('.ant-scrollbar-container')
    mockScrollMetrics(container.element, {
      clientHeight: 100,
      scrollHeight: 240,
      scrollTop: 0,
      clientWidth: 100,
      scrollWidth: 100,
      scrollLeft: 0,
    })

    await container.trigger('scroll')
    await nextTick()

    expect(wrapper.find('.ant-scrollbar-track-y').exists()).toBe(true)
    expect(wrapper.find('.ant-scrollbar-thumb-y').exists()).toBe(true)
  })

  it('emits scroll when container scrolls', async () => {
    const wrapper = mount(Scrollbar)
    const container = wrapper.find('.ant-scrollbar-container')

    await container.trigger('scroll')

    expect(wrapper.emitted('scroll')).toHaveLength(1)
  })

  it('renders a horizontal custom scrollbar when horizontal overflow exists', async () => {
    const wrapper = mount(Scrollbar, {
      slots: {
        default: () => h('div', { class: 'scroll-content' }, 'content'),
      },
    })

    const container = wrapper.find('.ant-scrollbar-container')
    mockScrollMetrics(container.element, {
      clientHeight: 100,
      scrollHeight: 100,
      scrollTop: 0,
      clientWidth: 100,
      scrollWidth: 240,
      scrollLeft: 0,
    })

    await container.trigger('scroll')
    await nextTick()

    expect(wrapper.find('.ant-scrollbar-track-x').exists()).toBe(true)
    expect(wrapper.find('.ant-scrollbar-thumb-x').exists()).toBe(true)
  })

  it('hides the custom scrollbar when the axis visibility is hidden', async () => {
    const wrapper = mount(Scrollbar, {
      props: {
        visibilityY: 'hidden',
      },
    })

    const container = wrapper.find('.ant-scrollbar-container')
    mockScrollMetrics(container.element, {
      clientHeight: 100,
      scrollHeight: 240,
      scrollTop: 0,
      clientWidth: 100,
      scrollWidth: 100,
      scrollLeft: 0,
    })

    await container.trigger('scroll')
    await nextTick()

    expect(wrapper.find('.ant-scrollbar-track-y').exists()).toBe(false)
  })

  it('renders the custom scrollbar when the axis visibility is always', async () => {
    const wrapper = mount(Scrollbar, {
      props: {
        visibilityX: 'always',
      },
    })

    await nextTick()

    expect(wrapper.find('.ant-scrollbar-track-x').exists()).toBe(true)
  })

  it('renders track motion through transition props', async () => {
    const wrapper = mount(Scrollbar, {
      props: {
        visibilityY: 'always',
      },
    })

    await nextTick()

    const transition = wrapper.find('transition-stub')

    expect(transition.exists()).toBe(true)
    expect(transition.attributes('name')).toBe('ant-scrollbar-track-motion')
  })

  it('auto hides overlays after pointer leaves and shows them again on re-enter', async () => {
    vi.useFakeTimers()

    try {
      const wrapper = mount(Scrollbar, {
        props: {
          hideDelay: 100,
        },
      })

      const root = wrapper.find('.ant-scrollbar')
      const container = wrapper.find('.ant-scrollbar-container')

      mockScrollMetrics(container.element, {
        clientHeight: 100,
        scrollHeight: 240,
        scrollTop: 0,
        clientWidth: 100,
        scrollWidth: 100,
        scrollLeft: 0,
      })

      await container.trigger('scroll')
      await nextTick()

      expect(wrapper.find('.ant-scrollbar-track-y').exists()).toBe(true)

      await root.trigger('mouseleave')
      await vi.advanceTimersByTimeAsync(100)
      await nextTick()

      expect(wrapper.find('.ant-scrollbar-track-y').exists()).toBe(false)

      await root.trigger('mouseenter')
      await nextTick()

      expect(wrapper.find('.ant-scrollbar-track-y').exists()).toBe(true)
    }
    finally {
      vi.useRealTimers()
    }
  })

  it('disables custom overlays in native mode', async () => {
    const wrapper = mount(Scrollbar, {
      props: {
        native: true,
        visibilityX: 'always',
        visibilityY: 'always',
      },
    })

    await nextTick()

    expect(wrapper.find('.ant-scrollbar-track-x').exists()).toBe(false)
    expect(wrapper.find('.ant-scrollbar-track-y').exists()).toBe(false)
  })

  it('restores native scrollbar styles in native mode', async () => {
    mount(Scrollbar, {
      props: {
        native: true,
      },
    })

    await nextTick()

    const styleText = Array.from(document.head.querySelectorAll('style'))
      .map(node => node.textContent ?? '')
      .join('\n')

    expect(styleText).toContain('.ant-scrollbar-native')
    expect(styleText).toContain('scrollbar-width:auto')
    expect(styleText).toContain('ms-overflow-style:auto')
  })

  it('updates tracks when content size changes without a scroll event', async () => {
    const restoreResizeObserver = installResizeObserverMock()

    try {
      const wrapper = mount(Scrollbar, {
        slots: {
          default: () => h('div', { class: 'scroll-content' }, 'content'),
        },
      })

      const container = wrapper.find('.ant-scrollbar-container')
      mockScrollMetrics(container.element, {
        clientHeight: 100,
        scrollHeight: 100,
        scrollTop: 0,
        clientWidth: 100,
        scrollWidth: 100,
        scrollLeft: 0,
      })

      await container.trigger('scroll')
      await nextTick()

      expect(wrapper.find('.ant-scrollbar-track-y').exists()).toBe(false)

      const content = wrapper.find('.ant-scrollbar-content')
      expect(content.exists()).toBe(true)

      mockScrollMetrics(container.element, {
        scrollHeight: 240,
      })

      TestResizeObserver.trigger(content.element)
      await nextTick()

      expect(wrapper.find('.ant-scrollbar-track-y').exists()).toBe(true)
    }
    finally {
      restoreResizeObserver()
    }
  })

  it('updates thumb size when container size changes without scrolling', async () => {
    const restoreResizeObserver = installResizeObserverMock()

    try {
      const wrapper = mount(Scrollbar, {
        props: {
          visibilityY: 'always',
        },
      })

      const container = wrapper.find('.ant-scrollbar-container')
      mockScrollMetrics(container.element, {
        clientHeight: 100,
        scrollHeight: 300,
        scrollTop: 0,
        clientWidth: 100,
        scrollWidth: 100,
        scrollLeft: 0,
      })

      await container.trigger('scroll')
      await nextTick()

      const initialThumbHeight = Number.parseFloat((wrapper.find('.ant-scrollbar-thumb-y').element as HTMLElement).style.height)

      mockScrollMetrics(container.element, {
        clientHeight: 150,
      })

      TestResizeObserver.trigger(container.element)
      await nextTick()

      const nextThumbHeight = Number.parseFloat((wrapper.find('.ant-scrollbar-thumb-y').element as HTMLElement).style.height)

      expect(nextThumbHeight).toBeGreaterThan(initialThumbHeight)
    }
    finally {
      restoreResizeObserver()
    }
  })

  it('updates scrollTop when dragging the vertical thumb', async () => {
    const wrapper = mount(Scrollbar)
    const container = wrapper.find('.ant-scrollbar-container')
    let scrollTop = 0

    Object.defineProperty(container.element, 'scrollTop', {
      configurable: true,
      get: () => scrollTop,
      set: value => (scrollTop = Number(value)),
    })

    mockScrollMetrics(container.element, {
      clientHeight: 100,
      scrollHeight: 300,
      clientWidth: 100,
      scrollWidth: 100,
      scrollLeft: 0,
    })

    await container.trigger('scroll')
    await nextTick()

    await wrapper.find('.ant-scrollbar-thumb-y').trigger('mousedown', { clientY: 0 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientY: 20 }))
    document.dispatchEvent(new MouseEvent('mouseup'))

    expect(scrollTop).toBeGreaterThan(0)
  })

  it('updates scrollLeft when dragging the horizontal thumb', async () => {
    const wrapper = mount(Scrollbar)
    const container = wrapper.find('.ant-scrollbar-container')
    let scrollLeft = 0

    Object.defineProperty(container.element, 'scrollLeft', {
      configurable: true,
      get: () => scrollLeft,
      set: value => (scrollLeft = Number(value)),
    })

    mockScrollMetrics(container.element, {
      clientHeight: 100,
      scrollHeight: 100,
      scrollTop: 0,
      clientWidth: 100,
      scrollWidth: 300,
    })

    await container.trigger('scroll')
    await nextTick()

    await wrapper.find('.ant-scrollbar-thumb-x').trigger('mousedown', { clientX: 0 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 20 }))
    document.dispatchEvent(new MouseEvent('mouseup'))

    expect(scrollLeft).toBeGreaterThan(0)
  })

  it('exposes scrollTo method', async () => {
    const wrapper = mount(Scrollbar)
    const container = wrapper.find('.ant-scrollbar-container')
    const calls: Array<[number, number]> = []

    ;(container.element as HTMLElement).scrollTo = ((left: number, top: number) => {
      calls.push([left, top])
    }) as any

    ;(wrapper.vm as any).scrollTo(12, 34)

    expect(calls).toEqual([[12, 34]])
  })
})
