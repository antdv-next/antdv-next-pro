import type { ProLocale } from './types'
import locale from 'antdv-next/locale/de_DE'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Wärmekarte',
    less: 'Weniger',
    more: 'Mehr',
    noData: 'Keine Daten',
    level: 'Stufe',
  },
} satisfies ProLocale

export default proLocale
