import type { ProLocale } from './types'
import locale from 'antdv-next/locale/si_LK'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'තාප සිතියම',
    less: 'අඩු',
    more: 'වැඩි',
    noData: 'දත්ත නැත',
    level: 'මට්ටම',
  },
} satisfies ProLocale

export default proLocale
