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

export function useScrollbarDrag(
  containerRef: ShallowRef<HTMLElement | undefined>,
  metrics: Ref<ScrollMetrics>,
  thumbSizeX: Ref<number>,
  thumbSizeY: Ref<number>,
  sync: () => void,
) {
  const draggingX = ref(false)
  const draggingY = ref(false)
  const dragState = ref<DragState | null>(null)

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
        element.scrollTop = state.startScroll + delta * (maxScroll / maxTrack)
        sync()
      }
      return
    }

    const delta = event.clientX - state.startClient
    const maxTrack = metrics.value.clientWidth - thumbSizeX.value
    const maxScroll = metrics.value.scrollWidth - metrics.value.clientWidth
    if (maxTrack > 0 && maxScroll > 0) {
      element.scrollLeft = state.startScroll + delta * (maxScroll / maxTrack)
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

  onBeforeUnmount(() => {
    cleanup()
  })

  return {
    draggingX,
    draggingY,
    onThumbMouseDownX: (event: MouseEvent) => startDrag('x', event),
    onThumbMouseDownY: (event: MouseEvent) => startDrag('y', event),
  }
}
