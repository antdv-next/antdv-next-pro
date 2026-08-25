<docs lang="zh-CN">
通过 `motion` 切换滚动条轨道的显隐动画。移出滚动区域，等待自动隐藏后再移入即可观察效果。
</docs>

<docs lang="en-US">
Switch scrollbar track visibility motion with `motion`. Move the pointer out of the scroll area, wait for it to hide, then move it back in to observe the effect.
</docs>

<script setup lang="ts">
const motions = [
  {
    title: 'Slide',
    motion: 'slide',
    description: 'Slides in from the right and out to the right.',
  },
  {
    title: 'Fade',
    motion: 'fade',
    description: 'Fades in and out without movement.',
  },
] as const

const rows = Array.from({ length: 12 }, (_, index) => `Scrollable item ${index + 1}`)
</script>

<template>
  <a-row :gutter="[16, 16]">
    <a-col v-for="item in motions" :key="item.motion" :xs="24" :md="12">
      <a-card :title="item.title" size="small">
        <a-typography-paragraph type="secondary" style="min-height: 44px; margin-bottom: 12px;">
          {{ item.description }}
        </a-typography-paragraph>

        <a-scrollbar
          :motion="item.motion"
          :hide-delay="800"
          style="height: 220px; border-radius: 10px; background: color-mix(in srgb, var(--ant-color-fill-tertiary), transparent 10%);"
        >
          <div style="padding: 12px 16px;">
            <div
              v-for="row in rows"
              :key="row"
              style="padding: 10px 0; border-bottom: 1px dashed var(--ant-color-border-secondary);"
            >
              {{ row }}
            </div>
          </div>
        </a-scrollbar>
      </a-card>
    </a-col>
  </a-row>
</template>
