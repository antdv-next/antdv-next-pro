import type { ProLocale } from './types'
import locale from 'antdv-next/locale/sl_SI'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Toplotni zemljevid',
    less: 'Manj',
    more: 'Več',
    noData: 'Ni podatkov',
    level: 'Raven',
  },
} satisfies ProLocale

export default proLocale
