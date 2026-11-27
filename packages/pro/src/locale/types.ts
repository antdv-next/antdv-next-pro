import type { Locale as AntLocale } from 'antdv-next/locale/index'
import type { CronLocale } from '../cron/types'

export interface CodeLocale {
  /** Diff 新增行的读屏文本 */
  added: string
  /** Diff 删除行的读屏文本 */
  removed: string
}

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

export interface CategorySearchLocale {
  /** 默认占位文字 */
  placeholder: string
  /** 清空按钮的 aria-label */
  clear: string
  /** 值面板的确定按钮 */
  confirm: string
  /** 值面板的取消按钮 */
  cancel: string
  /** 多选面板的全选 */
  selectAll: string
  /** 数字区间的最小值占位 */
  min: string
  /** 数字区间的最大值占位 */
  max: string
  /** 区间两端之间的分隔符 */
  rangeSeparator: string
  /** 多个值之间的分隔符 */
  valueSeparator: string
}

export interface ProLocale extends AntLocale {
  CategorySearch?: CategorySearchLocale
  Code?: CodeLocale
  Cron?: CronLocale
  Heatmap?: HeatmapLocale
  InputTag?: InputTagLocale
}
