<docs lang="zh-CN">
点击输入框选择维度，再按维度类型编辑值。已选条件以 `维度: 值` 的标签展示，点击标签可以重新编辑。
</docs>

<docs lang="en-US">
Click the input to pick a dimension, then edit its value according to its type. Selected conditions are shown as `Dimension: value` tags; click a tag to edit it again.
</docs>

<script setup lang="ts">
import type { CategorySearchOption, CategorySearchValue } from '@antdv-next/pro/category-search'
import { ref } from 'vue'

const options: CategorySearchOption[] = [
  {
    label: 'Status',
    value: 'status',
    children: [
      { label: 'Open', value: 'open' },
      { label: 'In progress', value: 'progress' },
      { label: 'Closed', value: 'closed' },
    ],
  },
  {
    label: 'Labels',
    value: 'labels',
    multiple: true,
    children: [
      { label: 'Bug', value: 'bug' },
      { label: 'Feature', value: 'feature' },
      { label: 'Docs', value: 'docs' },
    ],
  },
  { label: 'Created', value: 'created', type: 'dateRange', componentProps: { valueFormat: 'YYYY-MM-DD' } },
  { label: 'Story points', value: 'points', type: 'numberRange', componentProps: { min: 0 } },
  { label: 'Title', value: 'title', type: 'input' },
]

const value = ref<CategorySearchValue>([
  { key: 'status', value: 'open' },
  { key: 'labels', value: ['bug', 'docs'] },
])
</script>

<template>
  <a-flex vertical gap="small">
    <a-category-search v-model:value="value" :options="options" allow-clear />
    <a-typography-text type="secondary">
      {{ JSON.stringify(value) }}
    </a-typography-text>
  </a-flex>
</template>
