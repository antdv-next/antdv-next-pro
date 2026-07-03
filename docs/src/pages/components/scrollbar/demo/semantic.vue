<docs lang="zh-CN">
通过 `classes` 和 `styles` 精细控制滚动条的语义化结构样式。
</docs>

<docs lang="en-US">
Customize semantic scrollbar parts with `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { ScrollbarProps } from '@antdv-next/pro/scrollbar'
import { theme } from 'antdv-next'

const { token } = theme.useToken()

const classes: ScrollbarProps['classes'] = {
  root: 'pro-scrollbar-demo-root',
  track: 'pro-scrollbar-demo-track',
  thumb: 'pro-scrollbar-demo-thumb',
}

const styles: ScrollbarProps['styles'] = info => ({
  root: {
    backgroundColor: info.props.visibilityY === 'always'
      ? 'color-mix(in srgb, var(--ant-color-info-bg), white 30%)'
      : 'var(--ant-color-bg-container)',
  },
  container: {
    paddingInlineEnd: '8px',
  },
})
</script>

<template>
  <a-scrollbar
    visibility-y="always"
    style="height: 220px; border-radius: 14px;"
    :classes="classes"
    :styles="styles"
  >
    <div style="padding: 16px;">
      <a-flex vertical gap="small">
        <a-card v-for="index in 6" :key="index" size="small">
          Semantic block {{ index }}
        </a-card>
      </a-flex>
    </div>
  </a-scrollbar>
</template>

<style>
.pro-scrollbar-demo-root {
  border: 1px solid v-bind('token.colorBorder');
  box-shadow: inset 0 0 0 1px color-mix(in srgb, v-bind('token.colorPrimary'), transparent 82%);
}

.pro-scrollbar-demo-track {
  background: color-mix(in srgb, v-bind('token.colorFillSecondary'), transparent 10%);
}

.pro-scrollbar-demo-thumb {
  background: linear-gradient(180deg, v-bind('token.colorPrimary'), v-bind('token.colorPrimaryHover'));
}
</style>
