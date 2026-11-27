<docs lang="zh-CN">
内置语言之外的语法通过 `createShikiCodeHighlighter` 的 `langs` 追加，`aliases` 追加别名。加载器必须是静态可分析的 `import()`，这样打包器才能按语言拆分产物。
</docs>

<docs lang="en-US">
Grammars beyond the built-in ones are added through `langs` of `createShikiCodeHighlighter`, and aliases through `aliases`. Loaders must be statically analyzable `import()` calls so bundlers can split the output per language.
</docs>

<script lang="ts">
import { createShikiCodeHighlighter } from '@antdv-next/pro/code/shiki'

const highlighter = createShikiCodeHighlighter({
  langs: {
    toml: () => import('shiki/langs/toml.mjs'),
    dockerfile: () => import('shiki/langs/dockerfile.mjs'),
  },
  aliases: {
    docker: 'dockerfile',
  },
})
</script>

<script setup lang="ts">
const toml = `[package]
name = "pro"
version = "1.1.0"

[dependencies]
serde = { version = "1.0", features = ["derive"] }`

const dockerfile = `FROM node:22-alpine
WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile
CMD ["pnpm", "start"]`
</script>

<template>
  <a-flex vertical gap="middle">
    <a-code :content="toml" language="toml" :highlighter="highlighter" />
    <a-code :content="dockerfile" language="docker" :highlighter="highlighter" />
  </a-flex>
</template>
