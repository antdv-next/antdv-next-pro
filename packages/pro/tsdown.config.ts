import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'tsdown'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'

export default defineConfig({
  entry: [
    'src/index.ts',
  ],
  plugins: [
    tsxResolveTypes({
      defaultPropsToUndefined: ['Boolean'],
    }),
    vueJsx(),
    vue(),
  ],
  dts: true,
  format: 'esm',
  unbundle: true,
  clean: true,
  deps: {
    skipNodeModulesBundle: true,
    neverBundle: [
      'vue',
      'antdv-next',
      'antdv-next/config-provider',
      'antdv-next/config-provider/context',
      'antdv-next/config-provider/DisabledContext',
      'antdv-next/config-provider/hooks/useSize',
      'antdv-next/config-provider/hooks/useCSSVarCls',
      'antdv-next/theme/internal',
      '@antdv-next/cssinjs',
      '@antdv-next/cssinjs/cssinjs-utils',
    ],
  },
  outExtensions() {
    return {
      js: '.js',
      dts: '.d.ts',
    }
  },
})
