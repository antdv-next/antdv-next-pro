<docs lang="zh-CN">
`size`、`variant`、`status` 与 Input 一致；`disabled` 时不能打开浮层、删除或清空。
</docs>

<docs lang="en-US">
`size`, `variant` and `status` work the same as Input. When `disabled`, the popup cannot be opened and nothing can be removed or cleared.
</docs>

<script setup lang="ts">
import type { CategorySearchOption, CategorySearchValue } from '@antdv-next/pro/category-search'

const options: CategorySearchOption[] = [
  { label: 'Name', value: 'name', type: 'input' },
  { label: 'Age', value: 'age', type: 'numberRange' },
]

const value: CategorySearchValue = [{ key: 'age', value: [18, 30] }]
</script>

<template>
  <a-flex vertical gap="middle">
    <a-category-search size="small" :options="options" :default-value="value" />
    <a-category-search :options="options" :default-value="value" variant="filled" />
    <a-category-search size="large" :options="options" :default-value="value" variant="underlined" />
    <a-category-search :options="options" :default-value="value" status="error" />
    <a-category-search :options="options" :default-value="value" status="warning" />
    <a-category-search :options="options" :default-value="value" disabled />
  </a-flex>
</template>
