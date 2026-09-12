import type { Locale as AntLocale } from 'antdv-next/locale/index'
import type { CronLocale } from '../cron/types'

export interface HeatmapLocale {
  label: string
  less: string
  more: string
  noData: string
  level: string
}

export interface ProLocale extends AntLocale {
  Cron?: CronLocale
  Heatmap?: HeatmapLocale
  InputTag?: {
    /** 清空按钮的 aria-label */
    clear?: string
    /** 折叠标签展开按钮的 aria-label */
    showMore?: string
  }
}
