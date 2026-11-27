<docs lang="zh-CN">
在 Table 中高亮搜索词。`getHighlightChunks` 不依赖 Vue，也可以在 Select 的 `optionRender` 等场景里拼装自己的结构。
</docs>

<docs lang="en-US">
Highlight the search text inside a Table. `getHighlightChunks` has no Vue dependency, so it also fits places like Select `optionRender` where you build your own markup.
</docs>

<script setup lang="ts">
import type { TableColumnsType } from 'antdv-next'
import { getHighlightChunks } from '@antdv-next/pro'
import { computed, ref } from 'vue'

interface DataType {
  key: string
  name: string
  address: string
}

const search = ref('an')

const data: DataType[] = [
  { key: '1', name: 'John Brown', address: 'New York No. 1 Lake Park' },
  { key: '2', name: 'Jim Green', address: 'London No. 1 Lake Park' },
  { key: '3', name: 'Joe Black', address: 'Sydney No. 1 Lake Park' },
  { key: '4', name: 'Anna Hanson', address: 'Amsterdam Canal Street' },
]

const columns: TableColumnsType<DataType> = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
]

const filtered = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  if (!keyword)
    return data
  return data.filter(item => `${item.name} ${item.address}`.toLowerCase().includes(keyword))
})

const options = data.map(item => ({ value: item.name, label: item.name }))
</script>

<template>
  <a-flex vertical gap="middle">
    <a-input v-model:value="search" allow-clear placeholder="Search" style="max-width: 240px" />
    <a-table :columns="columns" :data-source="filtered" :pagination="false" size="small">
      <template #bodyCell="{ text }">
        <a-highlight :content="String(text)" :keywords="search.trim()" />
      </template>
    </a-table>
    <a-select :options="options" placeholder="optionRender + getHighlightChunks" style="max-width: 280px">
      <template #optionRender="{ option }">
        <span>
          <template v-for="chunk in getHighlightChunks(String(option.label), search.trim())" :key="chunk.start">
            <b v-if="chunk.highlight">{{ chunk.text }}</b>
            <template v-else>{{ chunk.text }}</template>
          </template>
        </span>
      </template>
    </a-select>
  </a-flex>
</template>
