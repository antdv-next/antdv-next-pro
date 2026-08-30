<docs lang="zh-CN">
通过 `classes` 与 `styles` 定制 Heatmap 的核心结构。
</docs>

<docs lang="en-US">
Customize the key Heatmap structures with `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { HeatmapProps } from '@antdv-next/pro/heatmap'

const day = 86400000
const today = new Date()
const end = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
const start = end - 364 * day
const data = Array.from({ length: 365 }, (_, index) => ({
  timestamp: start + index * day,
  value: index % 4 === 0 ? 0 : (index % 9) + 1,
}))

const classes: HeatmapProps['classes'] = {
  root: 'heatmap-semantic-root',
  content: 'heatmap-semantic-content',
  cell: 'heatmap-semantic-cell',
  footer: 'heatmap-semantic-footer',
  indicator: 'heatmap-semantic-indicator',
}

const styles: HeatmapProps['styles'] = {
  content: {
    padding: '12px 16px',
    border: '2px dashed var(--ant-color-primary)',
    backgroundColor: 'var(--ant-color-fill-quaternary)',
  },
  cell: {
    outline: '1px solid color-mix(in srgb, var(--ant-color-primary), transparent 35%)',
    outlineOffset: '1px',
  },
  footer: {
    marginTop: '16px',
    padding: '10px 12px',
    border: '2px solid var(--ant-color-success)',
    backgroundColor: 'var(--ant-color-success-bg)',
  },
  indicator: {
    padding: '6px 8px',
    border: '1px solid var(--ant-color-warning)',
    backgroundColor: 'var(--ant-color-warning-bg)',
  },
}
</script>

<template>
  <a-heatmap
    :data="data"
    :range="{ start, end }"
    :classes="classes"
    :styles="styles"
  />
</template>

<style>
.heatmap-semantic-root {
  padding: 20px;
  border: 2px solid var(--ant-color-primary);
  border-radius: 8px;
  background: var(--ant-color-primary-bg);
}

.heatmap-semantic-content {
  border-radius: 6px;
}

.heatmap-semantic-cell {
  border-radius: 2px;
}

.heatmap-semantic-footer {
  border-radius: 6px;
}

.heatmap-semantic-indicator {
  font-weight: 600;
  border-radius: 4px;
}
</style>
