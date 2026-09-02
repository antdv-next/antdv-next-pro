import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ar_EG'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'خريطة حرارية',
    less: 'أقل',
    more: 'أكثر',
    noData: 'لا توجد بيانات',
    level: 'المستوى',
  },
} satisfies ProLocale

export default proLocale
