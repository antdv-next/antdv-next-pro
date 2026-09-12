<docs lang="zh-CN">
使用 `collapseTags` 仅展示前两个标签，其余标签合并为数量提示；开启 `collapseTagsTooltip` 后可以悬停查看隐藏标签。
</docs>

<docs lang="en-US">
Use `collapseTags` to show only the first two tags and a count for the remaining tags. Enable `collapseTagsTooltip` to view the hidden tags on hover.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const tags = ref(['one', 'two', 'three', 'four'])
</script>

<template>
  <a-input-tag
    v-model:value="tags"
    collapse-tags
    collapse-tags-tooltip
    :max-collapse-tags="2"
  />
</template>
