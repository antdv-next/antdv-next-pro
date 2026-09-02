import type { Locale as AntLocale } from 'antdv-next/locale/index'

export interface HeatmapLocale {
  label?: string
  less?: string
  more?: string
  noData?: string
  level?: string
}

export interface ProLocale extends AntLocale {
  Heatmap?: HeatmapLocale
}
