import { mount } from '@vue/test-utils'
import { ConfigProvider } from 'antdv-next'
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

/**
 * `rtl` mimics the CSSOM View sign convention: an RTL container reports
 * `scrollLeft` in `[-maxScroll, 0]`, so a positive assignment is clamped
 * straight back to 0 — exactly how real browsers behave. Without that
 * clamp the mock happily stores any positive value and silently masks
 * sign regressions in the drag/track-click math.
 */
function mockScrollLeft(element: Element, options?: { rtl?: boolean }) {
  let scrollLeft = 0
  Object.defineProperty(element, 'scrollLeft', {
    configurable: true,
    get: () => scrollLeft,
    set: value => (scrollLeft = options?.rtl ? Math.min(Number(value), 0) : Number(value)),
  })
  return () => scrollLeft
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

  it.each([
    [
      'vertical',
      'ant-scrollbar-container-fade-vertical',
      [
        '--scrollbar-fade-size: 32px',
        '--scrollbar-fade-overflow-top: 10px',
        '--scrollbar-fade-overflow-bottom: 130px',
      ],
    ],
    [
      'horizontal',
      'ant-scrollbar-container-fade-horizontal',
      [
        '--scrollbar-fade-size: 32px',
        '--scrollbar-fade-overflow-left: 12px',
        '--scrollbar-fade-overflow-right: 128px',
      ],
    ],
    [
      'both',
      'ant-scrollbar-container-fade-both',
      [
        '--scrollbar-fade-size: 32px',
        '--scrollbar-fade-overflow-top: 10px',
        '--scrollbar-fade-overflow-bottom: 130px',
        '--scrollbar-fade-overflow-left: 12px',
        '--scrollbar-fade-overflow-right: 128px',
      ],
    ],
  ])('applies scroll fade class for %s', async (scrollFade, expectedClass, styleAssertions) => {
    const wrapper = mount(Scrollbar, {
      props: {
        scrollFade: scrollFade as 'vertical' | 'horizontal' | 'both',
        scrollFadeSize: 32,
      },
    })

    const container = wrapper.find('.ant-scrollbar-container')
    mockScrollMetrics(container.element, {
      clientHeight: 100,
      scrollHeight: 240,
      scrollTop: 10,
      clientWidth: 100,
      scrollWidth: 240,
      scrollLeft: 12,
    })

    await container.trigger('scroll')
    await nextTick()

    const content = wrapper.find('.ant-scrollbar-container')
    expect(content.classes()).toContain(expectedClass)
    styleAssertions.forEach((styleAssertion) => {
      expect(content.attributes('style')).toContain(styleAssertion)
    })
  })

  it('uses scroll fade from ProConfigProvider', async () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        scrollbar: {
          scrollFade: 'both',
          scrollFadeSize: 24,
        },
      },
      slots: {
        default: () => h(Scrollbar),
      },
    })

    const container = wrapper.find('.ant-scrollbar-container')
    mockScrollMetrics(container.element, {
      clientHeight: 100,
      scrollHeight: 240,
      scrollTop: 10,
      clientWidth: 100,
      scrollWidth: 240,
      scrollLeft: 12,
    })

    await container.trigger('scroll')
    await nextTick()

    const content = wrapper.find('.ant-scrollbar-container')
    expect(content.classes()).toContain('ant-scrollbar-container-fade-both')
    expect(content.attributes('style')).toContain('--scrollbar-fade-size: 24px')
  })

  it('mirrors the horizontal fade amounts in rtl', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: {
        default: () => h(Scrollbar, { scrollFade: 'horizontal' }),
      },
    })

    const container = wrapper.find('.ant-scrollbar-container')
    mockScrollMetrics(container.element, {
      clientHeight: 100,
      scrollHeight: 100,
      clientWidth: 100,
      scrollWidth: 240,
      scrollTop: 0,
      // RTL: scrolled 20px in from the right edge, reported as -20.
      scrollLeft: -20,
    })

    await container.trigger('scroll')
    await nextTick()

    // maxScrollX = 140: 120px of content still hides beyond the left edge,
    // 20px beyond the right. The LTR arithmetic would report 0/160 — the
    // left frozen at 0, the right inflated to 140 - (-20).
    const style = wrapper.find('.ant-scrollbar-container').attributes('style')
    expect(style).toContain('--scrollbar-fade-overflow-left: 120px')
    expect(style).toContain('--scrollbar-fade-overflow-right: 20px')
  })

  it('supports semantic classes and styles as functions', async () => {
    const classes = vi.fn((info: { props: any }) => ({
      root: 'custom-root',
      content: 'dynamic-content',
      trackY: info.props.visibilityY === 'always' ? 'always-track-y' : 'auto-track-y',
      thumbY: 'dynamic-thumb-y',
    }))

    const styles = vi.fn((info: { props: any }) => ({
      root: { margin: '2px' },
      content: { paddingBottom: '5px' },
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
    expect(transition.attributes('name')).toBe('ant-scrollbar-track-fade-motion')
  })

  it('uses fade track motion from component props', async () => {
    const wrapper = mount(Scrollbar, {
      props: {
        visibilityY: 'always',
        motion: 'fade',
      },
    })

    await nextTick()

    expect(wrapper.find('transition-stub').attributes('name')).toBe('ant-scrollbar-track-fade-motion')
  })

  it('uses track motion from ProConfigProvider', async () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        scrollbar: {
          motion: 'fade',
        },
      },
      slots: {
        default: () => h(Scrollbar, { visibilityY: 'always' }),
      },
    })

    await nextTick()

    expect(wrapper.find('transition-stub').attributes('name')).toBe('ant-scrollbar-track-fade-motion')
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

  /**
   * Regression test for the thumb overflowing the track.
   *
   * The track is inset from the container by `inset` on both ends, so the thumb
   * must be sized and offset against `clientHeight - 2 * inset`. Sizing it
   * against `clientHeight` made `offset + thumbHeight` equal
   * `clientHeight + inset`, pushing the thumb past the end of the track at every
   * scroll position.
   */
  describe('thumb stays inside the track', () => {
    const INSET = 4
    const SIZE = 8

    /** Thumb length as a percentage of the track, read from the inline style. */
    function thumbPercent(wrapper: ReturnType<typeof mount>, axis: 'x' | 'y') {
      const style = (wrapper.find(`.ant-scrollbar-thumb-${axis}`).element as HTMLElement).style
      return Number.parseFloat(axis === 'y' ? style.height : style.width)
    }

    /** Thumb offset in px, read from the inline translate. */
    function thumbTranslatePx(wrapper: ReturnType<typeof mount>, axis: 'x' | 'y') {
      const style = (wrapper.find(`.ant-scrollbar-thumb-${axis}`).element as HTMLElement).style
      const matched = style.transform.match(/-?[\d.]+/)
      return matched ? Number.parseFloat(matched[0]) : 0
    }

    it.each([
      ['a short scroll range', 168],
      ['a medium scroll range', 320],
      ['a long scroll range', 800],
    ])('keeps the vertical thumb within the track for %s', async (_label, scrollHeight) => {
      const wrapper = mount(Scrollbar, {
        props: { visibilityY: 'always' },
      })

      const clientHeight = 100
      const container = wrapper.find('.ant-scrollbar-container')
      mockScrollMetrics(container.element, {
        clientHeight,
        scrollHeight,
        scrollTop: scrollHeight - clientHeight,
        clientWidth: 100,
        scrollWidth: 100,
        scrollLeft: 0,
      })

      await container.trigger('scroll')
      await nextTick()

      // Scrolled to the very end, so the thumb is at maximum travel.
      const trackLength = clientHeight - 2 * INSET
      const thumbHeightPx = (thumbPercent(wrapper, 'y') / 100) * trackLength
      const offsetPx = thumbTranslatePx(wrapper, 'y')

      expect(offsetPx + thumbHeightPx).toBeLessThanOrEqual(trackLength + 1e-6)
    })

    it('never lets the thumb exceed the track when the scroll range is tiny', async () => {
      const wrapper = mount(Scrollbar, {
        props: { visibilityY: 'always' },
      })

      const clientHeight = 100
      const container = wrapper.find('.ant-scrollbar-container')
      mockScrollMetrics(container.element, {
        clientHeight,
        scrollHeight: 120,
        scrollTop: 20,
        clientWidth: 100,
        scrollWidth: 100,
        scrollLeft: 0,
      })

      await container.trigger('scroll')
      await nextTick()

      // scrollHeight barely above clientHeight is the case that used to overflow.
      expect(thumbPercent(wrapper, 'y')).toBeLessThanOrEqual(100)
    })

    it('keeps the horizontal thumb within the track when scrolled fully right', async () => {
      const wrapper = mount(Scrollbar, {
        props: { visibilityX: 'always' },
      })

      const clientWidth = 100
      const container = wrapper.find('.ant-scrollbar-container')
      mockScrollMetrics(container.element, {
        clientHeight: 100,
        scrollHeight: 100,
        clientWidth,
        scrollWidth: 320,
        scrollLeft: 220,
      })

      await container.trigger('scroll')
      await nextTick()

      const trackLength = clientWidth - 2 * INSET
      const thumbWidthPx = (thumbPercent(wrapper, 'x') / 100) * trackLength
      const offsetPx = thumbTranslatePx(wrapper, 'x')

      expect(offsetPx + thumbWidthPx).toBeLessThanOrEqual(trackLength + 1e-6)
    })

    it('mirrors the horizontal thumb translate in rtl', async () => {
      const wrapper = mount(ConfigProvider, {
        props: { direction: 'rtl' },
        slots: {
          default: () => h(Scrollbar, { visibilityX: 'always' }),
        },
      })

      const container = wrapper.find('.ant-scrollbar-container')
      mockScrollMetrics(container.element, {
        clientHeight: 100,
        scrollHeight: 100,
        clientWidth: 100,
        scrollWidth: 300,
        scrollTop: 0,
        // Half the scroll range into the content; RTL reports it negative.
        scrollLeft: -100,
      })

      await container.trigger('scroll')
      await nextTick()

      // The `-rtl` stylesheet anchors the thumb to the track's right edge, so
      // scrolling into the content has to translate it leftwards. With the
      // LTR sign convention the ratio clamps to 0 and the thumb never moves.
      expect(thumbTranslatePx(wrapper, 'x')).toBeLessThan(0)
    })

    /**
     * Regression test for the two tracks overlapping at the shared corner.
     *
     * Both tracks are anchored to `bottom`/`right: inset`, so with both axes
     * scrolling they painted the same `size * size` square and fused into one
     * L shape. They now each stop one `size` short of that square, which the
     * thumb geometry has to subtract as well — otherwise the thumb overshoots
     * by `size`, the same failure mode as the original inset bug.
     */
    it('shortens both tracks by one size when both axes scroll', async () => {
      const wrapper = mount(Scrollbar, {
        props: { visibility: 'always' },
      })

      const clientSize = 100
      const container = wrapper.find('.ant-scrollbar-container')
      mockScrollMetrics(container.element, {
        clientWidth: clientSize,
        clientHeight: clientSize,
        scrollWidth: 300,
        scrollHeight: 300,
        scrollLeft: 200,
        scrollTop: 200,
      })

      await container.trigger('scroll')
      await nextTick()

      expect(wrapper.classes()).toContain('ant-scrollbar-both-axis')

      // Scrolled to the end on both axes, so each thumb is at maximum travel.
      const trackLength = clientSize - 2 * INSET - SIZE
      expect(trackLength).toBe(84)

      const thumbHeightPx = (thumbPercent(wrapper, 'y') / 100) * trackLength
      const thumbWidthPx = (thumbPercent(wrapper, 'x') / 100) * trackLength

      expect(thumbTranslatePx(wrapper, 'y') + thumbHeightPx).toBeCloseTo(trackLength, 6)
      expect(thumbTranslatePx(wrapper, 'x') + thumbWidthPx).toBeCloseTo(trackLength, 6)
    })

    it('keeps the track full length when only one axis scrolls', async () => {
      const wrapper = mount(Scrollbar, {
        props: { visibilityY: 'always' },
      })

      const clientHeight = 100
      const container = wrapper.find('.ant-scrollbar-container')
      mockScrollMetrics(container.element, {
        clientHeight,
        scrollHeight: 300,
        scrollTop: 200,
        clientWidth: 100,
        scrollWidth: 100,
        scrollLeft: 0,
      })

      await container.trigger('scroll')
      await nextTick()

      expect(wrapper.classes()).not.toContain('ant-scrollbar-both-axis')

      // Nothing to share the corner with, so the track uses the whole inset box.
      const trackLength = clientHeight - 2 * INSET
      expect(trackLength).toBe(92)

      const thumbHeightPx = (thumbPercent(wrapper, 'y') / 100) * trackLength
      expect(thumbTranslatePx(wrapper, 'y') + thumbHeightPx).toBeCloseTo(trackLength, 6)
    })

    it('drops the corner reservation once the second axis stops scrolling', async () => {
      const wrapper = mount(Scrollbar)
      const container = wrapper.find('.ant-scrollbar-container')

      mockScrollMetrics(container.element, {
        clientWidth: 100,
        clientHeight: 100,
        scrollWidth: 300,
        scrollHeight: 300,
        scrollLeft: 0,
        scrollTop: 0,
      })

      await container.trigger('scroll')
      await nextTick()
      expect(wrapper.classes()).toContain('ant-scrollbar-both-axis')

      // Content now fits vertically, so the vertical track is gone and the
      // horizontal one may use the full run again.
      mockScrollMetrics(container.element, { scrollHeight: 100, scrollTop: 0 })
      await container.trigger('scroll')
      await nextTick()
      expect(wrapper.classes()).not.toContain('ant-scrollbar-both-axis')
    })

    /**
     * The corner offset has to be emitted as a `calc()`.
     *
     * Component tokens reach the stylesheet as CSS variables, so `inset + size`
     * was string-concatenated into `var(--a)var(--b)` — an invalid declaration
     * that browsers drop silently, leaving the corner reservation inert.
     */
    it('emits the corner reservation as valid css', () => {
      mount(Scrollbar, { props: { visibility: 'always' } })

      const css = Array.from(document.querySelectorAll('style'))
        .map(el => el.textContent ?? '')
        .join('\n')
        .replace(/\s+/g, '')

      expect(css).toContain('calc(var(--ant-scrollbar-inset)+var(--ant-scrollbar-size))')
      expect(css).not.toContain('var(--ant-scrollbar-inset)var(--ant-scrollbar-size)')
    })
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

  it('updates scrollLeft with the rtl sign when dragging the horizontal thumb', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: {
        default: () => h(Scrollbar),
      },
    })

    const container = wrapper.find('.ant-scrollbar-container')
    const getScrollLeft = mockScrollLeft(container.element, { rtl: true })

    mockScrollMetrics(container.element, {
      clientHeight: 100,
      scrollHeight: 100,
      scrollTop: 0,
      clientWidth: 100,
      scrollWidth: 300,
    })

    await container.trigger('scroll')
    await nextTick()

    // Dragging the thumb leftwards moves into the RTL content: the logical
    // offset grows, so the stored position must go negative — a real browser
    // would clamp a positive assignment back to 0 and freeze the drag.
    await wrapper.find('.ant-scrollbar-thumb-x').trigger('mousedown', { clientX: 50 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 30 }))
    document.dispatchEvent(new MouseEvent('mouseup'))

    expect(getScrollLeft()).toBeLessThan(0)
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

  describe('track click', () => {
    /**
     * The track does not span the full container: it is inset on both ends by
     * the `inset` token (paddingXXS = 4), so with a 100px container the track
     * measures 92px. Mocking the container size alone is not enough — the track
     * rect has to match too, otherwise the thumb-centring math is off by the
     * inset.
     */
    const TRACK_LENGTH = 92

    function mockRect(element: Element, rect: Partial<DOMRect>) {
      element.getBoundingClientRect = () => ({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
        ...rect,
      }) as DOMRect
    }

    function fireTrackMouseDown(
      element: Element,
      coord: Partial<Record<'clientX' | 'clientY' | 'pageX' | 'pageY', number>>,
    ) {
      const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 })
      Object.entries(coord).forEach(([key, value]) => {
        Object.defineProperty(event, key, { value })
      })
      element.dispatchEvent(event)
    }

    function mockScrollTop(element: Element) {
      let scrollTop = 0
      Object.defineProperty(element, 'scrollTop', {
        configurable: true,
        get: () => scrollTop,
        set: value => (scrollTop = Number(value)),
      })
      return () => scrollTop
    }

    it('jumps to the clicked position on the vertical track', async () => {
      const wrapper = mount(Scrollbar)
      const container = wrapper.find('.ant-scrollbar-container')
      const getScrollTop = mockScrollTop(container.element)

      // clientHeight=100, scrollHeight=300 → visible ratio 1/3.
      // Track length = clientHeight - 2 * inset = 100 - 8 = 92 (inset = paddingXXS = 4).
      // thumbSize = 33.33% of 92 ≈ 30.67, maxTrack = 66.67% of 92 ≈ 61.33, maxScroll = 200.
      mockScrollMetrics(container.element, {
        clientHeight: 100,
        scrollHeight: 300,
        clientWidth: 100,
        scrollWidth: 100,
        scrollLeft: 0,
      })

      await container.trigger('scroll')
      await nextTick()

      const track = wrapper.find('.ant-scrollbar-track-y').element
      mockRect(track, { top: 0, height: TRACK_LENGTH })

      // Click the track centre: thumbTop = 46 - 30.67/2 ≈ 30.67 → 30.67/61.33*200 ≈ 100
      fireTrackMouseDown(track, { clientY: TRACK_LENGTH / 2 })
      await nextTick()

      expect(getScrollTop()).toBeCloseTo(100, 0)
    })

    /**
     * Regression test for the track jump breaking on a scrolled page.
     *
     * `getBoundingClientRect()` is viewport-relative while `event.pageY` is
     * document-relative, so reading `pageY` against `rect.top` overshot by twice
     * the page scroll offset. On a scrolled docs page that pushed `thumbTop`
     * past `maxTrack` for *any* click position, clamping to the end of the
     * scroll range — the thumb jumped to the bottom and further clicks looked
     * dead because the range was already exhausted.
     */
    it('is unaffected by the page scroll offset', async () => {
      const wrapper = mount(Scrollbar)
      const container = wrapper.find('.ant-scrollbar-container')
      const getScrollTop = mockScrollTop(container.element)

      mockScrollMetrics(container.element, {
        clientHeight: 100,
        scrollHeight: 300,
        clientWidth: 100,
        scrollWidth: 100,
        scrollLeft: 0,
      })

      await container.trigger('scroll')
      await nextTick()

      // The track sits 300px below the viewport top in both cases; only the
      // page scroll offset differs, so both clicks are at the same place on the
      // track and must land on the same scroll offset.
      const track = wrapper.find('.ant-scrollbar-track-y').element
      mockRect(track, { top: 300, height: TRACK_LENGTH })

      const clickTrackCentre = (pageScroll: number) => {
        const clientY = 300 + TRACK_LENGTH / 2
        fireTrackMouseDown(track, { clientY, pageY: clientY + pageScroll })
      }

      clickTrackCentre(0)
      const atTopOfPage = getScrollTop()

      clickTrackCentre(1500)
      expect(getScrollTop()).toBe(atTopOfPage)

      // Centre of the track → half the scroll range.
      expect(atTopOfPage).toBeCloseTo(100, 0)
    })

    it('clamps to the end when clicking past the vertical track', async () => {
      const wrapper = mount(Scrollbar)
      const container = wrapper.find('.ant-scrollbar-container')
      const getScrollTop = mockScrollTop(container.element)

      mockScrollMetrics(container.element, {
        clientHeight: 100,
        scrollHeight: 300,
        clientWidth: 100,
        scrollWidth: 100,
        scrollLeft: 0,
      })

      await container.trigger('scroll')
      await nextTick()

      const track = wrapper.find('.ant-scrollbar-track-y').element
      mockRect(track, { top: 0, height: TRACK_LENGTH })

      fireTrackMouseDown(track, { clientY: 9999 })
      await nextTick()

      expect(getScrollTop()).toBe(200)
    })

    it('does not jump when the press starts on the thumb itself', async () => {
      const wrapper = mount(Scrollbar)
      const container = wrapper.find('.ant-scrollbar-container')
      const getScrollTop = mockScrollTop(container.element)

      mockScrollMetrics(container.element, {
        clientHeight: 100,
        scrollHeight: 300,
        clientWidth: 100,
        scrollWidth: 100,
        scrollLeft: 0,
      })

      await container.trigger('scroll')
      await nextTick()

      const track = wrapper.find('.ant-scrollbar-track-y').element
      mockRect(track, { top: 0, height: TRACK_LENGTH })

      // Bubbles from the thumb: stopPropagation must keep the track handler out.
      const thumb = wrapper.find('.ant-scrollbar-thumb-y').element
      fireTrackMouseDown(thumb, { clientY: 50 })
      await nextTick()

      expect(getScrollTop()).toBe(0)
    })

    it('ignores non-primary mouse buttons on the track', async () => {
      const wrapper = mount(Scrollbar)
      const container = wrapper.find('.ant-scrollbar-container')
      const getScrollTop = mockScrollTop(container.element)

      mockScrollMetrics(container.element, {
        clientHeight: 100,
        scrollHeight: 300,
        clientWidth: 100,
        scrollWidth: 100,
        scrollLeft: 0,
      })

      await container.trigger('scroll')
      await nextTick()

      const track = wrapper.find('.ant-scrollbar-track-y').element
      mockRect(track, { top: 0, height: TRACK_LENGTH })

      const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 2 })
      Object.defineProperty(event, 'clientY', { value: 50 })
      track.dispatchEvent(event)
      await nextTick()

      expect(getScrollTop()).toBe(0)
    })

    it('jumps to the clicked position on the horizontal track', async () => {
      const wrapper = mount(Scrollbar)
      const container = wrapper.find('.ant-scrollbar-container')
      const getScrollLeft = mockScrollLeft(container.element)

      mockScrollMetrics(container.element, {
        clientHeight: 100,
        scrollHeight: 100,
        clientWidth: 100,
        scrollWidth: 300,
        scrollTop: 0,
      })

      await container.trigger('scroll')
      await nextTick()

      const track = wrapper.find('.ant-scrollbar-track-x').element
      mockRect(track, { left: 0, width: TRACK_LENGTH })

      // Same math as vertical: clicking the track centre lands at scrollLeft≈100
      fireTrackMouseDown(track, { clientX: TRACK_LENGTH / 2 })
      await nextTick()

      expect(getScrollLeft()).toBeCloseTo(100, 0)
    })

    it('jumps using the mirrored axis on the horizontal track in rtl', async () => {
      const wrapper = mount(ConfigProvider, {
        props: { direction: 'rtl' },
        slots: {
          default: () => h(Scrollbar, { visibilityX: 'always' }),
        },
      })

      expect(wrapper.find('.ant-scrollbar-rtl').exists()).toBe(true)

      const container = wrapper.find('.ant-scrollbar-container')
      const getScrollLeft = mockScrollLeft(container.element, { rtl: true })

      mockScrollMetrics(container.element, {
        clientHeight: 100,
        scrollHeight: 100,
        clientWidth: 100,
        scrollWidth: 300,
        scrollTop: 0,
      })

      await container.trigger('scroll')
      await nextTick()

      const track = wrapper.find('.ant-scrollbar-track-x').element
      mockRect(track, { right: 100, width: TRACK_LENGTH })

      // RTL mirrors the axis: thumbTop = rect.right - clientX - thumbSize/2.
      // The track spans [8, 100], so its centre is at clientX = 100 - 92/2 = 54.
      fireTrackMouseDown(track, { clientX: 54 })
      await nextTick()

      // RTL scroll positions are negative: half the scroll range into the
      // content is scrollLeft = -100. The rtl mock clamps positive values to
      // 0, so a sign regression here fails instead of silently "passing".
      expect(getScrollLeft()).toBeCloseTo(-100, 0)
    })

    it('keeps overlays visible after a track click', async () => {
      vi.useFakeTimers()

      try {
        const wrapper = mount(Scrollbar, {
          props: { hideDelay: 100 },
        })

        const container = wrapper.find('.ant-scrollbar-container')

        mockScrollMetrics(container.element, {
          clientHeight: 100,
          scrollHeight: 300,
          clientWidth: 100,
          scrollWidth: 100,
          scrollLeft: 0,
        })

        await container.trigger('scroll')
        await nextTick()

        const track = wrapper.find('.ant-scrollbar-track-y').element
        mockRect(track, { top: 0, height: TRACK_LENGTH })

        fireTrackMouseDown(track, { clientY: TRACK_LENGTH / 2 })
        await nextTick()

        await vi.advanceTimersByTimeAsync(100)
        await nextTick()

        expect(wrapper.find('.ant-scrollbar-track-y').exists()).toBe(true)
      }
      finally {
        vi.useRealTimers()
      }
    })
  })
})
