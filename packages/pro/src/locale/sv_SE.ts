import type { ProLocale } from './types'
import locale from 'antdv-next/locale/sv_SE'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Värmekarta',
    less: 'Mindre',
    more: 'Mer',
    noData: 'Inga data',
    level: 'Nivå',
  },
} satisfies ProLocale

export default proLocale
