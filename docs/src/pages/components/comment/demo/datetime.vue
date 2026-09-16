<docs lang="zh-CN">
`datetimePlacement` 决定时间是否与作者同一行，`align` 决定时间在行内靠开始还是靠结束。两者都是逻辑方向，RTL 下自动镜像。
</docs>

<docs lang="en-US">
`datetimePlacement` decides whether the datetime shares the author row, and `align` decides whether it sits at the start or the end of that row. Both use logical directions and mirror automatically in RTL.
</docs>

<script setup lang="ts">
const avatar = 'https://api.dicebear.com/7.x/miniavs/svg?seed=ZhangSan'
</script>

<template>
  <a-space orientation="vertical" size="large" style="width: 100%">
    <a-comment
      author="Zhang San"
      :avatar="avatar"
      datetime="5 minutes ago"
      content="datetimePlacement: inline, align: start"
    />
    <a-comment
      author="Zhang San"
      :avatar="avatar"
      datetime="5 minutes ago"
      content="datetimePlacement: inline, align: end"
      align="end"
    />
    <a-comment
      author="Zhang San"
      :avatar="avatar"
      datetime="5 minutes ago"
      content="datetimePlacement: block, align: start"
      datetime-placement="block"
    />
    <a-comment
      author="Zhang San"
      :avatar="avatar"
      datetime="5 minutes ago"
      content="datetimePlacement: block, align: end"
      datetime-placement="block"
      align="end"
    />
  </a-space>
</template>
