import type { ProLocale } from './types'
import locale from 'antdv-next/locale/cs_CZ'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Tepelná mapa',
    less: 'Méně',
    more: 'Více',
    noData: 'Žádná data',
    level: 'Úroveň',
  },
} satisfies ProLocale

export default proLocale
