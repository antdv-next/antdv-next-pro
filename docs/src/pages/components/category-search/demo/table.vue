<docs lang="zh-CN">
CategorySearch 只产出筛选条件，数据过滤由使用方完成。这里把条件和关键字用于筛选表格。
</docs>

<docs lang="en-US">
CategorySearch only produces filter conditions; filtering data is up to you. Here the conditions and keyword filter a table.
</docs>

<script setup lang="ts">
import type { CategorySearchOption, CategorySearchValue } from '@antdv-next/pro/category-search'
import { computed, ref } from 'vue'

interface Row {
  key: number
  name: string
  role: string
  age: number
}

const data: Row[] = [
  { key: 1, name: 'John Brown', role: 'developer', age: 32 },
  { key: 2, name: 'Jim Green', role: 'designer', age: 42 },
  { key: 3, name: 'Joe Black', role: 'developer', age: 28 },
  { key: 4, name: 'Jane White', role: 'manager', age: 36 },
]

const options: CategorySearchOption[] = [
  {
    label: 'Role',
    value: 'role',
    multiple: true,
    children: [
      { label: 'Developer', value: 'developer' },
      { label: 'Designer', value: 'designer' },
      { label: 'Manager', value: 'manager' },
    ],
  },
  { label: 'Age', value: 'age', type: 'numberRange' },
]

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
]

const value = ref<CategorySearchValue>([])
const keyword = ref('')

const filtered = computed(() => data.filter((row) => {
  if (keyword.value && !row.name.toLowerCase().includes(keyword.value.toLowerCase()))
    return false
  return value.value.every((item) => {
    if (item.key === 'role')
      return (item.value as string[]).includes(row.role)
    if (item.key === 'age') {
      const [min, max] = item.value as [number | null, number | null]
      return (min === null || row.age >= min) && (max === null || row.age <= max)
    }
    return true
  })
}))
</script>

<template>
  <a-flex vertical gap="middle">
    <a-category-search
      v-model:value="value"
      v-model:search-value="keyword"
      :options="options"
      placeholder="Filter members or search by name"
      allow-clear
    />
    <a-table :columns="columns" :data-source="filtered" :pagination="false" size="small" />
  </a-flex>
</template>
