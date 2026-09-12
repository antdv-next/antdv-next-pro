import type { ProLocale } from './types'
import locale from 'antdv-next/locale/nl_NL'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Warmtekaart',
    less: 'Minder',
    more: 'Meer',
    noData: 'Geen gegevens',
    level: 'Niveau',
  },
} satisfies ProLocale

export default proLocale
