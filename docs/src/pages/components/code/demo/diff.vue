<docs lang="zh-CN">
开启 `diff` 后，每行的第一个字符是状态标记：`+` 新增、`-` 删除、空格表示未变化，其余部分是源码。行号变成旧、新两列。复制时只保留未变化行和新增行，不带标记和行号。Diff 和语法高亮互不影响：先解析标记，再分别对旧文本和新文本整段分词。
</docs>

<docs lang="en-US">
With `diff`, the first character of every line is a state marker: `+` added, `-` removed, a space for unchanged; the rest is source code. Line numbers become two columns (old and new). Copying keeps unchanged and added lines only, without markers or line numbers. Diff and syntax highlighting are independent: markers are parsed first, then the old and the new text are tokenized as a whole.
</docs>

<script lang="ts">
import { createShikiCodeHighlighter } from '@antdv-next/pro/code/shiki'

const highlighter = createShikiCodeHighlighter()
</script>

<script setup lang="ts">
const config = ` {
   "name": "service",
-  "timeout": 3000,
+  "timeout": 5000,
+  "retries": 2,
   "debug": false
 }`

const source = ` /**
  * Format a price.
- * @deprecated use formatCurrency
  */
-export function format(value: number) {
-  return '$' + value.toFixed(2)
+export function format(value: number, currency = 'USD') {
+  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)
 }`
</script>

<template>
  <a-flex vertical gap="middle">
    <a-code :content="config" diff show-line-numbers copyable />
    <a-code :content="source" language="ts" diff show-line-numbers copyable :highlighter="highlighter" />
  </a-flex>
</template>
