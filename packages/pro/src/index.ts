import type { App, Plugin } from 'vue'
import type { ComponentToken as ScrollbarComponentToken } from './scrollbar/style'
import * as components from './components'

declare module 'antdv-next/theme/interface/components' {
  interface ComponentTokenMap {
    Scrollbar?: ScrollbarComponentToken
  }
}

export * from './components'
export { default as ProConfigProvider } from './config-provider'
export type {
  ProConfigProviderProps,
  ScrollbarConfig,
  ScrollbarMotion,
  ScrollbarVisibility,
} from './config-provider'

export default {
  install(app: App) {
    Object.keys(components).forEach((key) => {
      const component = (components as any)[key]
      if (component && 'install' in component) {
        app.use(component)
      }
    })
  },
} as Plugin
