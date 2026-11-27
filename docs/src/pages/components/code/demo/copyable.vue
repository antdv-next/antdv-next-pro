<docs lang="zh-CN">
`copyable` 在头部显示复制按钮，交互和 `Typography` 的 `copyable` 一致。传入对象可以自定义复制文本、图标和提示。复制成功触发 `copy`，失败触发 `error`（`stage` 为 `'copy'`）。
</docs>

<docs lang="en-US">
`copyable` shows a copy button in the header, behaving like `copyable` of `Typography`. Pass an object to customize the copied text, icons and tooltips. A successful copy emits `copy`; a failure emits `error` with `stage: 'copy'`.
</docs>

<script setup lang="ts">
import type { CodeCopyConfig } from '@antdv-next/pro'
import { SmileFilled, SmileOutlined } from '@antdv-next/icons'
import { message } from 'antdv-next'
import { h } from 'vue'

const content = `pnpm add @antdv-next/pro
pnpm add shiki`

const copyConfig: CodeCopyConfig = {
  text: 'pnpm add @antdv-next/pro shiki',
  icon: [h(SmileOutlined), h(SmileFilled)],
  tooltips: ['Copy as one command', 'Copied!'],
}

function onCopy({ text }: { text: string }) {
  message.success(`Copied: ${text}`)
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-code :content="content" copyable @copy="onCopy" />
    <a-code :content="content" :copyable="copyConfig" @copy="onCopy" />
  </a-flex>
</template>
