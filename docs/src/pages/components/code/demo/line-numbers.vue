<docs lang="zh-CN">
`showLineNumbers` 显示行号。行号对应逻辑行，不参与文本选择，也不会被复制。
</docs>

<docs lang="en-US">
`showLineNumbers` shows line numbers. They follow logical lines, cannot be selected and are never copied.
</docs>

<script setup lang="ts">
const content = `server:
  port: 8080
  host: 0.0.0.0

logging:
  level: info
  file: /var/log/app.log`
</script>

<template>
  <a-code :content="content" show-line-numbers />
</template>
