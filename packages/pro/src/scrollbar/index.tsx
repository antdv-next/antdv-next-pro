import type { App, CSSProperties, ShallowRef, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/semantic'
import type { ScrollbarConfig, ScrollbarVisibility } from '../config-provider'
import { clsx } from '@v-c/util'
import { getTransitionProps } from '@v-c/util/dist/utils/transition'
import { useBaseConfig } from 'antdv-next/config-provider/context'
import useCSSVarCls from 'antdv-next/config-provider/hooks/useCSSVarCls'
import { computed, defineComponent, onBeforeUnmount, ref, shallowRef, Transition, watch } from 'vue'
import { useMergeSemantic } from '../_util/semantic'
import { useProComponentConfig } from '../config-provider'
import { useScrollbarDrag } from './hooks/useScrollbarDrag'
import { useScrollbarState } from './hooks/useScrollbarState'
import useStyle from './style'

export type ScrollbarSemanticName = keyof ScrollbarSemanticClassNames & keyof ScrollbarSemanticStyles

export interface ScrollbarSemanticClassNames {
  root?: string
  container?: string
  content?: string
  track?: string
  trackX?: string
  trackY?: string
  thumb?: string
  thumbX?: string
  thumbY?: string
}

export interface ScrollbarSemanticStyles {
  root?: CSSProperties
  container?: CSSProperties
  content?: CSSProperties
  track?: CSSProperties
  trackX?: CSSProperties
  trackY?: CSSProperties
  thumb?: CSSProperties
  thumbX?: CSSProperties
  thumbY?: CSSProperties
}

export type ScrollbarClassNamesType = SemanticClassNamesType<ScrollbarProps, ScrollbarSemanticClassNames>
export type ScrollbarStylesType = SemanticStylesType<ScrollbarProps, ScrollbarSemanticStyles>

export interface ScrollbarProps {
  prefixCls?: string
  rootClass?: string
  visibility?: ScrollbarVisibility
  visibilityX?: ScrollbarVisibility
  visibilityY?: ScrollbarVisibility
  hideDelay?: number
  native?: boolean
  classes?: ScrollbarClassNamesType
  styles?: ScrollbarStylesType
}

export interface ScrollbarEmits {
  scroll: (event: Event) => void
  [key: string]: (...args: any[]) => void
}

export interface ScrollbarSlots {
  default?: () => any
}

export interface ScrollbarRef {
  containerRef: ShallowRef<HTMLElement | undefined>
  scrollTo: {
    (options: ScrollToOptions): void
    (left: number, top?: number): void
  }
}

const DEFAULT_VISIBILITY: ScrollbarVisibility = 'auto'
const DEFAULT_HIDE_DELAY = 1200

function omitClassAndStyle(attrs: Record<string, any>) {
  const nextAttrs = { ...attrs }
  delete nextAttrs.class
  delete nextAttrs.style
  return nextAttrs
}

const Scrollbar = defineComponent<
  ScrollbarProps,
  ScrollbarEmits,
  string,
  SlotsType<ScrollbarSlots>
>(
  (props, { slots, attrs, emit, expose }) => {
    const { prefixCls, direction } = useBaseConfig('scrollbar', props)
    const proConfig = useProComponentConfig('scrollbar')
    const containerRef = shallowRef<HTMLElement>()
    const contentRef = shallowRef<HTMLElement>()
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    const mergedVisibility = computed<ScrollbarVisibility>(() => {
      return props.visibility ?? proConfig.value.visibility ?? DEFAULT_VISIBILITY
    })

    const mergedVisibilityX = computed<ScrollbarVisibility>(() => {
      return props.visibilityX ?? proConfig.value.visibilityX ?? mergedVisibility.value
    })

    const mergedVisibilityY = computed<ScrollbarVisibility>(() => {
      return props.visibilityY ?? proConfig.value.visibilityY ?? mergedVisibility.value
    })

    const mergedNative = computed(() => {
      return props.native ?? proConfig.value.native ?? false
    })

    const mergedHideDelay = computed(() => {
      return props.hideDelay ?? proConfig.value.hideDelay ?? DEFAULT_HIDE_DELAY
    })

    const mergedConfig = computed<ScrollbarConfig>(() => {
      return {
        ...proConfig.value,
        visibility: mergedVisibility.value,
        visibilityX: mergedVisibilityX.value,
        visibilityY: mergedVisibilityY.value,
        hideDelay: mergedHideDelay.value,
        native: mergedNative.value,
      }
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      ScrollbarSemanticClassNames,
      ScrollbarSemanticStyles,
      ScrollbarProps
    >(
      computed(() => [proConfig.value.classes as ScrollbarClassNamesType | undefined, props.classes]),
      computed(() => [proConfig.value.styles as ScrollbarStylesType | undefined, props.styles]),
      computed(() => ({
        props: {
          ...props,
          visibility: mergedVisibility.value,
          visibilityX: mergedVisibilityX.value,
          visibilityY: mergedVisibilityY.value,
          hideDelay: mergedHideDelay.value,
          native: mergedNative.value,
        },
      })),
    )

    const mergedClassName = computed(() => {
      return clsx(
        prefixCls.value,
        hashId.value,
        cssVarCls.value,
        rootCls.value,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-native`]: mergedNative.value,
        },
        proConfig.value.class,
        props.rootClass,
        mergedClassNames.value.root,
        (attrs as any).class,
      )
    })

    const mergedStyle = computed(() => {
      return [
        mergedStyles.value.root,
        proConfig.value.style,
        (attrs as any).style,
      ]
    })

    const trackMotionName = computed(() => `${prefixCls.value}-track-motion`)
    const trackTransitionProps = computed(() => getTransitionProps(trackMotionName.value, { appear: false }))

    const scrollbarState = useScrollbarState(
      containerRef,
      contentRef,
      computed(() => mergedConfig.value.visibilityX),
      computed(() => mergedConfig.value.visibilityY),
    )
    const scrollbarDrag = useScrollbarDrag(
      containerRef,
      scrollbarState.metrics,
      scrollbarState.thumbSizeX,
      scrollbarState.thumbSizeY,
      scrollbarState.sync,
    )
    const hovering = ref(false)
    const overlaysVisible = ref(true)
    const hasAutoVisibility = computed(() => {
      return mergedVisibilityX.value === 'auto' || mergedVisibilityY.value === 'auto'
    })
    const dragging = computed(() => {
      return scrollbarDrag.draggingX.value || scrollbarDrag.draggingY.value
    })

    let hideTimer: ReturnType<typeof window.setTimeout> | undefined

    function clearHideTimer() {
      if (hideTimer !== undefined) {
        window.clearTimeout(hideTimer)
        hideTimer = undefined
      }
    }

    function showOverlays() {
      overlaysVisible.value = true
      clearHideTimer()
    }

    function scheduleHide() {
      clearHideTimer()
      if (!hasAutoVisibility.value || hovering.value || dragging.value || mergedNative.value) {
        return
      }

      hideTimer = window.setTimeout(() => {
        overlaysVisible.value = false
        hideTimer = undefined
      }, mergedHideDelay.value)
    }

    const showTrackX = computed(() => {
      if (!scrollbarState.showTrackX.value) {
        return false
      }
      return mergedVisibilityX.value !== 'auto' || overlaysVisible.value
    })

    const showTrackY = computed(() => {
      if (!scrollbarState.showTrackY.value) {
        return false
      }
      return mergedVisibilityY.value !== 'auto' || overlaysVisible.value
    })

    watch(
      [hasAutoVisibility, mergedHideDelay],
      ([autoVisibility]) => {
        if (!autoVisibility) {
          overlaysVisible.value = true
          clearHideTimer()
          return
        }

        overlaysVisible.value = true
        scheduleHide()
      },
      { immediate: true },
    )

    watch(dragging, (value) => {
      if (value) {
        showOverlays()
        return
      }
      scheduleHide()
    })

    onBeforeUnmount(() => {
      clearHideTimer()
    })

    function handleScroll(event: Event) {
      scrollbarState.sync()
      showOverlays()
      scheduleHide()
      emit('scroll', event)
    }

    function handleMouseEnter() {
      hovering.value = true
      showOverlays()
    }

    function handleMouseLeave() {
      hovering.value = false
      scheduleHide()
    }

    function scrollTo(options: ScrollToOptions): void
    function scrollTo(left: number, top?: number): void
    function scrollTo(leftOrOptions: number | ScrollToOptions, top = 0) {
      const container = containerRef.value
      if (!container) {
        return
      }

      if (typeof leftOrOptions === 'object') {
        if (typeof container.scrollTo === 'function') {
          container.scrollTo(leftOrOptions)
        }
        else {
          if (leftOrOptions.left !== undefined) {
            container.scrollLeft = leftOrOptions.left
          }
          if (leftOrOptions.top !== undefined) {
            container.scrollTop = leftOrOptions.top
          }
        }
      }
      else if (typeof container.scrollTo === 'function') {
        container.scrollTo(leftOrOptions, top)
      }
      else {
        container.scrollLeft = leftOrOptions
        container.scrollTop = top
      }

      scrollbarState.sync()
    }

    const api: ScrollbarRef = {
      containerRef,
      scrollTo,
    }

    expose(api)

    const renderTrackY = () => (
      <Transition {...trackTransitionProps.value}>
        {{
          default: () => (showTrackY.value
            ? (
                <div
                  class={clsx(
                    `${prefixCls.value}-track`,
                    `${prefixCls.value}-track-y`,
                    mergedClassNames.value.track,
                    mergedClassNames.value.trackY,
                  )}
                  style={[mergedStyles.value.track, mergedStyles.value.trackY]}
                >
                  <div
                    class={clsx(
                      `${prefixCls.value}-thumb`,
                      `${prefixCls.value}-thumb-y`,
                      mergedClassNames.value.thumb,
                      mergedClassNames.value.thumbY,
                    )}
                    style={[
                      mergedStyles.value.thumb,
                      mergedStyles.value.thumbY,
                      {
                        height: `${scrollbarState.thumbSizeY.value}px`,
                        transform: `translateY(${scrollbarState.thumbOffsetY.value}px)`,
                      },
                    ]}
                    onMousedown={scrollbarDrag.onThumbMouseDownY}
                  />
                </div>
              )
            : null),
        }}
      </Transition>
    )

    const renderTrackX = () => (
      <Transition {...trackTransitionProps.value}>
        {{
          default: () => (showTrackX.value
            ? (
                <div
                  class={clsx(
                    `${prefixCls.value}-track`,
                    `${prefixCls.value}-track-x`,
                    mergedClassNames.value.track,
                    mergedClassNames.value.trackX,
                  )}
                  style={[mergedStyles.value.track, mergedStyles.value.trackX]}
                >
                  <div
                    class={clsx(
                      `${prefixCls.value}-thumb`,
                      `${prefixCls.value}-thumb-x`,
                      mergedClassNames.value.thumb,
                      mergedClassNames.value.thumbX,
                    )}
                    style={[
                      mergedStyles.value.thumb,
                      mergedStyles.value.thumbX,
                      {
                        width: `${scrollbarState.thumbSizeX.value}px`,
                        transform: `translateX(${scrollbarState.thumbOffsetX.value}px)`,
                      },
                    ]}
                    onMousedown={scrollbarDrag.onThumbMouseDownX}
                  />
                </div>
              )
            : null),
        }}
      </Transition>
    )

    return () => (
      <div
        class={mergedClassName.value}
        style={mergedStyle.value}
        data-visibility={mergedVisibility.value}
        data-visibility-x={mergedVisibilityX.value}
        data-visibility-y={mergedVisibilityY.value}
        data-active={overlaysVisible.value ? '' : undefined}
        data-native={mergedNative.value ? '' : undefined}
        onMouseenter={handleMouseEnter}
        onMouseleave={handleMouseLeave}
        {...omitClassAndStyle(attrs as Record<string, any>)}
      >
        <div
          ref={containerRef}
          class={clsx(`${prefixCls.value}-container`, mergedClassNames.value.container)}
          style={mergedStyles.value.container}
          onScroll={handleScroll}
        >
          <div
            ref={contentRef}
            class={clsx(`${prefixCls.value}-content`, mergedClassNames.value.content)}
            style={mergedStyles.value.content}
          >
            {slots.default?.()}
          </div>
        </div>
        {!mergedNative.value && renderTrackY()}
        {!mergedNative.value && renderTrackX()}
      </div>
    )
  },
  {
    name: 'AScrollbar',
    inheritAttrs: false,
  },
)

;(Scrollbar as any).install = (app: App) => {
  app.component(Scrollbar.name, Scrollbar)
}

export type { ScrollbarConfig, ScrollbarVisibility }
export default Scrollbar
export { Scrollbar }
