<docs lang="zh-CN">
任何一步失败都回退为纯文本，内容始终可以阅读和复制：没有注入高亮器、高亮器不支持这个语言、语言加载失败，或者 Diff 里出现了非法的行前缀。`highlight` 事件给出最终结果，`error` 事件给出失败的阶段。
</docs>

<docs lang="en-US">
Any failure falls back to plain text, so the content stays readable and copyable: no highlighter is injected, the highlighter does not support the language, the language fails to load, or a diff contains an invalid line prefix. The `highlight` event reports the final result and the `error` event reports the failing stage.
</docs>

<script lang="ts">
import type { CodeErrorInfo, CodeHighlighter, CodeHighlightInfo } from '@antdv-next/pro'
import { reactive } from 'vue'

const brokenHighlighter: CodeHighlighter = {
  hasLanguage: () => false,
  loadLanguage: () => Promise.reject(new Error('Failed to fetch the grammar')),
  tokenize: () => [],
}

const emptyHighlighter: CodeHighlighter = {
  hasLanguage: () => false,
  loadLanguage: async () => false,
  tokenize: () => [],
}
</script>

<script setup lang="ts">
const content = `const answer = 42
console.log(answer)`

const invalidDiff = ` const answer = 42
console.log(answer)
+console.info(answer)`

const logs = reactive<Record<string, string>>({})

function onHighlight(key: string, info: CodeHighlightInfo) {
  logs[key] = `highlight: { language: '${info.language}', highlighted: ${info.highlighted} }`
}

function onError(key: string, info: CodeErrorInfo) {
  logs[`${key}-error`] = `error: { stage: '${info.stage}', message: '${info.error.message}' }`
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-flex vertical gap="small">
      <a-typography-text strong>
        No highlighter
      </a-typography-text>
      <a-code :content="content" language="ts" @highlight="onHighlight('none', $event)" />
      <a-typography-text type="secondary">
        {{ logs.none }}
      </a-typography-text>
    </a-flex>

    <a-flex vertical gap="small">
      <a-typography-text strong>
        Unsupported language
      </a-typography-text>
      <a-code
        :content="content"
        language="unknown"
        :highlighter="emptyHighlighter"
        @highlight="onHighlight('unsupported', $event)"
      />
      <a-typography-text type="secondary">
        {{ logs.unsupported }}
      </a-typography-text>
    </a-flex>

    <a-flex vertical gap="small">
      <a-typography-text strong>
        Failed to load
      </a-typography-text>
      <a-code
        :content="content"
        language="ts"
        :highlighter="brokenHighlighter"
        @highlight="onHighlight('load', $event)"
        @error="onError('load', $event)"
      />
      <a-typography-text type="secondary">
        {{ logs['load-error'] }}
      </a-typography-text>
    </a-flex>

    <a-flex vertical gap="small">
      <a-typography-text strong>
        Invalid diff
      </a-typography-text>
      <a-code
        :content="invalidDiff"
        diff
        show-line-numbers
        @highlight="onHighlight('diff', $event)"
        @error="onError('diff', $event)"
      />
      <a-typography-text type="secondary">
        {{ logs['diff-error'] }}
      </a-typography-text>
    </a-flex>
  </a-flex>
</template>
