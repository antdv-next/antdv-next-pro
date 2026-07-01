<docs lang="zh-CN">
基础的双轴滚动容器。内容超出后会按需显示自定义滚动条。
</docs>

<docs lang="en-US">
Basic dual-axis scroll container. Custom scrollbars appear on demand when content overflows.
</docs>

<script setup lang="ts">
const rows = Array.from({ length: 14 }, (_, index) => ({
  key: index + 1,
  label: `Row ${index + 1}`,
  value: `Scrollable content ${index + 1}`,
}))
</script>

<template>
  <a-scrollbar style="height: 260px; border: 1px solid var(--ant-color-border); border-radius: 12px;">
    <div style="min-width: 680px; padding: 16px;">
      <a-flex justify="space-between" align="center" style="margin-bottom: 12px;">
        <a-typography-title :level="5" style="margin: 0;">
          Activity Stream
        </a-typography-title>
        <a-tag color="processing">
          14 items
        </a-tag>
      </a-flex>

      <a-flex vertical gap="small">
        <div
          v-for="item in rows"
          :key="item.key"
          style="display: grid; grid-template-columns: 120px 1fr 120px; gap: 12px; min-width: 640px; padding: 12px 14px; border-radius: 10px; background: color-mix(in srgb, var(--ant-color-fill-secondary), transparent 20%);"
        >
          <strong>{{ item.label }}</strong>
          <span>{{ item.value }}</span>
          <a-tag :color="item.key % 2 === 0 ? 'success' : 'default'">
            {{ item.key % 2 === 0 ? 'Synced' : 'Queued' }}
          </a-tag>
        </div>
      </a-flex>
    </div>
  </a-scrollbar>
</template>
