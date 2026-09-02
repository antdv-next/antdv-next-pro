<docs lang="zh-CN">
配置 `tokenSeparators` 后，按 Enter 确认时会按照分隔符拆分输入内容，并批量添加多个标签。
</docs>

<docs lang="en-US">
With `tokenSeparators` configured, press Enter to split the input by the configured separators and add multiple tags at once.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const tags = ref<string[]>([])
</script>

<template>
  <a-input-tag v-model:value="tags" :token-separators="[',', ' ']" placeholder="Type comma or space, then press Enter" />
</template>
