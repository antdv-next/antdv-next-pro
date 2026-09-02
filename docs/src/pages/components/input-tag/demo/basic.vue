<docs lang="zh-CN">
基础用法。输入内容后按 Enter 添加标签，点击标签关闭图标可以移除标签。
</docs>

<docs lang="en-US">
Basic usage. Press Enter after typing to add a tag, and click a tag close icon to remove it.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const tags = ref(['Vue', 'TypeScript'])
</script>

<template>
  <a-input-tag v-model:value="tags" placeholder="Add a tag" />
</template>
