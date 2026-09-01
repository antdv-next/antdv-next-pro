import type { ConfigProviderProps } from 'antdv-next/config-provider'
import type { CSSProperties } from 'vue'
import type { HeatmapConfig } from '../heatmap/types'
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

export interface ProConfigContextProps {
  heatmap?: HeatmapConfig
  scrollbar?: ScrollbarConfig
}

export const PRO_CONFIG_KEYS = ['heatmap', 'scrollbar'] as const satisfies readonly (keyof ProConfigContextProps)[]

export interface ProConfigProviderProps extends Omit<ConfigProviderProps, 'locale'>, ProConfigContextProps {
  locale?: ProLocale
}

export interface ProConfigProviderSlots {
  renderEmpty?: NonNullable<ConfigProviderProps['renderEmpty']>
  transformCellText?: NonNullable<ConfigProviderProps['transformCellText']>
  default?: () => any
  [key: string]: any
}

export type ProConfigProviderEmits = Record<string, any>

export type { HeatmapConfig }
