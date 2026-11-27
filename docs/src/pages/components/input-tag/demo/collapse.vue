<docs lang="zh-CN">
使用 `maxTagCount` 仅展示前两个标签，其余标签合并为数量提示；开启 `maxTagTooltip` 后可以悬停查看隐藏标签，`maxTagPlaceholder` 可以自定义提示内容。
</docs>

<docs lang="en-US">
Use `maxTagCount` to show only the first two tags and a count for the remaining tags. Enable `maxTagTooltip` to view the hidden tags on hover, and customize the placeholder with `maxTagPlaceholder`.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const tags = ref(['one', 'two', 'three', 'four'])
</script>

<template>
  <a-flex vertical gap="middle">
    <a-input-tag
      v-model:value="tags"
      :max-tag-count="2"
      max-tag-tooltip
    />
    <a-input-tag
      v-model:value="tags"
      :max-tag-count="2"
      :max-tag-placeholder="(omitted: string[]) => `+${omitted.length} more`"
    />
  </a-flex>
</template>
