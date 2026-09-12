<docs lang="zh-CN">
通过 `classes` 和 `styles` 精细控制 InputTag 的语义化结构样式。
</docs>

<docs lang="en-US">
Customize semantic InputTag parts with `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { InputTagProps } from '@antdv-next/pro/input-tag'
import { theme } from 'antdv-next'

const { token } = theme.useToken()

const classes: InputTagProps['classes'] = {
  root: 'pro-input-tag-demo-root',
  content: 'pro-input-tag-demo-content',
  tag: 'pro-input-tag-demo-tag',
  input: 'pro-input-tag-demo-input',
  suffix: 'pro-input-tag-demo-suffix',
  clear: 'pro-input-tag-demo-clear',
}

const styles: InputTagProps['styles'] = info => ({
  root: {
    backgroundColor: info.props.readonly
      ? 'var(--ant-color-fill-tertiary)'
      : 'var(--ant-color-bg-container)',
  },
  content: {
    paddingInline: '4px',
  },
})
</script>

<template>
  <a-input-tag
    :default-value="['Vue', 'TypeScript']"
    default-input-value="draft"
    allow-clear
    :classes="classes"
    :styles="styles"
  />
</template>

<style>
.pro-input-tag-demo-root {
  border: 1px solid v-bind('token.colorBorder');
  box-shadow: inset 0 0 0 1px color-mix(in srgb, v-bind('token.colorPrimary'), transparent 82%);
}

.pro-input-tag-demo-content {
  background: color-mix(in srgb, v-bind('token.colorFillSecondary'), transparent 10%);
  border-radius: v-bind('token.borderRadiusSM');
}

.pro-input-tag-demo-tag {
  box-shadow: 0 0 0 1px color-mix(in srgb, v-bind('token.colorPrimary'), transparent 76%);
}

.pro-input-tag-demo-input {
  color: v-bind('token.colorPrimary');
}

.pro-input-tag-demo-suffix {
  color: v-bind('token.colorTextSecondary');
}

.pro-input-tag-demo-clear {
  color: v-bind('token.colorPrimary');
}
</style>
