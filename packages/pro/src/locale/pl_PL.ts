import type { ProLocale } from './types'
import locale from 'antdv-next/locale/pl_PL'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Mapa cieplna',
    less: 'Mniej',
    more: 'Więcej',
    noData: 'Brak danych',
    level: 'Poziom',
  },
} satisfies ProLocale

export default proLocale
