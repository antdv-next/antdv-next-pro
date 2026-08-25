import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Unocss from 'unocss/vite'
import { defineConfig } from 'vite'
import dayjsPlugin from 'vite-plugin-dayjs'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'

import virtualAntdCss from './plugins/css-plugin'
import { mdPlugin } from './plugins/markdown'
import { postcssIsolateStyles } from './plugins/markdown/isolateStyles.ts'

const baseUrl = fileURLToPath(new URL('.', import.meta.url))
const docsBuildTarget = [
  'chrome111',
  'edge111',
  'firefox114',
  'safari16.4',
  'ios16.4',
] as const

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    virtualAntdCss({
      development: false,
    }),
    dayjsPlugin(),
    mdPlugin(),
    tsxResolveTypes({
      defaultPropsToUndefined: ['Boolean'],
    }),
    vueJsx(),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Unocss(),
    // prefetch(),
  ],
  server: {
    port: 3322,
  },
  optimizeDeps: {
    // include: ['@antdv-next/icons'],
    include: [
      '@antdv-next/icons',
      '@antdv-next/icons/all',
      '@ant-design/icons-svg/es/asn/*',
    ],
  },
  resolve: {
    alias: [
      // `antdv-next` comes from npm here; only its non-exported internals
      // need remapping onto the published `./dist/*` wildcard export.
      {
        find: /^antdv-next\/_util\//,
        replacement: 'antdv-next/dist/_util/',
      },
      {
        find: /^antdv-next\/theme\/util\//,
        replacement: 'antdv-next/dist/theme/util/',
      },
      // Consume @antdv-next/pro from workspace source for instant HMR.
      {
        find: /^@antdv-next\/pro\/scrollbar$/,
        replacement: path.resolve(baseUrl, '../packages/pro/src/scrollbar/index.tsx'),
      },
      {
        find: /^@antdv-next\/pro$/,
        replacement: path.resolve(baseUrl, '../packages/pro/src/index.ts'),
      },
      {
        find: '@',
        replacement: '/src',
      },
    ],
  },
  css: {
    postcss: {
      plugins: [
        postcssIsolateStyles(),
      ],
    },
  },
  build: {
    // Lock the docs site target to Vite's current baseline so future browser
    // version bumps do not leak unsupported targets like `chrome142` into the build.
    target: [...docsBuildTarget],
    cssTarget: [...docsBuildTarget],
    sourcemap: false,
  },
})
