<docs lang="zh-CN">
配置 `tokenSeparators` 后，输入过程中遇到分隔符会立即拆分并添加标签；粘贴 `one, two, three` 这类内容也会自动拆分为多个标签。
</docs>

<docs lang="en-US">
With `tokenSeparators` configured, tags are split and added immediately when a separator is typed. Pasting content like `one, two, three` also splits it into multiple tags automatically.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const tags = ref<string[]>([])
</script>

<template>
  <a-input-tag v-model:value="tags" :token-separators="[',', ' ']" placeholder="Type comma or space to add tags" />
</template>
