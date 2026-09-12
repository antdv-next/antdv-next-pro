<docs lang="zh-CN">
内置主题适用于常见语义色，也可以提供完整的自定义颜色等级。
</docs>

<docs lang="en-US">
Use an included color theme or provide a complete custom color scale.
</docs>

<script setup lang="ts">
const day = 86400000
const today = new Date()
const end = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
const start = end - 364 * day
const themes = [
  { name: 'Green', colorTheme: 'green' },
  { name: 'Blue', colorTheme: 'blue' },
  { name: 'Orange', colorTheme: 'orange' },
  { name: 'Purple', colorTheme: 'purple' },
  { name: 'Red', colorTheme: 'red' },
] as const
const data = Array.from({ length: 365 }, (_, index) => {
  if (index % 13 === 0)
    return null

  return {
    timestamp: start + index * day,
    value: index % 17 === 0 ? 0 : (index * 11) % 24 + 1,
  }
}).filter(item => item !== null)
</script>

<template>
  <a-flex vertical gap="large">
    <a-flex v-for="theme in themes" :key="theme.colorTheme" vertical gap="small">
      <a-typography-title :level="5" style="margin: 0;">
        {{ theme.name }}
      </a-typography-title>
      <a-heatmap
        :data="data"
        :range="{ start, end }"
        :color-theme="theme.colorTheme"
      />
    </a-flex>
    <a-flex vertical gap="small">
      <a-typography-title :level="5" style="margin: 0;">
        Custom colors
      </a-typography-title>
      <a-heatmap
        :data="data"
        :range="{ start, end }"
        minimum-color="#fff1b8"
        :active-colors="['#ffe58f', '#ffc53d', '#fa8c16', '#d46b08']"
      />
    </a-flex>
  </a-flex>
</template>
