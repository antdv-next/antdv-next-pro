import type { ProLocale } from './types'
import locale from 'antdv-next/locale/tk_TK'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Ýylylyk kartasy',
    less: 'Az',
    more: 'Köp',
    noData: 'Maglumat ýok',
    level: 'Dereje',
  },
} satisfies ProLocale

export default proLocale
