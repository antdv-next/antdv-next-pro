import type { ProLocale } from './types'
import locale from 'antdv-next/locale/et_EE'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Kuumuskaart',
    less: 'Vähem',
    more: 'Rohkem',
    noData: 'Andmed puuduvad',
    level: 'Tase',
  },
} satisfies ProLocale

export default proLocale
