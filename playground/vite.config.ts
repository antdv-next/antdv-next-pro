import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'

const baseUrl = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  resolve: {
    alias: [
      // Consume the local pro package straight from source for a fast dev loop.
      {
        find: /^@antdv-next\/pro\/scrollbar$/,
        replacement: fileURLToPath(new URL('../packages/pro/src/scrollbar/index.tsx', import.meta.url)),
      },
      {
        find: /^@antdv-next\/pro$/,
        replacement: fileURLToPath(new URL('../packages/pro/src/index.ts', import.meta.url)),
      },
      {
        find: '@',
        replacement: `${baseUrl}src`,
      },
    ],
  },
  plugins: [
    tsxResolveTypes({
      defaultPropsToUndefined: ['Boolean'],
    }),
    vueJsx(),
    vue(),
  ],
})
