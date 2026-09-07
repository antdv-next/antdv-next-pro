<docs lang="zh-CN">
通过 `v-model:value` 使用默认的六字段 Quartz Cron 编辑器。
</docs>

<docs lang="en-US">
Use the default six-field Quartz Cron editor with `v-model:value`.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('0 0 9 * * ?')
</script>

<template>
  <a-cron v-model:value="value" />
</template>
