<docs lang="zh-CN">
开启 `saveOnBlur` 后，输入框失焦时会自动将当前输入内容保存为标签。
</docs>

<docs lang="en-US">
When `saveOnBlur` is enabled, the current input is automatically saved as a tag when the input loses focus.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const tags = ref<string[]>([])
</script>

<template>
  <a-input-tag v-model:value="tags" save-on-blur placeholder="Type a tag, then click outside" />
</template>
