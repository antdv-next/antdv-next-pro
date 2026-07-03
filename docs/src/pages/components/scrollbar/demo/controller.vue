<docs lang="zh-CN">
监听 `scroll` 事件，并通过实例 `scrollTo` 主动控制滚动位置。
</docs>

<docs lang="en-US">
Listen to `scroll` and control the container position with the exposed `scrollTo` method.
</docs>

<script setup lang="ts">
import type { ScrollbarRef } from '@antdv-next/pro/scrollbar'
import { ref } from 'vue'

const scrollbarRef = ref<ScrollbarRef | null>(null)
const scrollLeft = ref(0)
const scrollTop = ref(0)

function handleScroll(event: Event) {
  const target = event.target as HTMLElement
  scrollLeft.value = Math.round(target.scrollLeft)
  scrollTop.value = Math.round(target.scrollTop)
}

function scrollToStart() {
  scrollbarRef.value?.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
}

function scrollToMiddle() {
  scrollbarRef.value?.scrollTo({ left: 220, top: 140, behavior: 'smooth' })
}

function scrollToEnd() {
  scrollbarRef.value?.scrollTo({ left: 9999, top: 9999, behavior: 'smooth' })
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-flex wrap="wrap" gap="small" align="center">
      <a-button size="small" @click="scrollToStart">
        Top Left
      </a-button>
      <a-button size="small" @click="scrollToMiddle">
        Center
      </a-button>
      <a-button size="small" type="primary" @click="scrollToEnd">
        Bottom Right
      </a-button>
      <a-tag color="blue">
        left: {{ scrollLeft }}
      </a-tag>
      <a-tag color="cyan">
        top: {{ scrollTop }}
      </a-tag>
    </a-flex>

    <a-scrollbar
      ref="scrollbarRef"
      visibility-x="always"
      visibility-y="always"
      style="height: 240px; border: 1px solid var(--ant-color-border); border-radius: 14px;"
      @scroll="handleScroll"
    >
      <div style="min-width: 720px; padding: 16px;">
        <a-flex vertical gap="small">
          <div
            v-for="index in 12"
            :key="index"
            style="display: grid; grid-template-columns: 120px 1fr 140px; gap: 12px; min-width: 680px; padding: 12px 14px; border-radius: 10px; background: color-mix(in srgb, var(--ant-color-fill-secondary), transparent 16%);"
          >
            <strong>Row {{ index }}</strong>
            <span>Programmatic scrolling keeps the native container and overlay thumbs in sync.</span>
            <a-tag>{{ index }}</a-tag>
          </div>
        </a-flex>
      </div>
    </a-scrollbar>
  </a-flex>
</template>
