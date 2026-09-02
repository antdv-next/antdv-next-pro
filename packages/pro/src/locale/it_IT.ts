import type { ProLocale } from './types'
import locale from 'antdv-next/locale/it_IT'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Mappa termica',
    less: 'Meno',
    more: 'Più',
    noData: 'Nessun dato',
    level: 'Livello',
  },
} satisfies ProLocale

export default proLocale
