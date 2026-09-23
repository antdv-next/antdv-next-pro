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
  trackLengthX: Ref<number>,
  trackLengthY: Ref<number>,
  thumbTravelPercentX: Ref<number>,
  thumbTravelPercentY: Ref<number>,
  sync: () => void,
  direction?: Ref<'ltr' | 'rtl' | undefined>,
) {
  const draggingX = ref(false)
  const draggingY = ref(false)
  const dragState = ref<DragState | null>(null)

  const isRtl = () => direction?.value === 'rtl'

  /**
   * Maximum thumb travel in px, derived from the track-relative travel
   * percentage. This is the same quantity the renderer uses for `translate`,
   * so drag and render stay in lockstep and both respect the track inset.
   */
  const maxTrackX = () => (thumbTravelPercentX.value / 100) * trackLengthX.value
  const maxTrackY = () => (thumbTravelPercentY.value / 100) * trackLengthY.value

  const onMouseMove = (event: MouseEvent) => {
    const element = containerRef.value
    const state = dragState.value
    if (!element || !state) {
      return
    }

    if (state.axis === 'y') {
      const delta = event.clientY - state.startClient
      const maxTrack = maxTrackY()
      const maxScroll = metrics.value.scrollHeight - metrics.value.clientHeight
      if (maxTrack > 0 && maxScroll > 0) {
        const nextThumbTop = state.startScroll / maxScroll * maxTrack + delta
        element.scrollTop = getScrollOffsetByThumbTop(nextThumbTop, maxScroll, maxTrack)
        sync()
      }
      return
    }

    const delta = isRtl() ? state.startClient - event.clientX : event.clientX - state.startClient
    const maxTrack = maxTrackX()
    const maxScroll = metrics.value.scrollWidth - metrics.value.clientWidth
    if (maxTrack > 0 && maxScroll > 0) {
      const nextThumbTop = state.startScroll / maxScroll * maxTrack + delta
      const nextScrollOffset = getScrollOffsetByThumbTop(nextThumbTop, maxScroll, maxTrack)
      /**
       * RTL reports `scrollLeft` in `[-maxScroll, 0]`, so the logical offset
       * has to be written back negated — a real browser clamps a positive
       * assignment straight back to 0, which would kill the drag entirely.
       */
      element.scrollLeft = isRtl() ? -nextScrollOffset : nextScrollOffset
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
      /**
       * Normalize the horizontal start offset the same way `thumbOffsetX`
       * reads it: RTL reports a negative `scrollLeft`, so flip it to the
       * distance scrolled from the start (right) edge.
       */
      startScroll: axis === 'y'
        ? element.scrollTop
        : (isRtl() ? -element.scrollLeft : element.scrollLeft),
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
    const maxTrack = isVertical ? maxTrackY() : maxTrackX()
    if (maxScroll <= 0 || maxTrack <= 0) {
      return
    }

    const rect = trackEl.getBoundingClientRect()
    /**
     * Client coordinates, not page coordinates.
     *
     * `getBoundingClientRect()` is viewport-relative, so the click has to be
     * measured the same way. `pageY` is document-relative: pairing it with
     * `rect.top` overshoots by twice the page scroll offset, which clamped
     * `thumbTop` past `maxTrack` and sent the thumb to the bottom of the range
     * for any click position once the page was scrolled.
     */
    const viewportPosition = isVertical ? event.clientY : event.clientX
    if (!Number.isFinite(viewportPosition)) {
      return
    }

    // Thumb length in the same px space as the track rect.
    const thumbSize = isVertical
      ? (100 - thumbTravelPercentY.value) / 100 * trackLengthY.value
      : (100 - thumbTravelPercentX.value) / 100 * trackLengthX.value

    let thumbTop: number
    if (isVertical) {
      thumbTop = viewportPosition - rect.top - thumbSize / 2
    }
    else if (isRtl()) {
      thumbTop = rect.right - viewportPosition - thumbSize / 2
    }
    else {
      thumbTop = viewportPosition - rect.left - thumbSize / 2
    }

    const nextScrollOffset = getScrollOffsetByThumbTop(thumbTop, maxScroll, maxTrack)

    if (isVertical) {
      element.scrollTop = nextScrollOffset
    }
    else {
      /**
       * `nextScrollOffset` is a track-relative logical offset in `[0, maxScroll]`;
       * RTL scroll positions live in `[-maxScroll, 0]`, hence the negation.
       */
      element.scrollLeft = isRtl() ? -nextScrollOffset : nextScrollOffset
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
