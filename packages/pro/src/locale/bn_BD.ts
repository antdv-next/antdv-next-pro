import type { ProLocale } from './types'
import locale from 'antdv-next/locale/bn_BD'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'হিটম্যাপ',
    less: 'কম',
    more: 'বেশি',
    noData: 'কোনও ডেটা নেই',
    level: 'স্তর',
  },
} satisfies ProLocale

export default proLocale
