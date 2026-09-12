import type { ProLocale } from './types'
import locale from 'antdv-next/locale/mr_IN'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'हीटमॅप',
    less: 'कमी',
    more: 'जास्त',
    noData: 'डेटा नाही',
    level: 'स्तर',
  },
} satisfies ProLocale

export default proLocale
