<docs lang="zh-CN">
语法高亮由注入的高亮器完成。安装 `shiki` 后，从 `@antdv-next/pro/code/shiki` 引入 `createShikiCodeHighlighter`，**在模块级创建一次**，再通过 `ProConfigProvider` 的 `code.highlighter` 全局注入，或者通过 `highlighter` 属性传给单个实例。语言在第一次用到时才加载，加载期间先显示纯文本。
</docs>

<docs lang="en-US">
Syntax highlighting is done by an injected highlighter. After installing `shiki`, import `createShikiCodeHighlighter` from `@antdv-next/pro/code/shiki`, **create it once at module level**, then inject it globally through `code.highlighter` of `ProConfigProvider`, or pass it to a single instance with the `highlighter` prop. A language is loaded the first time it is used; plain text is shown while loading.
</docs>

<script lang="ts">
import { createShikiCodeHighlighter } from '@antdv-next/pro/code/shiki'
import { ref } from 'vue'

// 模块级创建一次，所有实例共用。
const highlighter = createShikiCodeHighlighter()
</script>

<script setup lang="ts">
const samples: Record<string, string> = {
  ts: `interface User {
  id: number
  name: string
}

export async function fetchUser(id: number): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`)
  return response.json()
}`,
  vue: `<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
<\/script>

<template>
  <a-button type="primary" @click="count++">
    Clicked {{ count }} times
  </a-button>
</template>`,
  json: `{
  "name": "@antdv-next/pro",
  "private": false,
  "keywords": ["vue", "antdv"]
}`,
  sql: `SELECT u.id, u.name, COUNT(o.id) AS orders
FROM users AS u
LEFT JOIN orders AS o ON o.user_id = u.id
WHERE u.created_at >= '2026-01-01'
GROUP BY u.id, u.name
ORDER BY orders DESC
LIMIT 10;`,
  bash: `# install the optional peer dependency
pnpm add shiki

pnpm build && echo "done"`,
}

const language = ref('ts')
const options = Object.keys(samples)
</script>

<template>
  <ap-config-provider :code="{ highlighter }">
    <a-flex vertical gap="middle">
      <a-segmented v-model:value="language" :options="options" />
      <a-code :content="samples[language]" :language="language" show-line-numbers copyable />
    </a-flex>
  </ap-config-provider>
</template>
