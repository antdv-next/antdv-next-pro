<docs lang="zh-CN">
最基础的用法。
</docs>

<docs lang="en-US">
The most basic usage.
</docs>

<script setup lang="ts">
const avatar = 'https://api.dicebear.com/7.x/miniavs/svg?seed=ZhangSan'
</script>

<template>
  <a-comment
    author="Zhang San"
    :avatar="avatar"
    datetime="5 minutes ago"
    content="We supply a series of design principles, practical patterns and high quality design resources, to help people and teams build their products efficiently."
  />
</template>
