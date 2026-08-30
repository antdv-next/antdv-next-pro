import type { TooltipProps } from 'antdv-next'
import type { CSSProperties } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/semantic'

export const HEATMAP_COLOR_THEMES = {
  green: ['#9be9a8', '#40c463', '#30a14e', '#216e39'],
  blue: ['#c0e7ff', '#73b3ff', '#0969da', '#0550ae'],
  orange: ['#fed7aa', '#fb923c', '#ea580c', '#c2410c'],
  purple: ['#e9d5ff', '#c084fc', '#9333ea', '#7c3aed'],
  red: ['#fecaca', '#f87171', '#dc2626', '#b91c1c'],
} as const

export type HeatmapColorTheme = keyof typeof HEATMAP_COLOR_THEMES
export type HeatmapData = HeatmapDataItem[]
export type HeatmapFirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type HeatmapSize = 'small' | 'medium' | 'large'

export interface HeatmapDataItem {
  timestamp: number
  value?: number | null
}

export interface HeatmapRange {
  start: number
  end: number
}

export interface HeatmapSemanticClassNames {
  root?: string
  content?: string
  cell?: string
  footer?: string
  indicator?: string
}

export interface HeatmapSemanticStyles {
  root?: CSSProperties
  content?: CSSProperties
  cell?: CSSProperties
  footer?: CSSProperties
  indicator?: CSSProperties
}

export interface HeatmapProps {
  prefixCls?: string
  rootClass?: string
  data?: HeatmapData
  range?: 'recent' | number | HeatmapRange
  firstDayOfWeek?: HeatmapFirstDayOfWeek
  showMonthLabels?: boolean
  showWeekLabels?: boolean
  showColorIndicator?: boolean
  fillCalendarLeading?: boolean
  size?: HeatmapSize
  xGap?: number | string
  yGap?: number | string
  colorTheme?: HeatmapColorTheme
  activeColors?: string[]
  minimumColor?: string
  tooltip?: boolean | TooltipProps
  classes?: HeatmapClassNamesType
  styles?: HeatmapStylesType
}

export type HeatmapSemanticName = keyof HeatmapSemanticClassNames & keyof HeatmapSemanticStyles
export type HeatmapClassNamesType = SemanticClassNamesType<HeatmapProps, HeatmapSemanticClassNames>
export type HeatmapStylesType = SemanticStylesType<HeatmapProps, HeatmapSemanticStyles>

export interface HeatmapTooltipSlotProps {
  timestamp: number
  value?: number | null
  date: Date
  level: number
}

export interface HeatmapSlots {
  footer?: () => any
  indicator?: () => any
  'indicator-leading-text'?: () => any
  'indicator-trailing-text'?: () => any
  tooltip?: (props: HeatmapTooltipSlotProps) => any
}

export interface HeatmapEmits {
  'cell-click': (item: HeatmapDataItem, event: MouseEvent | KeyboardEvent) => void
  [key: string]: (...args: any[]) => void
}

export interface HeatmapConfig {
  colorTheme?: HeatmapColorTheme
  activeColors?: string[]
  minimumColor?: string
  firstDayOfWeek?: HeatmapFirstDayOfWeek
  showMonthLabels?: boolean
  showWeekLabels?: boolean
  showColorIndicator?: boolean
  fillCalendarLeading?: boolean
  size?: HeatmapSize
  xGap?: number | string
  yGap?: number | string
  tooltip?: boolean | TooltipProps
  class?: string
  style?: CSSProperties
  classes?: HeatmapClassNamesType
  styles?: HeatmapStylesType
}
