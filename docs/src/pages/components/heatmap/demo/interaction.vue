<docs lang="zh-CN">
开启 Tooltip 后，鼠标悬浮或键盘聚焦日期单元格即可查看详情；按 Enter 或空格可以触发日期点击。
</docs>

<docs lang="en-US">
With Tooltip enabled, hover or focus a date cell for details. Press Enter or Space to trigger a date click.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const day = 86400000
const today = new Date()
const end = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
const start = end - 364 * day
const selected = ref('未选择日期')
const data = Array.from({ length: 365 }, (_, index) => ({
  timestamp: start + index * day,
  value: index % 6 === 0 ? 0 : (index % 12) + 1,
}))

function handleCellClick(item: { timestamp: number, value?: number | null }) {
  selected.value = `${new Date(item.timestamp).toISOString().slice(0, 10)}: ${item.value}`
}
</script>

<template>
  <a-heatmap
    :data="data"
    :range="{ start, end }"
    tooltip
    @cell-click="handleCellClick"
  >
    <template #tooltip="{ date, value, level }">
      <div>{{ date.toISOString().slice(0, 10) }}</div>
      <div>{{ value ?? 'No data' }} · Level {{ level }}</div>
    </template>
    <template #footer>
      <a-typography-text type="secondary">
        {{ selected }}
      </a-typography-text>
    </template>
  </a-heatmap>
</template>
