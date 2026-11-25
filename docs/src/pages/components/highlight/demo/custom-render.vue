<docs lang="zh-CN">
通过 `#highlight` 插槽或 `highlightRender` 自定义命中内容，二者都渲染在命中标签内部，插槽优先。
</docs>

<docs lang="en-US">
Customize hit content with the `#highlight` slot or `highlightRender`. Both render inside the highlight tag, and the slot wins.
</docs>

<script setup lang="ts">
import type { HighlightRenderInfo } from '@antdv-next/pro/highlight'
import { h } from 'vue'

const content = 'Search results for vue: Vue Router, Pinia for Vue, VueUse.'

function highlightRender({ text, keyword }: HighlightRenderInfo) {
  return h('span', { title: `keyword: ${String(keyword)}` }, text.toUpperCase())
}
</script>

<template>
  <a-flex vertical gap="small">
    <a-highlight :content="content" keywords="vue">
      <template #highlight="{ text, index }">
        <sup>{{ index + 1 }}</sup>{{ text }}
      </template>
    </a-highlight>
    <a-highlight :content="content" keywords="vue" :highlight-render="highlightRender" />
  </a-flex>
</template>
