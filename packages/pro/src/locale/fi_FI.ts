import type { ProLocale } from './types'
import locale from 'antdv-next/locale/fi_FI'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Lämpökartta',
    less: 'Vähemmän',
    more: 'Enemmän',
    noData: 'Ei tietoja',
    level: 'Taso',
  },
} satisfies ProLocale

export default proLocale
