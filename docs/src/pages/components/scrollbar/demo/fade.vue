<docs lang="zh-CN">
滚动时在内容边缘增加渐隐提示，适合密度较高的面板或侧栏。
</docs>

<docs lang="en-US">
Add edge fade hints while scrolling. Useful for dense panels and navigation areas.
</docs>

<script setup lang="ts">
const verticalRows = Array.from({ length: 14 }, (_, index) => `Row ${index + 1}`)
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px;">
    <section>
      <h3 style="margin: 0 0 12px; font-size: 16px;" v-text="'Vertical'" />
      <a-scrollbar scroll-fade="vertical" :scroll-fade-size="72" style="height: 180px; border: 1px solid var(--ant-color-border); border-radius: 12px;">
        <div style="display: flex; flex-direction: column; gap: 16px; padding: 16px;">
          <p v-for="row in verticalRows" :key="row" style="margin: 0;">
            {{ row }}
          </p>
        </div>
      </a-scrollbar>
    </section>
  </div>
</template>
