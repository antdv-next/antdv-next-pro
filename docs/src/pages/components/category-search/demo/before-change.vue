<docs lang="zh-CN">
`beforeChange` 在增、改、删、清空之前调用，返回 `false` 或 reject 时取消本次变更，支持返回 Promise。
</docs>

<docs lang="en-US">
`beforeChange` runs before an add, update, remove or clear. Return `false` or reject to cancel the change; a Promise is supported.
</docs>

<script setup lang="ts">
import type { CategorySearchChangeInfo, CategorySearchOption } from '@antdv-next/pro/category-search'
import { message } from 'antdv-next'

const options: CategorySearchOption[] = [
  {
    label: 'Level',
    value: 'level',
    children: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High (blocked)', value: 'high' },
    ],
  },
  { label: 'Keyword', value: 'keyword', type: 'input' },
]

function beforeChange(info: CategorySearchChangeInfo) {
  if (info.item?.value === 'high') {
    message.warning('"High" is not allowed here')
    return false
  }
  return new Promise<boolean>(resolve => setTimeout(() => resolve(true), 300))
}
</script>

<template>
  <a-category-search :options="options" :before-change="beforeChange" allow-clear />
</template>
