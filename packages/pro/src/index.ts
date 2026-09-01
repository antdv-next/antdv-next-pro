import type { App, Plugin } from 'vue'
import type { ComponentToken as InputTagComponentToken } from './input-tag/style'
import type { ComponentToken as ScrollbarComponentToken } from './scrollbar/style'
import * as components from './components'

declare module 'antdv-next/theme/interface/components' {
  interface ComponentTokenMap {
    Scrollbar?: ScrollbarComponentToken
    InputTag?: InputTagComponentToken
  }
}

export * from './components'
export { default as ProConfigProvider } from './config-provider'
export type {
  InputTagConfig,
  ProConfigProviderProps,
  ScrollbarConfig,
  ScrollbarMotion,
  ScrollbarVisibility,
} from './config-provider'
export type {
  InputTagClassNamesType,
  InputTagEmits,
  InputTagInputProps,
  InputTagProps,
  InputTagRef,
  InputTagSemanticClassNames,
  InputTagSemanticName,
  InputTagSemanticStyles,
  InputTagStylesType,
  InputTagTagProps,
  InputTagValue,
} from './input-tag'

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
