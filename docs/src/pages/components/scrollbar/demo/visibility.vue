<docs lang="zh-CN">
通过 `visibility`、`visibilityX`、`visibilityY` 和 `hideDelay` 控制滚动条的显隐策略。
</docs>

<docs lang="en-US">
Control scrollbar visibility with `visibility`, `visibilityX`, `visibilityY`, and `hideDelay`.
</docs>

<script setup lang="ts">
const cards = [
  { title: 'Auto (1200ms)', visibility: 'auto', hideDelay: 1200 },
  { title: 'Always', visibility: 'always' },
  { title: 'Hidden Y', visibilityY: 'hidden', visibilityX: 'always' },
]
</script>

<template>
  <a-row :gutter="[16, 16]">
    <a-col v-for="item in cards" :key="item.title" :span="24">
      <a-card :title="item.title" size="small">
        <a-scrollbar
          style="height: 160px; border-radius: 10px; background: color-mix(in srgb, var(--ant-color-fill-tertiary), transparent 10%);"
          :visibility="item.visibility as any"
          :visibility-x="item.visibilityX as any"
          :visibility-y="item.visibilityY as any"
          :hide-delay="item.hideDelay"
        >
          <div style="min-width: 520px; padding: 12px 16px;">
            <div
              v-for="index in 8"
              :key="index"
              style="display: flex; align-items: center; justify-content: space-between; gap: 16px; min-width: 480px; padding: 10px 0; border-bottom: 1px dashed var(--ant-color-border-secondary);"
            >
              <span>Task {{ index }}</span>
              <span>Scrollable row content {{ index }}</span>
              <a-tag>{{ item.title }}</a-tag>
            </div>
          </div>
        </a-scrollbar>
      </a-card>
    </a-col>
  </a-row>
</template>
