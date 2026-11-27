<docs lang="zh-CN">
默认只把命中文字显示为品牌主色，不加背景，跟随 `colorPrimary` 变化。通过组件 Token `highlightColor` / `highlightBg` 可以定制文字颜色和背景色，比如主色浅底，或者和 Typography `mark` 一样的黄底。背景透明时请保持 `highlightPaddingInline` 为 `0`，避免词内出现空隙。
</docs>

<docs lang="en-US">
By default only the matched text is colored with the brand primary color, with no background, and it follows `colorPrimary`. Use the `highlightColor` / `highlightBg` component tokens to customize the text color and the background, such as a light primary background or the yellow background of Typography `mark`. Keep `highlightPaddingInline` at `0` when the background is transparent to avoid gaps inside words.
</docs>

<script setup lang="ts">
import { theme } from 'antdv-next'
import { computed } from 'vue'

const { token } = theme.useToken()

const brandTheme = { token: { colorPrimary: '#00b96b' } }

const strongTheme = computed(() => ({
  components: {
    Highlight: {
      highlightFontWeight: token.value.fontWeightStrong,
    },
  },
}))

const backgroundTheme = computed(() => ({
  components: {
    Highlight: {
      highlightBg: token.value.colorPrimaryBg,
      highlightColor: token.value.colorPrimary,
      highlightPaddingInline: token.value.paddingXXS,
    },
  },
}))

const markTheme = computed(() => ({
  components: {
    Highlight: {
      highlightBg: token.value.gold3,
      highlightColor: 'inherit',
    },
  },
}))
</script>

<template>
  <a-flex vertical gap="small">
    <a-highlight content="Default: antdv-next-pro" keywords="next" />
    <a-config-provider :theme="brandTheme">
      <a-highlight content="Follows colorPrimary: antdv-next-pro" keywords="next" />
    </a-config-provider>
    <a-config-provider :theme="strongTheme">
      <a-highlight content="Bold text: antdv-next-pro" keywords="next" />
    </a-config-provider>
    <a-config-provider :theme="backgroundTheme">
      <a-highlight content="Custom color and background: antdv-next-pro" keywords="next" />
    </a-config-provider>
    <a-config-provider :theme="markTheme">
      <a-highlight content="Mark style: antdv-next-pro" keywords="next" />
    </a-config-provider>
  </a-flex>
</template>
