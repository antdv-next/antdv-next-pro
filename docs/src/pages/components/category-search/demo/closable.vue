<docs lang="zh-CN">
`closable: false` 的维度生成的标签不能删除，清空和退格都会保留它，但仍可以点击标签修改值。
</docs>

<docs lang="en-US">
Tags of a dimension with `closable: false` cannot be removed; clearing and Backspace keep them, but you can still click the tag to change its value.
</docs>

<script setup lang="ts">
import type { CategorySearchOption, CategorySearchValue } from '@antdv-next/pro/category-search'
import { ref } from 'vue'

const options: CategorySearchOption[] = [
  {
    label: 'Project',
    value: 'project',
    closable: false,
    children: [
      { label: 'antdv-next', value: 'antdv-next' },
      { label: 'antdv-next-pro', value: 'antdv-next-pro' },
    ],
  },
  { label: 'Assignee', value: 'assignee', type: 'input' },
]

const value = ref<CategorySearchValue>([
  { key: 'project', value: 'antdv-next-pro' },
  { key: 'assignee', value: 'alice' },
])
</script>

<template>
  <a-category-search v-model:value="value" :options="options" allow-clear />
</template>
