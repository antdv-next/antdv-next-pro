import type { Locale as AntLocale } from 'antdv-next/locale/index'
import type { CronLocale } from '../cron/types'

export interface HeatmapLocale {
  label: string
  less: string
  more: string
  noData: string
  level: string
}

export interface InputTagLocale {
  /** 清空按钮的 aria-label */
  clear: string
  /** 折叠标签展开按钮的 aria-label */
  showMore: string
}

export interface MessageScrollerLocale {
  /** 滚动视口的 aria-label */
  viewportLabel: string
  /** 消息导航导轨的 aria-label */
  navigationLabel: string
  /** 回到最新按钮文本 */
  backToLatest: string
  /** 导轨项 aria-label 模板，支持 {index} 与 {total} 占位符 */
  railItemLabel: string
}

export interface ProLocale extends AntLocale {
  Cron?: CronLocale
  Heatmap?: HeatmapLocale
  InputTag?: InputTagLocale
  MessageScroller?: MessageScrollerLocale
}
