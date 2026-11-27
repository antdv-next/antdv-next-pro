import type { ConfigProviderProps } from 'antdv-next/config-provider'
import type { CSSProperties } from 'vue'
import type { CategorySearchConfig } from '../category-search/types'
import type { CodeConfig } from '../code/types'
import type { CommentConfig } from '../comment/types'
import type { CronConfig } from '../cron/types'
import type { HeatmapConfig } from '../heatmap/types'
import type { HighlightConfig } from '../highlight/types'
import type { InputTagConfig } from '../input-tag'
import type { ProLocale } from '../locale/types'

export type ScrollbarVisibility = 'auto' | 'always' | 'hidden'
export type ScrollbarMotion = 'fade' | 'slide'
export type ScrollbarFade = 'vertical' | 'horizontal' | 'both'

export interface ScrollbarConfig {
  visibility?: ScrollbarVisibility
  visibilityX?: ScrollbarVisibility
  visibilityY?: ScrollbarVisibility
  hideDelay?: number
  motion?: ScrollbarMotion
  scrollFade?: ScrollbarFade
  scrollFadeSize?: number
  class?: string
  style?: CSSProperties
  classes?: Record<string, string>
  styles?: Record<string, CSSProperties>
}

export interface ProConfigContextProps {
  categorySearch?: CategorySearchConfig
  code?: CodeConfig
  comment?: CommentConfig
  cron?: CronConfig
  heatmap?: HeatmapConfig
  highlight?: HighlightConfig
  scrollbar?: ScrollbarConfig
  inputTag?: InputTagConfig
}

export const PRO_CONFIG_KEYS = ['categorySearch', 'code', 'comment', 'cron', 'heatmap', 'highlight', 'scrollbar', 'inputTag'] as const satisfies readonly (keyof ProConfigContextProps)[]

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

export type { CategorySearchConfig, CodeConfig, CommentConfig, CronConfig, HeatmapConfig, HighlightConfig, InputTagConfig }
