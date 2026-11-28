<docs lang="zh-CN">
头部扩展区可以用 `#extra` 插槽或 `extra` 属性，插槽优先。两种写法都能拿到 `{ copy, copied, language }`，可以用它做自己的复制入口。没有内容时不渲染头部。
</docs>

<docs lang="en-US">
The header extra area accepts the `#extra` slot or the `extra` prop; the slot wins. Both receive `{ copy, copied, language }`, which can drive a custom copy entry. The header is not rendered when there is nothing to show.
</docs>

<script lang="ts">
import type { CodeExtraInfo } from '@antdv-next/pro'
import { createShikiCodeHighlighter } from '@antdv-next/pro/code/shiki'
import { Tag } from 'antdv-next'
import { h } from 'vue'

const highlighter = createShikiCodeHighlighter()
</script>

<script setup lang="ts">
const content = `export default {
  name: 'app',
  version: '1.0.0',
}`

function renderExtra(info: CodeExtraInfo) {
  return h(Tag, { variant: 'filled' }, () => info.language)
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-code :content="content" language="js" :highlighter="highlighter" copyable>
      <template #extra="{ language }">
        <a-typography-text type="secondary">
          config.{{ language }}
        </a-typography-text>
      </template>
    </a-code>

    <a-code :content="content" language="js" :highlighter="highlighter" :extra="renderExtra" />

    <a-code :content="content" language="js" :highlighter="highlighter">
      <template #extra="{ copy, copied }">
        <a-button size="small" type="link" @click="copy">
          {{ copied ? 'Copied' : 'Copy code' }}
        </a-button>
      </template>
    </a-code>
  </a-flex>
</template>
