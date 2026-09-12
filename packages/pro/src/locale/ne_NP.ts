import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ne_NP'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'ताप नक्सा',
    less: 'कम',
    more: 'बढी',
    noData: 'डाटा छैन',
    level: 'स्तर',
  },
} satisfies ProLocale

export default proLocale
