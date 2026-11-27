<docs lang="zh-CN">
Code 只依赖 `CodeHighlighter` 接口，不绑定 Shiki。实现 `hasLanguage`、`loadLanguage`、`tokenize` 三个方法就能接入 highlight.js、Prism 或自己的分词器。下面是一个只认识 `key=value` 的最小高亮器。每行 token 的 `content` 拼起来必须等于该行源码，否则这次高亮会被放弃。
</docs>

<docs lang="en-US">
Code only depends on the `CodeHighlighter` interface and is not tied to Shiki. Implement `hasLanguage`, `loadLanguage` and `tokenize` to plug in highlight.js, Prism or your own tokenizer. Below is a minimal highlighter that only understands `key=value`. The `content` of the tokens in a line must concatenate to the source of that line, otherwise the result is discarded.
</docs>

<script lang="ts">
import type { CodeHighlighter, CodeToken } from '@antdv-next/pro'

function tokenizeLine(line: string): CodeToken[] {
  if (line.trimStart().startsWith('#'))
    return [{ content: line, color: '#6a737d', darkColor: '#8b949e', italic: true }]

  const index = line.indexOf('=')
  if (index === -1)
    return line ? [{ content: line }] : []

  return [
    { content: line.slice(0, index), color: '#005cc5', darkColor: '#79c0ff', bold: true },
    { content: '=' },
    { content: line.slice(index + 1), color: '#22863a', darkColor: '#7ee787' },
  ]
}

const envHighlighter: CodeHighlighter = {
  hasLanguage: language => language === 'env',
  loadLanguage: async language => language === 'env',
  tokenize: code => code.split('\n').map(tokenizeLine),
}
</script>

<script setup lang="ts">
const content = `# database
DB_HOST=127.0.0.1
DB_PORT=5432

# feature flags
ENABLE_CACHE=true`
</script>

<template>
  <a-code :content="content" language="env" :highlighter="envHighlighter" show-line-numbers />
</template>
