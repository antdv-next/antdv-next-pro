/**
 * 为 Pro 文档站生成 Playground 链接。
 *
 * 协议与 antdv-next-playground 的 store.ts 对齐:
 * - hash 负载只含 `src/App.vue` + `_o` 选项(proEnabled: true)
 * - Playground 端根据 `?pro=1` 和 `_o.proEnabled` 自动注册 Pro 组件 & import map
 * - 编码使用 `utoa`(encodeURIComponent + btoa),与 Playground 反序列化一致
 */

function utoa(data: string): string {
  return btoa(unescape(encodeURIComponent(data)))
}
export function loadPlaygroundUrl(code: string) {
  const baseUrl = 'https://play.antdv-next.com/'

  const defaultCode = '<script setup lang="ts">\nimport { version as antdvVersion } from \'antdv-next\'\nimport { ref, version as vueVersion } from \'vue\'\n\nconst rows = Array.from({ length: 20 }, (_, i) => `Row ${i + 1}`)\n</script>\n\n<template>\n  <a-scrollbar style="height: 220px; border: 1px solid var(--ant-color-border); border-radius: 8px;">\n    <div style="padding: 12px;">\n      <p v-for="row in rows" :key="row">{{ row }}</p>\n    </div>\n  </a-scrollbar>\n\n  <p>Antdv Next {{ antdvVersion }} + Vue {{ vueVersion }}</p>\n</template>\n'

  const state: Record<string, any> = {
    'src/App.vue': code || defaultCode,
    _o: { proEnabled: true },
  }

  const hash = utoa(JSON.stringify(state))
  return `${baseUrl}?pro=1#${hash}`
}
