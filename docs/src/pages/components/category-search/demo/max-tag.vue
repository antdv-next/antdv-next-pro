<docs lang="zh-CN">
用 `maxTagCount` 限制显示的标签数，`maxTagPlaceholder` 自定义折叠内容；`maxTagTextLength` 截断过长的值。
</docs>

<docs lang="en-US">
Limit visible tags with `maxTagCount` and customize the collapsed content with `maxTagPlaceholder`; `maxTagTextLength` truncates long values.
</docs>

<script setup lang="ts">
import type { CategorySearchOption, CategorySearchValue } from '@antdv-next/pro/category-search'

const options: CategorySearchOption[] = [
  { label: 'Title', value: 'title', type: 'input' },
  { label: 'Author', value: 'author', type: 'input' },
  { label: 'Reviewer', value: 'reviewer', type: 'input' },
  { label: 'Branch', value: 'branch', type: 'input' },
]

const value: CategorySearchValue = [
  { key: 'title', value: 'A really long title that keeps going' },
  { key: 'author', value: 'alice' },
  { key: 'reviewer', value: 'bob' },
  { key: 'branch', value: 'main' },
]
</script>

<template>
  <a-category-search
    :options="options"
    :default-value="value"
    :max-tag-count="2"
    :max-tag-text-length="12"
  >
    <template #maxTagPlaceholder="{ omittedValues }">
      +{{ omittedValues.length }} more
    </template>
  </a-category-search>
</template>
