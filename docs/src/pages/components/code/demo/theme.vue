<docs lang="zh-CN">
`theme` 默认是 `auto`：按组件库当前主题的 `colorBgContainer` 亮度判断明暗，跟随 `ConfigProvider` 的 `darkAlgorithm`。也可以固定为 `light` 或 `dark`。高亮器一次给出两套颜色，切换时不重新分词。
</docs>

<docs lang="en-US">
`theme` defaults to `auto`: light or dark is decided by the luminance of `colorBgContainer` of the current theme, so it follows `darkAlgorithm` of `ConfigProvider`. It can also be fixed to `light` or `dark`. The highlighter provides both color sets at once, so switching does not tokenize again.
</docs>

<script lang="ts">
import type { CodeTheme } from '@antdv-next/pro'
import { createShikiCodeHighlighter } from '@antdv-next/pro/code/shiki'
import { theme as antdTheme } from 'antdv-next'
import { computed, ref } from 'vue'

const highlighter = createShikiCodeHighlighter()
</script>

<script setup lang="ts">
const dark = ref(true)
const codeTheme = ref<CodeTheme>('auto')
const themeConfig = computed(() => ({
  algorithm: dark.value ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
}))

const content = `.button {
  /* brand color */
  color: #1677ff;
  padding: 4px 15px;
  border-radius: 6px;
}`
</script>

<template>
  <a-flex vertical gap="middle">
    <a-space wrap>
      <a-switch v-model:checked="dark" checked-children="darkAlgorithm" un-checked-children="defaultAlgorithm" />
      <a-segmented v-model:value="codeTheme" :options="['auto', 'light', 'dark']" />
    </a-space>
    <a-config-provider :theme="themeConfig">
      <div :style="{ padding: '16px', borderRadius: '8px', background: dark ? '#141414' : '#ffffff' }">
        <a-code
          :content="content"
          language="css"
          :theme="codeTheme"
          :highlighter="highlighter"
          show-line-numbers
          copyable
        />
      </div>
    </a-config-provider>
  </a-flex>
</template>
