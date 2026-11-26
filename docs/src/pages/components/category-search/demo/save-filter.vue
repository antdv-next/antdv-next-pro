<docs lang="zh-CN">
组件不内置“保存过滤器”。可以在 `suffix` 插槽里放按钮，自己保存和恢复 `value`。
</docs>

<docs lang="en-US">
Saving filters is not built in. Put a button in the `suffix` slot and store or restore `value` yourself.
</docs>

<script setup lang="ts">
import type { CategorySearchOption, CategorySearchValue } from '@antdv-next/pro/category-search'
import { SaveOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

const options: CategorySearchOption[] = [
  {
    label: 'Status',
    value: 'status',
    children: [
      { label: 'Running', value: 'running' },
      { label: 'Stopped', value: 'stopped' },
    ],
  },
  { label: 'Region', value: 'region', type: 'input' },
]

const value = ref<CategorySearchValue>([{ key: 'status', value: 'running' }])
const saved = ref<{ name: string, value: CategorySearchValue }[]>([])

function save() {
  if (!value.value.length)
    return
  saved.value.push({ name: `Filter ${saved.value.length + 1}`, value: value.value.map(item => ({ ...item })) })
}
</script>

<template>
  <a-flex vertical gap="small">
    <a-category-search v-model:value="value" :options="options">
      <template #suffix>
        <a-tooltip title="Save filter">
          <a-button type="text" size="small" aria-label="Save filter" @click.stop="save">
            <template #icon>
              <SaveOutlined />
            </template>
          </a-button>
        </a-tooltip>
      </template>
    </a-category-search>
    <a-flex gap="small" wrap>
      <a-tag
        v-for="filter in saved"
        :key="filter.name"
        color="processing"
        style="cursor: pointer"
        @click="value = filter.value.map(item => ({ ...item }))"
      >
        {{ filter.name }}
      </a-tag>
    </a-flex>
  </a-flex>
</template>
