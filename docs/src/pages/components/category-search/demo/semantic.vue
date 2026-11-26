<docs lang="zh-CN">
通过 `classes` 和 `styles` 定制语义化节点，`popup` 下的节点作用于浮层。
</docs>

<docs lang="en-US">
Customize semantic parts with `classes` and `styles`; nodes under `popup` apply to the popup.
</docs>

<script setup lang="ts">
import type { CategorySearchOption, CategorySearchProps } from '@antdv-next/pro/category-search'
import { theme } from 'antdv-next'

const { token } = theme.useToken()

const options: CategorySearchOption[] = [
  {
    label: 'Status',
    value: 'status',
    children: [
      { label: 'Online', value: 'online' },
      { label: 'Offline', value: 'offline' },
    ],
  },
  { label: 'Host', value: 'host', type: 'input' },
]

const classes: CategorySearchProps['classes'] = {
  root: 'pro-category-search-demo-root',
  tag: 'pro-category-search-demo-tag',
  popup: {
    list: 'pro-category-search-demo-list',
  },
}

const styles: CategorySearchProps['styles'] = info => ({
  content: {
    paddingInlineStart: info.props.value?.length ? '4px' : 0,
  },
  popup: {
    panel: { minWidth: '280px' },
  },
})
</script>

<template>
  <a-category-search
    :options="options"
    :default-value="[{ key: 'status', value: 'online' }]"
    :classes="classes"
    :styles="styles"
  />
</template>

<style>
.pro-category-search-demo-root .ant-input-affix-wrapper {
  box-shadow: inset 0 0 0 1px color-mix(in srgb, v-bind('token.colorPrimary'), transparent 70%);
}

.pro-category-search-demo-tag {
  border-color: v-bind('token.colorPrimaryBorder');
  background: v-bind('token.colorPrimaryBg');
}

.pro-category-search-demo-list {
  border-inline-start: 2px solid v-bind('token.colorPrimary');
}
</style>
