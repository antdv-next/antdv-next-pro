import type { ProLocale } from './types'
import locale from 'antdv-next/locale/lt_LT'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Šilumos žemėlapis',
    less: 'Mažiau',
    more: 'Daugiau',
    noData: 'Duomenų nėra',
    level: 'Lygis',
  },
} satisfies ProLocale

export default proLocale
