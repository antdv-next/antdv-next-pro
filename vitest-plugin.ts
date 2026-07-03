import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'

const baseUrl = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    tsxResolveTypes({
      defaultPropsToUndefined: ['Boolean'],
    }),
    vue(),
    vueJsx({
    }),
    {
      name: 'vue-docs-block',
      transform(_code, id) {
        if (id.includes('?vue&type=docs')) {
          return { code: 'export default {}', map: null }
        }
      },
    },
  ],
  resolve: {
    alias: [
      {
        find: /^\/@tests/,
        replacement: path.resolve(baseUrl, './tests'),
      },
      // Resolve the workspace package to source so tests (and docs demos
      // rendered by tests) don't require a prebuilt dist.
      {
        find: /^@antdv-next\/pro\/scrollbar$/,
        replacement: path.resolve(baseUrl, './packages/pro/src/scrollbar/index.tsx'),
      },
      {
        find: /^@antdv-next\/pro$/,
        replacement: path.resolve(baseUrl, './packages/pro/src/index.ts'),
      },
    ],
  },
})
