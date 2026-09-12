<docs lang="zh-CN">
按日期展示每日活动量。缺少条目与 `null` 值表示无数据，`0` 是有效的最低等级数据。
</docs>

<docs lang="en-US">
Display daily activity by date. Missing entries and `null` values mean no data, while `0` is a valid minimum-level value.
</docs>

<script setup lang="ts">
const day = 86400000
const today = new Date()
const end = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
const start = end - 364 * day
const data = Array.from({ length: 365 }, (_, index) => {
  if (index % 9 === 0)
    return { timestamp: start + index * day, value: null }
  if (index % 5 === 0)
    return { timestamp: start + index * day, value: 0 }
  return { timestamp: start + index * day, value: (index * 7) % 18 + 1 }
})
</script>

<template>
  <a-heatmap
    :data="data"
    :range="{ start, end }"
  />
</template>
