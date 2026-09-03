---
title: Getting Started
---

Before you start, we recommend learning [Vue](https://vuejs.org/) first and having [Node.js](https://nodejs.org/) v18 or above installed. If you are new to Vue, starting with a UI framework might not be the best first step.

---

## Installation {#installation}

<InstallDependencies
  npm='$ npm i @antdv-next/pro'
  yarn='$ yarn add @antdv-next/pro'
  pnpm='$ pnpm add @antdv-next/pro'
  bun='$ bun add @antdv-next/pro'
/>

> `@antdv-next/pro` requires `antdv-next` (>= 1.3.0) and `vue` (>= 3.2.0) as peer dependencies — make sure they are installed as well.

## Your first example {#your-first-example}

Take [Scrollbar](/components/scrollbar) as an example: custom scrollbars appear on demand when content overflows, with `auto` / `visible` / `hidden` visibility modes.

### Local import {#local-import}

```vue
<script setup lang="ts">
import { Scrollbar } from '@antdv-next/pro'
</script>

<template>
  <Scrollbar style="height: 260px; border: 1px solid var(--ant-color-border); border-radius: 12px;">
    <div style="min-width: 640px; padding: 16px;">
      <!-- longer content -->
      <p v-for="i in 20" :key="i">Scrollable content {{ i }}</p>
    </div>
  </Scrollbar>
</template>
```

### Global registration {#global-registration}

Register once at the entry and use `<a-scrollbar>` directly:

```ts
import { createApp } from 'vue'
import Pro from '@antdv-next/pro'

createApp(App).use(Pro).mount('#app')
```

## On-demand loading {#on-demand-loading}

`@antdv-next/pro` supports tree shaking based on ES modules out of the box: `import { Scrollbar } from '@antdv-next/pro'` only bundles what you actually use — no extra configuration required.

If you prefer automatic on-demand imports in templates via [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components), you can write your own resolver or simply keep explicit imports — both approaches match the on-demand expectation.

## Explore more {#explore-more}

- Browse all components in the [Components Overview](/components/overview); every component page ships runnable demos and a full API reference
- Visit the [GitHub repository](https://github.com/antdv-next/antdv-next-pro) to contribute code or report issues
