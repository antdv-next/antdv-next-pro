import type { ThemeConfig } from 'antdv-next/config-provider/context'
import type { CSSProperties } from 'vue'
import type { HeatmapConfig } from '../heatmap/types'

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

export interface ProConfigProviderProps {
  prefixCls?: string
  iconPrefixCls?: string
  direction?: 'ltr' | 'rtl'
  theme?: ThemeConfig
  componentSize?: 'small' | 'middle' | 'large'
  componentDisabled?: boolean
  getPopupContainer?: (triggerNode?: HTMLElement) => HTMLElement
  getTargetContainer?: () => HTMLElement | Window
  csp?: { nonce?: string }
  renderEmpty?: (...args: any[]) => any
  virtual?: boolean
  popupMatchSelectWidth?: boolean
  popupOverflow?: 'viewport' | 'scroll'
  heatmap?: HeatmapConfig
  scrollbar?: ScrollbarConfig
}

export interface ProConfigProviderSlots {
  default?: () => any
}

export interface ProConfigProviderEmits {
  [key: string]: (...args: any[]) => void
}

export type { HeatmapConfig }
