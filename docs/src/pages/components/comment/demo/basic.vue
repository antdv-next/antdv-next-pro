<docs lang="zh-CN">
最基础的用法：通过 `author`、`avatar`、`datetime`、`content` 展示一条评论。
</docs>

<docs lang="en-US">
The most basic usage: render a comment with `author`, `avatar`, `datetime` and `content`.
</docs>

<script setup lang="ts">
const avatar = 'https://api.dicebear.com/7.x/miniavs/svg?seed=ZhangSan'
</script>

<template>
  <a-comment
    author="Zhang San"
    :avatar="avatar"
    datetime="5 minutes ago"
    content="We supply a series of design principles, practical patterns and high quality design resources."
  />
</template>
