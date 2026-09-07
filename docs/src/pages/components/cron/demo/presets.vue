<docs lang="zh-CN">
使用常用表达式和下一次执行时间预览。
</docs>

<docs lang="en-US">
Use common expressions and show the next execution preview.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('0 */5 * * * ?')
const presets = [
  { label: 'Every minute', value: '0 * * * * ?' },
  { label: 'Every hour', value: '0 0 * * * ?' },
  { label: 'Every day at 09:00', value: '0 0 9 * * ?' },
]
</script>

<template>
  <a-cron v-model:value="value" :presets="presets" preview />
</template>
