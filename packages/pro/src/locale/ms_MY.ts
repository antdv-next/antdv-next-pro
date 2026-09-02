import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ms_MY'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Peta haba',
    less: 'Kurang',
    more: 'Lebih',
    noData: 'Tiada data',
    level: 'Tahap',
  },
} satisfies ProLocale

export default proLocale
