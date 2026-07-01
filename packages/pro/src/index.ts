import type { App, Plugin } from 'vue'
import * as components from './components'
import './theme/augment'

export * from './components'
export { default as ProConfigProvider } from './config-provider'
export type {
  ProConfigProviderProps,
  ScrollbarConfig,
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
