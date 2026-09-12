import type { ProLocale } from './types'
import locale from 'antdv-next/locale/en_US'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Heatmap',
    less: 'Less',
    more: 'More',
    noData: 'No data',
    level: 'Level',
  },
  InputTag: {
    clear: 'Clear',
    showMore: 'Show all tags',
  },
} satisfies ProLocale

export default proLocale
