import type { ProLocale } from './types'
import locale from 'antdv-next/locale/is_IS'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Hitakort',
    less: 'Minna',
    more: 'Meira',
    noData: 'Engin gögn',
    level: 'Stig',
  },
} satisfies ProLocale

export default proLocale
