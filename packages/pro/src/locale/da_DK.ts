import type { ProLocale } from './types'
import locale from 'antdv-next/locale/da_DK'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Varmekort',
    less: 'Mindre',
    more: 'Mere',
    noData: 'Ingen data',
    level: 'Niveau',
  },
} satisfies ProLocale

export default proLocale
