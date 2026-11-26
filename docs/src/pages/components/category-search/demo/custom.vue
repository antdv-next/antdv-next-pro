<docs lang="zh-CN">
`type: 'custom'` 的维度通过 `panel` 插槽提供值面板；`labelRender` 插槽自定义标签里值的显示，`optionRender` 插槽自定义维度列表项。
</docs>

<docs lang="en-US">
A `type: 'custom'` dimension renders its value editor through the `panel` slot; the `labelRender` slot customizes how a value is shown in the tag, and `optionRender` customizes the dimension list items.
</docs>

<script setup lang="ts">
import type { CategorySearchOption } from '@antdv-next/pro/category-search'

const colors = ['red', 'orange', 'green', 'blue', 'purple']

const options: CategorySearchOption[] = [
  { label: 'Color', value: 'color', type: 'custom' },
  { label: 'Rating', value: 'rating', type: 'custom' },
]
</script>

<template>
  <a-category-search :options="options">
    <template #optionRender="{ option }">
      {{ option.value === 'color' ? '🎨' : '⭐' }} {{ option.label }}
    </template>
    <template #panel="{ option, value, setValue, confirm, cancel }">
      <a-flex v-if="option.value === 'color'" gap="small" wrap>
        <a-tag
          v-for="color in colors"
          :key="color"
          :color="color"
          style="cursor: pointer"
          @click="confirm(color)"
        >
          {{ color }}
        </a-tag>
      </a-flex>
      <a-flex v-else vertical gap="small">
        <a-rate :value="value ?? 0" @update:value="setValue" />
        <a-flex justify="end" gap="small">
          <a-button size="small" @click="cancel">
            Cancel
          </a-button>
          <a-button size="small" type="primary" @click="confirm()">
            OK
          </a-button>
        </a-flex>
      </a-flex>
    </template>
    <template #labelRender="{ option, item }">
      <a-tag v-if="option.value === 'color'" :color="item.value" :bordered="false" style="margin: 0">
        {{ item.value }}
      </a-tag>
      <template v-else>
        {{ '★'.repeat(item.value) }}
      </template>
    </template>
  </a-category-search>
</template>
