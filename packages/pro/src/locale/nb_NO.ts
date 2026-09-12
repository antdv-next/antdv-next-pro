import type { ProLocale } from './types'
import locale from 'antdv-next/locale/nb_NO'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Varmekart',
    less: 'Mindre',
    more: 'Mer',
    noData: 'Ingen data',
    level: 'Nivå',
  },
} satisfies ProLocale

export default proLocale
