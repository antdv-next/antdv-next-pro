<docs lang="zh-CN">
默认不换行，超出部分横向滚动。开启 `wordWrap` 后长行自动换行，行号仍然对应逻辑行。
</docs>

<docs lang="en-US">
Lines do not wrap by default and overflow scrolls horizontally. With `wordWrap` long lines wrap, while line numbers still follow logical lines.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const wordWrap = ref(true)
const content = `{
  "description": "We supply a series of design principles, practical patterns and high quality design resources, to help people create their product prototypes beautifully and efficiently.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ",
  "retries": 3
}`
</script>

<template>
  <a-flex vertical gap="middle">
    <a-switch
      v-model:checked="wordWrap"
      checked-children="wordWrap"
      un-checked-children="wordWrap"
      style="align-self: flex-start"
    />
    <a-code :content="content" :word-wrap="wordWrap" show-line-numbers />
  </a-flex>
</template>
