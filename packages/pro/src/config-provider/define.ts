import type { ConfigProviderProps } from 'antdv-next/config-provider'
import type { ConfigProviderEmits, ConfigProviderSlots } from 'antdv-next/dist/config-provider/define'
import type { CSSProperties } from 'vue'
import type { ProLocale } from '../locale/types'

export type ScrollbarVisibility = 'auto' | 'always' | 'hidden'
export type ScrollbarMotion = 'fade' | 'slide'

export interface ScrollbarConfig {
  visibility?: ScrollbarVisibility
  visibilityX?: ScrollbarVisibility
  visibilityY?: ScrollbarVisibility
  hideDelay?: number
  motion?: ScrollbarMotion
  class?: string
  style?: CSSProperties
  classes?: Record<string, string>
  styles?: Record<string, CSSProperties>
}

export interface ProConfigProviderProps extends Omit<ConfigProviderProps, 'locale'> {
  locale?: ProLocale
  scrollbar?: ScrollbarConfig
}

export interface ProConfigProviderSlots extends ConfigProviderSlots {
  default?: () => any
}

export type ProConfigProviderEmits = ConfigProviderEmits
