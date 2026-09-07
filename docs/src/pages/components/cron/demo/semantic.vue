<docs lang="zh-CN">
通过 `classes` 和 `styles` 定制重要语义化结构。
</docs>

<docs lang="en-US">
Customize important semantic structures with `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { CronProps } from '@antdv-next/pro/cron'
import { ref } from 'vue'

const value = ref('0 0 18 ? * MON,FRI')
const classes: CronProps['classes'] = {
  preview: 'cron-demo-preview',
}
const styles: CronProps['styles'] = {
  fields: { maxWidth: '680px' },
}
</script>

<template>
  <a-cron v-model:value="value" preview :classes="classes" :styles="styles" />
</template>

<style>
.cron-demo-preview {
  border-inline-start: 3px solid var(--ant-color-primary);
}
</style>
