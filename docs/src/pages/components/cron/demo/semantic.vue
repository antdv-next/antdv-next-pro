<docs lang="zh-CN">
通过 `classes` 和 `styles` 精细控制 Cron 的语义化结构样式。
</docs>

<docs lang="en-US">
Customize semantic Cron parts with `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { CronProps } from '@antdv-next/pro/cron'
import { theme } from 'antdv-next'
import { ref } from 'vue'

const { token } = theme.useToken()
const value = ref('0 0 18 ? * MON,FRI')
const presets = [
  { label: 'Weekdays 18:00', value: '0 0 18 ? * MON-FRI' },
  { label: 'Every hour', value: '0 0 * * * ?' },
]

const classes: CronProps['classes'] = {
  root: 'cron-demo-root',
  input: 'cron-demo-input',
  fields: 'cron-demo-fields',
  navigation: 'cron-demo-navigation',
  editor: 'cron-demo-editor',
  presets: 'cron-demo-presets',
  preview: 'cron-demo-preview',
}

const styles: CronProps['styles'] = {
  root: {
    background: 'color-mix(in srgb, var(--ant-color-primary-bg), white 35%)',
  },
  field: {
    background: 'color-mix(in srgb, var(--ant-color-info-bg), white 25%)',
  },
}
</script>

<template>
  <a-cron
    v-model:value="value"
    preview
    :presets="presets"
    :classes="classes"
    :styles="styles"
  />
</template>

<style>
.cron-demo-root {
  border: 1px solid v-bind('token.colorPrimary');
  box-shadow: inset 0 0 0 1px color-mix(in srgb, v-bind('token.colorPrimary'), transparent 82%);
}

.cron-demo-input {
  box-shadow: 0 0 0 2px color-mix(in srgb, v-bind('token.colorPrimary'), transparent 70%);
}

.cron-demo-fields {
  background: color-mix(in srgb, v-bind('token.colorInfoBg'), white 40%);
}

.cron-demo-navigation {
  background: color-mix(in srgb, v-bind('token.colorPrimaryBg'), transparent 10%);
}

.cron-demo-editor {
  outline: 1px dashed v-bind('token.colorPrimary');
  outline-offset: -6px;
}

.cron-demo-presets {
  padding: 8px;
  border-radius: 8px;
  background: color-mix(in srgb, v-bind('token.colorSuccessBg'), white 30%);
}

.cron-demo-preview {
  border-inline-start: 4px solid v-bind('token.colorPrimary');
  background: color-mix(in srgb, v-bind('token.colorWarningBg'), white 20%);
}
</style>
