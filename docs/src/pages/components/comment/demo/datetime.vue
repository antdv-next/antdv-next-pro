<docs lang="zh-CN">
`datetimePlacement` 控制时间的排布方式，`align` 控制时间在行内的对齐。
</docs>

<docs lang="en-US">
`datetimePlacement` controls how the datetime is laid out, and `align` controls its alignment within the row.
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
      content="We supply a series of design principles, practical patterns and high quality design resources."
    />
    <a-comment
      author="Zhang San"
      :avatar="avatar"
      datetime="5 minutes ago"
      content="The datetime sits at the end of the row when the author is short enough to leave room for it."
      align="end"
    />
    <a-comment
      author="Zhang San"
      :avatar="avatar"
      datetime="5 minutes ago"
      content="Switching to block placement moves the datetime onto its own line, which reads better on narrow screens."
      datetime-placement="block"
    />
    <a-comment
      author="Zhang San"
      :avatar="avatar"
      datetime="5 minutes ago"
      content="Block placement and end alignment can be combined to push the datetime to the trailing edge."
      datetime-placement="block"
      align="end"
    />
  </a-space>
</template>
