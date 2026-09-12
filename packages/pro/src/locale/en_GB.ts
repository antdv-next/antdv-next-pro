import type { ProLocale } from './types'
import locale from 'antdv-next/locale/en_GB'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Heatmap',
    less: 'Less',
    more: 'More',
    noData: 'No data',
    level: 'Level',
  },
} satisfies ProLocale

export default proLocale
