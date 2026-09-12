<docs lang="zh-CN">
通过 `trigger="space"` 将 Space 设置为标签提交触发键。
</docs>

<docs lang="en-US">
Set Space as the tag submission key with `trigger="space"`.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const tags = ref<string[]>([])
</script>

<template>
  <a-input-tag v-model:value="tags" trigger="space" placeholder="Type a tag and press Space" />
</template>
