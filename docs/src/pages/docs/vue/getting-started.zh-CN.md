---
title: 快速上手
---

在开始之前，推荐先学习 [Vue](https://vuejs.org/)，并正确安装和配置了 [Node.js](https://nodejs.org/) v18 或以上。如果你刚开始学习 Vue，将 UI 框架作为你的第一步可能不是最好的主意。

---

## 安装 {#installation}

<InstallDependencies
  npm='$ npm i @antdv-next/pro'
  yarn='$ yarn add @antdv-next/pro'
  pnpm='$ pnpm add @antdv-next/pro'
  bun='$ bun add @antdv-next/pro'
/>

> `@antdv-next/pro` 需要 `antdv-next`（>= 1.3.0）与 `vue`（>= 3.2.0）作为 peer dependencies，请确保同时安装。

## 第一个例子 {#your-first-example}

以 [Scrollbar](/components/scrollbar-cn) 为例：内容超出容器时会按需显示自定义滚动条，支持 `auto` / `visible` / `hidden` 三种可见性模式。

### 局部引入 {#local-import}

```vue
<script setup lang="ts">
import { Scrollbar } from '@antdv-next/pro'
</script>

<template>
  <Scrollbar style="height: 260px; border: 1px solid var(--ant-color-border); border-radius: 12px;">
    <div style="min-width: 640px; padding: 16px;">
      <!-- 较长内容 -->
      <p v-for="i in 20" :key="i">Scrollable content {{ i }}</p>
    </div>
  </Scrollbar>
</template>
```

### 全局注册 {#global-registration}

在入口统一注册后，可直接使用 `<a-scrollbar>` ：

```ts
import { createApp } from 'vue'
import Pro from '@antdv-next/pro'

createApp(App).use(Pro).mount('#app')
```

## 按需加载 {#on-demand-loading}

`@antdv-next/pro` 默认支持基于 ES modules 的 tree shaking：直接 `import { Scrollbar } from '@antdv-next/pro'` 即可保证产物中只包含实际使用组件的代码，无需额外配置。

如需借助 [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components) 实现模板中的自动按需引入，可自行编写 resolver 或直接保持显式 import——两种方式都符合按需加载的预期。

## 探索更多 {#explore-more}

- 在 [组件总览](/components/overview-cn) 中浏览全部组件，每个组件页都提供了可运行演示与完整 API 文档
- 打开 [GitHub](https://github.com/antdv-next/antdv-next-pro) 仓库，贡献代码或反馈问题
