import type { ProLocale } from './types'
import locale from 'antdv-next/locale/he_IL'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'מפת חום',
    less: 'פחות',
    more: 'יותר',
    noData: 'אין נתונים',
    level: 'רמה',
  },
} satisfies ProLocale

export default proLocale
