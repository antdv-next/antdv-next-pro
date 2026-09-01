import type { ConfigProviderProps } from 'antdv-next/config-provider'
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

export interface InputTagConfig {
  maxCount?: number
  tokenSeparators?: string[]
  allowDuplicate?: boolean
  allowClear?: boolean
  class?: string
  style?: CSSProperties
  classes?: Record<string, string> | ((info: { props: any }) => Record<string, string>)
  styles?: Record<string, CSSProperties> | ((info: { props: any }) => Record<string, CSSProperties>)
}

export interface ProConfigContextProps {
  scrollbar?: ScrollbarConfig
  inputTag?: InputTagConfig
}

export const PRO_CONFIG_KEYS = ['scrollbar', 'inputTag'] as const satisfies readonly (keyof ProConfigContextProps)[]

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
