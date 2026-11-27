<docs lang="zh-CN">
直接输入的文字是独立的关键字 `searchValue`，按 Enter 触发 `search` 事件，同时拿到关键字和已选条件。
</docs>

<docs lang="en-US">
Typed text is an independent keyword `searchValue`. Press Enter to fire `search` with both the keyword and the selected conditions.
</docs>

<script setup lang="ts">
import type { CategorySearchOption, CategorySearchValue } from '@antdv-next/pro/category-search'
import { ref } from 'vue'

const options: CategorySearchOption[] = [
  {
    label: 'Type',
    value: 'type',
    children: [
      { label: 'Component', value: 'component' },
      { label: 'Hook', value: 'hook' },
    ],
  },
]

const keyword = ref('')
const lastSearch = ref('')

function onSearch(searchValue: string, value: CategorySearchValue) {
  lastSearch.value = JSON.stringify({ searchValue, value })
}
</script>

<template>
  <a-flex vertical gap="small">
    <a-category-search
      v-model:search-value="keyword"
      :options="options"
      placeholder="Type a keyword and press Enter"
      @search="onSearch"
    />
    <a-typography-text type="secondary">
      {{ lastSearch || 'Press Enter to search' }}
    </a-typography-text>
  </a-flex>
</template>
