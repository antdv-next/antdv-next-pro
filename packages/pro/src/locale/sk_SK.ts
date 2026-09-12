import type { ProLocale } from './types'
import locale from 'antdv-next/locale/sk_SK'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Tepelná mapa',
    less: 'Menej',
    more: 'Viac',
    noData: 'Žiadne údaje',
    level: 'Úroveň',
  },
} satisfies ProLocale

export default proLocale
