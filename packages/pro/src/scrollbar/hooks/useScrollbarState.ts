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

/**
 * Minimum thumb length in px, kept grabbable.
 *
 * This is a *target* rather than a hard floor: it is translated into a
 * percentage of the track and clamped to 100%, so it can never push the thumb
 * past the end of a track that is shorter than this value.
 */
const MIN_THUMB_SIZE = 20

export function useScrollbarState(
  containerRef: ShallowRef<HTMLElement | undefined>,
  contentRef: ShallowRef<HTMLElement | undefined>,
  visibilityX: Ref<ScrollbarVisibility | undefined>,
  visibilityY: Ref<ScrollbarVisibility | undefined>,
  inset: Ref<number>,
  size: Ref<number>,
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

  /**
   * Both axes need a track, so the two tracks have to give up the shared corner
   * square. Mirrors the `&-both-axis` rule in `style/index.ts`; both conditions
   * must agree or the thumb geometry drifts from the painted track.
   */
  const bothAxis = computed(() => showTrackX.value && showTrackY.value)

  /**
   * Track length in px, i.e. the space the thumb is positioned within.
   *
   * The track is inset from the container on both ends by the `inset` token
   * (see `style/index.ts`), so its length is `client - 2 * inset`. Deriving it
   * here instead of using the raw container size is what keeps the thumb inside
   * the track: previously the thumb length and travel were both computed from
   * `clientHeight`, which made the thumb overshoot the track by `inset` at the
   * far end of its travel.
   *
   * When both axes scroll the track additionally stops one `size` short of the
   * shared corner, hence the `size` term — without it the thumb would overshoot
   * by `size` in the same way it used to overshoot by `inset`.
   */
  const trackLengthX = computed(() =>
    Math.max(metrics.value.clientWidth - 2 * inset.value - (showTrackY.value ? size.value : 0), 0),
  )
  const trackLengthY = computed(() =>
    Math.max(metrics.value.clientHeight - 2 * inset.value - (showTrackX.value ? size.value : 0), 0),
  )

  /**
   * Thumb length as a percentage of the track.
   *
   * The visible fraction `client / scroll` maps directly onto the track length.
   * The `MIN_THUMB_SIZE` floor is converted to a percentage of *this* track and
   * clamped to 100%, so a short track yields a full-length thumb rather than an
   * overflowing one.
   */
  const thumbPercentX = computed(() => {
    const trackLength = trackLengthX.value
    if (!metrics.value.clientWidth || !metrics.value.scrollWidth || trackLength <= 0) {
      return 0
    }

    const ratio = metrics.value.clientWidth / metrics.value.scrollWidth
    const minPercent = Math.min((MIN_THUMB_SIZE / trackLength) * 100, 100)
    return Math.min(Math.max(ratio * 100, minPercent), 100)
  })

  const thumbPercentY = computed(() => {
    const trackLength = trackLengthY.value
    if (!metrics.value.clientHeight || !metrics.value.scrollHeight || trackLength <= 0) {
      return 0
    }

    const ratio = metrics.value.clientHeight / metrics.value.scrollHeight
    const minPercent = Math.min((MIN_THUMB_SIZE / trackLength) * 100, 100)
    return Math.min(Math.max(ratio * 100, minPercent), 100)
  })

  /**
   * Thumb travel as a percentage of the track.
   *
   * The thumb occupies `thumbPercent`, so it can travel the remaining
   * `100 - thumbPercent`. Both ends are track-relative, which is why no inset
   * term appears here.
   */
  const thumbTravelPercentX = computed(() => Math.max(100 - thumbPercentX.value, 0))
  const thumbTravelPercentY = computed(() => Math.max(100 - thumbPercentY.value, 0))

  /**
   * Thumb offset in px, converted from the track-relative travel percentage.
   * Clamped to the travel range so the thumb always ends flush with the track.
   */
  const thumbOffsetX = computed(() => {
    const maxScroll = metrics.value.scrollWidth - metrics.value.clientWidth
    if (maxScroll <= 0) {
      return 0
    }
    const ratio = Math.min(Math.max(metrics.value.scrollLeft / maxScroll, 0), 1)
    return ratio * (thumbTravelPercentX.value / 100) * trackLengthX.value
  })

  const thumbOffsetY = computed(() => {
    const maxScroll = metrics.value.scrollHeight - metrics.value.clientHeight
    if (maxScroll <= 0) {
      return 0
    }
    const ratio = Math.min(Math.max(metrics.value.scrollTop / maxScroll, 0), 1)
    return ratio * (thumbTravelPercentY.value / 100) * trackLengthY.value
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
    bothAxis,
    trackLengthX,
    trackLengthY,
    thumbPercentX,
    thumbPercentY,
    thumbTravelPercentX,
    thumbTravelPercentY,
    thumbOffsetX,
    thumbOffsetY,
    sync,
  }
}
