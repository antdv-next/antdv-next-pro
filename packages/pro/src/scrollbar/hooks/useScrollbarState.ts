import type { Ref, ShallowRef } from 'vue'
import type { ScrollbarVisibility } from '../../config-provider'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface ScrollMetrics {
  clientWidth: number
  clientHeight: number
  scrollWidth: number
  scrollHeight: number
  scrollLeft: number
  scrollTop: number
}

const MIN_THUMB_SIZE = 20

export function useScrollbarState(
  containerRef: ShallowRef<HTMLElement | undefined>,
  contentRef: ShallowRef<HTMLElement | undefined>,
  visibilityX: Ref<ScrollbarVisibility | undefined>,
  visibilityY: Ref<ScrollbarVisibility | undefined>,
) {
  const metrics = ref<ScrollMetrics>({
    clientWidth: 0,
    clientHeight: 0,
    scrollWidth: 0,
    scrollHeight: 0,
    scrollLeft: 0,
    scrollTop: 0,
  })

  const sync = () => {
    const element = containerRef.value
    if (!element) {
      return
    }

    metrics.value = {
      clientWidth: element.clientWidth,
      clientHeight: element.clientHeight,
      scrollWidth: element.scrollWidth,
      scrollHeight: element.scrollHeight,
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop,
    }
  }

  const canScrollX = computed(() => metrics.value.scrollWidth > metrics.value.clientWidth)
  const canScrollY = computed(() => metrics.value.scrollHeight > metrics.value.clientHeight)

  const showTrackX = computed(() => {
    if (visibilityX.value === 'hidden') {
      return false
    }
    if (visibilityX.value === 'always') {
      return true
    }
    return canScrollX.value
  })

  const showTrackY = computed(() => {
    if (visibilityY.value === 'hidden') {
      return false
    }
    if (visibilityY.value === 'always') {
      return true
    }
    return canScrollY.value
  })

  const thumbSizeX = computed(() => {
    if (!metrics.value.clientWidth || !metrics.value.scrollWidth) {
      return 0
    }
    return Math.max((metrics.value.clientWidth / metrics.value.scrollWidth) * metrics.value.clientWidth, MIN_THUMB_SIZE)
  })

  const thumbSizeY = computed(() => {
    if (!metrics.value.clientHeight || !metrics.value.scrollHeight) {
      return 0
    }
    return Math.max((metrics.value.clientHeight / metrics.value.scrollHeight) * metrics.value.clientHeight, MIN_THUMB_SIZE)
  })

  const thumbOffsetX = computed(() => {
    const maxScroll = metrics.value.scrollWidth - metrics.value.clientWidth
    const maxTrack = metrics.value.clientWidth - thumbSizeX.value
    if (maxScroll <= 0 || maxTrack <= 0) {
      return 0
    }
    return (metrics.value.scrollLeft / maxScroll) * maxTrack
  })

  const thumbOffsetY = computed(() => {
    const maxScroll = metrics.value.scrollHeight - metrics.value.clientHeight
    const maxTrack = metrics.value.clientHeight - thumbSizeY.value
    if (maxScroll <= 0 || maxTrack <= 0) {
      return 0
    }
    return (metrics.value.scrollTop / maxScroll) * maxTrack
  })

  onMounted(() => {
    sync()
  })

  let resizeObserver: ResizeObserver | undefined

  watch(
    [containerRef, contentRef],
    ([container, content], [prevContainer, prevContent]) => {
      if (typeof ResizeObserver === 'undefined') {
        sync()
        return
      }

      if (!resizeObserver) {
        resizeObserver = new ResizeObserver(() => {
          sync()
        })
      }

      if (prevContainer && prevContainer !== container) {
        resizeObserver.unobserve(prevContainer)
      }

      if (prevContent && prevContent !== content) {
        resizeObserver.unobserve(prevContent)
      }

      if (container) {
        resizeObserver.observe(container)
      }

      if (content) {
        resizeObserver.observe(content)
      }

      sync()
    },
    {
      immediate: true,
      flush: 'post',
    },
  )

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
  })

  return {
    metrics,
    canScrollX,
    canScrollY,
    showTrackX,
    showTrackY,
    thumbSizeX,
    thumbSizeY,
    thumbOffsetX,
    thumbOffsetY,
    sync,
  }
}
