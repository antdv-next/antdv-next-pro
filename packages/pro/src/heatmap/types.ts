import type { TooltipProps } from 'antdv-next'
import type { CSSProperties } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/semantic'

/**
 * 内置颜色主题，对应 Ant Design 的预设色板（`green` / `blue` / ...）。
 * 具体色值在样式里从全局 Token（如 `green3`）取，跟随主题算法与暗色模式。
 */
export const HEATMAP_COLOR_THEMES = ['green', 'blue', 'orange', 'purple', 'red'] as const

export const HEATMAP_ACTIVE_COLOR_COUNT = 4
export type HeatmapColorTheme = (typeof HEATMAP_COLOR_THEMES)[number]
/**
 * 日期归一使用的时区。
 *
 * - `UTC`：按 UTC 日期归一，服务端聚合好的「UTC 零点」时间戳用它
 * - `local`：按浏览器本地时区归一，`new Date(2024, 0, 1).getTime()` 这类本地时间戳用它
 */
export type HeatmapTimeZone = 'UTC' | 'local'
export type HeatmapColorScale = readonly [string, string, string, string]
export type HeatmapData = HeatmapDataItem[]
export type HeatmapFirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6
export type HeatmapSize = 'small' | 'medium' | 'large'

export interface HeatmapDataItem {
  timestamp: number
  value?: number | null
}

export function isHeatmapColorScale(value: unknown): value is HeatmapColorScale {
  return Array.isArray(value)
    && value.length === HEATMAP_ACTIVE_COLOR_COUNT
    && value.every(color => typeof color === 'string' && color.trim())
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
  /**
   * 展示范围。`'recent'` 为截至今天的最近 365 天；数字表示公历年份（如 `2024`）；
   * 也可以传 `{ start, end }` 时间戳。
   * @default 'recent'
   */
  range?: 'recent' | number | HeatmapRange
  /**
   * `data` / `range` 中的时间戳按哪个时区归一到日期，同时决定 `range="recent"` 的「今天」。
   * @default 'UTC'
   */
  timeZone?: HeatmapTimeZone
  firstDayOfWeek?: HeatmapFirstDayOfWeek
  showMonthLabels?: boolean
  showWeekLabels?: boolean
  showColorIndicator?: boolean
  fillCalendarLeading?: boolean
  size?: HeatmapSize
  xGap?: number | string
  yGap?: number | string
  colorTheme?: HeatmapColorTheme
  activeColors?: HeatmapColorScale
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
  indicatorLeadingText?: () => any
  indicatorTrailingText?: () => any
  tooltip?: (props: HeatmapTooltipSlotProps) => any
}

export interface HeatmapEmits {
  cellClick: (item: HeatmapDataItem, event: MouseEvent) => void
  [key: string]: (...args: any[]) => void
}

export interface HeatmapConfig {
  colorTheme?: HeatmapColorTheme
  activeColors?: HeatmapColorScale
  minimumColor?: string
  timeZone?: HeatmapTimeZone
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
