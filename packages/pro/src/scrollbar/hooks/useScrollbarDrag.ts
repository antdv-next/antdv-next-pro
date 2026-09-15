import type { Ref, ShallowRef } from 'vue'
import { onBeforeUnmount, ref } from 'vue'

interface ScrollMetrics {
  clientWidth: number
  clientHeight: number
  scrollWidth: number
  scrollHeight: number
  scrollLeft: number
  scrollTop: number
}

type Axis = 'x' | 'y'

interface DragState {
  axis: Axis
  startClient: number
  startScroll: number
}

/**
 * Convert a thumb offset along the track into the target scroll offset.
 *
 * `maxScroll` is the maximum scrollable distance, `maxTrack` is the maximum
 * distance the thumb can travel. Both drag and track-click share this math so
 * the boundary handling stays in one place.
 */
export function getScrollOffsetByThumbTop(
  thumbTop: number,
  maxScroll: number,
  maxTrack: number,
) {
  if (maxScroll <= 0 || maxTrack <= 0) {
    return 0
  }

  const mergedThumbTop = Math.max(Math.min(thumbTop, maxTrack), 0)
  const ptg = mergedThumbTop / maxTrack

  let nextScrollOffset = Math.ceil(ptg * maxScroll)
  nextScrollOffset = Math.max(nextScrollOffset, 0)
  nextScrollOffset = Math.min(nextScrollOffset, maxScroll)

  return nextScrollOffset
}

export function useScrollbarDrag(
  containerRef: ShallowRef<HTMLElement | undefined>,
  metrics: Ref<ScrollMetrics>,
  thumbSizeX: Ref<number>,
  thumbSizeY: Ref<number>,
  sync: () => void,
  direction?: Ref<'ltr' | 'rtl' | undefined>,
) {
  const draggingX = ref(false)
  const draggingY = ref(false)
  const dragState = ref<DragState | null>(null)

  const isRtl = () => direction?.value === 'rtl'

  const onMouseMove = (event: MouseEvent) => {
    const element = containerRef.value
    const state = dragState.value
    if (!element || !state) {
      return
    }

    if (state.axis === 'y') {
      const delta = event.clientY - state.startClient
      const maxTrack = metrics.value.clientHeight - thumbSizeY.value
      const maxScroll = metrics.value.scrollHeight - metrics.value.clientHeight
      if (maxTrack > 0 && maxScroll > 0) {
        const nextThumbTop = state.startScroll / maxScroll * maxTrack + delta
        element.scrollTop = getScrollOffsetByThumbTop(nextThumbTop, maxScroll, maxTrack)
        sync()
      }
      return
    }

    const delta = event.clientX - state.startClient
    const maxTrack = metrics.value.clientWidth - thumbSizeX.value
    const maxScroll = metrics.value.scrollWidth - metrics.value.clientWidth
    if (maxTrack > 0 && maxScroll > 0) {
      const nextThumbTop = state.startScroll / maxScroll * maxTrack + delta
      element.scrollLeft = getScrollOffsetByThumbTop(nextThumbTop, maxScroll, maxTrack)
      sync()
    }
  }

  const onMouseUp = () => {
    cleanup()
  }

  function cleanup() {
    dragState.value = null
    draggingX.value = false
    draggingY.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  const startDrag = (axis: Axis, event: MouseEvent) => {
    const element = containerRef.value
    if (!element) {
      return
    }

    dragState.value = {
      axis,
      startClient: axis === 'y' ? event.clientY : event.clientX,
      startScroll: axis === 'y' ? element.scrollTop : element.scrollLeft,
    }
    draggingX.value = axis === 'x'
    draggingY.value = axis === 'y'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    event.preventDefault()
  }

  /**
   * Jump the viewport so the thumb centre lands on the clicked track position.
   */
  const scrollToTrackPosition = (axis: Axis, event: MouseEvent, trackEl: HTMLElement) => {
    const element = containerRef.value
    if (!element) {
      return
    }

    const isVertical = axis === 'y'
    const maxScroll = isVertical
      ? metrics.value.scrollHeight - metrics.value.clientHeight
      : metrics.value.scrollWidth - metrics.value.clientWidth
    const thumbSize = isVertical ? thumbSizeY.value : thumbSizeX.value
    const maxTrack = (isVertical ? metrics.value.clientHeight : metrics.value.clientWidth) - thumbSize
    if (maxScroll <= 0 || maxTrack <= 0) {
      return
    }

    const rect = trackEl.getBoundingClientRect()
    const pagePosition = isVertical ? event.pageY : event.pageX
    if (!Number.isFinite(pagePosition)) {
      return
    }

    let thumbTop: number
    if (isVertical) {
      thumbTop = pagePosition - rect.top - thumbSize / 2
    }
    else if (isRtl()) {
      thumbTop = rect.right - pagePosition - thumbSize / 2
    }
    else {
      thumbTop = pagePosition - rect.left - thumbSize / 2
    }

    const nextScrollOffset = getScrollOffsetByThumbTop(thumbTop, maxScroll, maxTrack)

    if (isVertical) {
      element.scrollTop = nextScrollOffset
    }
    else {
      element.scrollLeft = nextScrollOffset
    }

    sync()
  }

  const startTrackJump = (axis: Axis, event: MouseEvent, trackEl: HTMLElement) => {
    if (event.button !== 0) {
      return
    }

    scrollToTrackPosition(axis, event, trackEl)
  }

  onBeforeUnmount(() => {
    cleanup()
  })

  return {
    draggingX,
    draggingY,
    onThumbMouseDownX: (event: MouseEvent) => startDrag('x', event),
    onThumbMouseDownY: (event: MouseEvent) => startDrag('y', event),
    onTrackMouseDownX: (event: MouseEvent, trackEl: HTMLElement) => startTrackJump('x', event, trackEl),
    onTrackMouseDownY: (event: MouseEvent, trackEl: HTMLElement) => startTrackJump('y', event, trackEl),
  }
}
