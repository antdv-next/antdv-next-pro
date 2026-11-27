<docs lang="zh-CN">
`keywords` 直接接受 `RegExp`，按正则自身的 flags 匹配，可以和字符串关键词混用。字符串关键词始终按字面量匹配。
</docs>

<docs lang="en-US">
`keywords` accepts a `RegExp` directly, matched with its own flags, and can be mixed with strings. String keywords are always matched literally.
</docs>

<script setup lang="ts">
const logs = [
  '[10:00:01] INFO  service started',
  '[10:00:05] WARN  cache miss rate 32%',
  '[10:00:09] ERROR request /api/user timed out',
]

const keywords = [/\b(?:ERROR|WARN)\b/g, /\/api\/\S+/, 'timed out']
</script>

<template>
  <a-flex vertical gap="small">
    <a-highlight v-for="log in logs" :key="log" :content="log" :keywords="keywords" />
  </a-flex>
</template>
