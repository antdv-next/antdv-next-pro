<docs lang="zh-CN">
通过 `classes` 与 `styles` 定制语义化节点，支持对象或函数。未命中的文字是裸文本节点，继承 `root` 的样式。
</docs>

<docs lang="en-US">
Customize semantic nodes with `classes` and `styles`, as objects or functions. Unmatched text is a bare text node and inherits the `root` styles.
</docs>

<script setup lang="ts">
import type { HighlightProps } from '@antdv-next/pro/highlight'

const styles: HighlightProps['styles'] = {
  root: { color: 'var(--ant-color-text-secondary)' },
  highlight: {
    color: 'var(--ant-color-text)',
    backgroundColor: 'var(--ant-color-primary-bg)',
    borderBottom: '2px solid var(--ant-color-primary)',
    borderRadius: 0,
  },
}
</script>

<template>
  <a-highlight
    content="We supply a series of design principles, practical patterns and high quality design resources."
    :keywords="['design', 'patterns']"
    :styles="styles"
  />
</template>
