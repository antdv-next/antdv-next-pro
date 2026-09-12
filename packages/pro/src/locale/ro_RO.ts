import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ro_RO'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Hartă termică',
    less: 'Mai puțin',
    more: 'Mai mult',
    noData: 'Nu există date',
    level: 'Nivel',
  },
} satisfies ProLocale

export default proLocale
