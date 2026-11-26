<docs lang="zh-CN">
与 Select 一样，用 `{ label, options }` 对维度分组。
</docs>

<docs lang="en-US">
Group dimensions with `{ label, options }`, the same as Select.
</docs>

<script setup lang="ts">
import type { CategorySearchProps } from '@antdv-next/pro/category-search'

const options: CategorySearchProps['options'] = [
  {
    label: 'Basic',
    options: [
      { label: 'Name', value: 'name', type: 'input' },
      {
        label: 'Gender',
        value: 'gender',
        children: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ],
      },
    ],
  },
  {
    label: 'Account',
    options: [
      { label: 'Balance', value: 'balance', type: 'numberRange' },
      { label: 'Registered', value: 'registered', type: 'dateRange', componentProps: { valueFormat: 'YYYY-MM-DD' } },
    ],
  },
]
</script>

<template>
  <a-category-search :options="options" />
</template>
