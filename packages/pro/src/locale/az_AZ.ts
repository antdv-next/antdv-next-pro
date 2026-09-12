import type { ProLocale } from './types'
import locale from 'antdv-next/locale/az_AZ'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'İstilik xəritəsi',
    less: 'Daha az',
    more: 'Daha çox',
    noData: 'Məlumat yoxdur',
    level: 'Səviyyə',
  },
} satisfies ProLocale

export default proLocale
