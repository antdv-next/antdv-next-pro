import type { ProLocale } from './types'
import locale from 'antdv-next/locale/fa_IR'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'نقشه حرارتی',
    less: 'کمتر',
    more: 'بیشتر',
    noData: 'داده‌ای وجود ندارد',
    level: 'سطح',
  },
} satisfies ProLocale

export default proLocale
