import type { ProLocale } from './types'
import locale from 'antdv-next/locale/eu_ES'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Bero mapa',
    less: 'Gutxiago',
    more: 'Gehiago',
    noData: 'Daturik ez',
    level: 'Maila',
  },
} satisfies ProLocale

export default proLocale
