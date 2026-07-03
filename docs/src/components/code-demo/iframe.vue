<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue'
import { enqueueIframeLoad, onIframeLoaded } from './iframeQueue'

defineOptions({
  name: 'CodeIframe',
})
const { src, height } = defineProps<{
  src: string
  height?: string
}>()

const containerRef = shallowRef<HTMLElement>()
const shouldLoad = shallowRef(false)
const loading = shallowRef(true)
const isQueued = shallowRef(false)

let observer: IntersectionObserver | null = null

const httpSrc = computed(() => {
  if (src.startsWith('http')) {
    return src
  }
  return `/~demos/${src}`
})

const normalizedHeight = computed(() => {
  if (!height)
    return '300px'
  // 如果是纯数字，加上 px 单位
  return /^\d+$/.test(height) ? `${height}px` : height
})

const containerStyle = computed(() => ({
  minHeight: loading.value ? normalizedHeight.value : undefined,
}))

function onLoad() {
  loading.value = false
  onIframeLoaded()
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting && !isQueued.value) {
        isQueued.value = true
        observer?.disconnect()
        observer = null
        // 加入队列，串行加载
        enqueueIframeLoad(() => {
          shouldLoad.value = true
        })
      }
    },
    { rootMargin: '200px' },
  )
  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <div ref="containerRef" class="code-box-iframe" :style="containerStyle">
    <iframe v-if="shouldLoad" :src="httpSrc" border="none" class="w-full" :height="height" @load="onLoad" />
    <div v-if="loading" class="code-box-iframe-spinning">
      <a-spin spinning />
    </div>
  </div>
</template>

<style>
.code-box-iframe {
  position: relative;
  border-top: 2em solid rgba(230, 230, 230, 0.7);
  border-radius: var(--ant-border-radius-sm) var(--ant-border-radius-sm) 0 0;
  border-bottom: 1px solid rgba(5, 5, 5, 0.06);
}

.dark .code-box-iframe {
  border-top-color: rgba(60, 60, 60, 0.7);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.code-box-iframe-spinning {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.code-box-iframe::before {
  position: absolute;
  top: -1.25em;
  inset-inline-start: 1em;
  display: block;
  width: 0.5em;
  height: 0.5em;
  background-color: #f44;
  border-radius: 50%;
  box-shadow:
    0 0 0 2px #f44,
    1.5em 0 0 2px #9b3,
    3em 0 0 2px #fb5;
  content: '';
}

.code-box-iframe::after {
  content: '';
  display: block;
  position: absolute;
  top: -1.6em;
  inset-inline-start: 5.5em;
  width: calc(100% - 6em);
  height: 1.2em;
  background-color: #fff;
  border-radius: var(--ant-border-radius-sm);
}

.dark .code-box-iframe::after {
  background-color: #1f1f1f;
}
</style>
