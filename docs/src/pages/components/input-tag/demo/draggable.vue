<docs lang="zh-CN">
开启 `draggable` 后，可以通过拖拽调整标签顺序。
</docs>

<docs lang="en-US">
Enable `draggable` to reorder tags by dragging them.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const tags = ref(['one', 'two', 'three'])
</script>

<template>
  <a-input-tag v-model:value="tags" draggable />
</template>
