import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ca_ES'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Mapa de calor',
    less: 'Menys',
    more: 'Més',
    noData: 'Sense dades',
    level: 'Nivell',
  },
} satisfies ProLocale

export default proLocale
