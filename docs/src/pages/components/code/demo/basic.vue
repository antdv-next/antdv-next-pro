<docs lang="zh-CN">
最基础的用法。不指定 `language` 时按纯文本展示，缩进、空行和首尾空白都会原样保留。纯文本不需要安装任何高亮库。
</docs>

<docs lang="en-US">
The most basic usage. Without `language` the content is shown as plain text; indentation, blank lines and surrounding whitespace are kept as is. Plain text needs no highlighting library.
</docs>

<script setup lang="ts">
const content = `GET /api/users?page=1&pageSize=20 HTTP/1.1
Host: example.com
Accept: application/json

{
  "total": 2,
  "list": [
    { "id": 1, "name": "Zhang San" },
    { "id": 2, "name": "Li Si" }
  ]
}`
</script>

<template>
  <a-code :content="content" />
</template>
