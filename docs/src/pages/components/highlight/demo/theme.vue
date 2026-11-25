<docs lang="zh-CN">
默认外观和 Typography 的 `mark` 一致。通过组件 Token 可以改成主色文字、透明背景；背景透明时请保持 `highlightPaddingInline` 为 `0`，避免词内出现空隙。
</docs>

<docs lang="en-US">
The default look matches Typography `mark`. Use component tokens to switch to primary-colored text on a transparent background. Keep `highlightPaddingInline` at `0` when the background is transparent to avoid gaps inside words.
</docs>

<script setup lang="ts">
import { theme } from 'antdv-next'
import { computed } from 'vue'

const { token } = theme.useToken()

const textTheme = computed(() => ({
  components: {
    Highlight: {
      highlightBg: 'transparent',
      highlightColor: token.value.colorPrimary,
      highlightFontWeight: token.value.fontWeightStrong,
      highlightPaddingInline: 0,
    },
  },
}))
</script>

<template>
  <a-flex vertical gap="small">
    <a-highlight content="Default: antdv-next-pro" keywords="next" />
    <a-config-provider :theme="textTheme">
      <a-highlight content="Text style: antdv-next-pro" keywords="next" />
    </a-config-provider>
  </a-flex>
</template>
