<docs lang="zh-CN">
通过 `classes` 与 `styles` 定制语义化节点，支持对象或函数。
</docs>

<docs lang="en-US">
Customize semantic nodes with `classes` and `styles`, as objects or functions.
</docs>

<script setup lang="ts">
import type { CodeProps } from '@antdv-next/pro'

const content = ` const total = 3
-const page = 1
+const page = 2
 const pageSize = 20`

const styles: CodeProps['styles'] = ({ props }) => ({
  root: { borderColor: 'var(--ant-color-primary-border)', background: 'var(--ant-color-primary-bg)' },
  header: { borderColor: 'var(--ant-color-primary-border)' },
  lineNumber: { color: 'var(--ant-color-primary)' },
  marker: { fontWeight: props.diff ? 'bold' : undefined },
})
</script>

<template>
  <a-code :content="content" diff show-line-numbers copyable :styles="styles" />
</template>
