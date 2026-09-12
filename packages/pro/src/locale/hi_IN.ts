import type { ProLocale } from './types'
import locale from 'antdv-next/locale/hi_IN'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'हीटमैप',
    less: 'कम',
    more: 'अधिक',
    noData: 'कोई डेटा नहीं',
    level: 'स्तर',
  },
} satisfies ProLocale

export default proLocale
