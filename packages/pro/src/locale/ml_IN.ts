import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ml_IN'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'ഹീറ്റ്‌മാപ്പ്',
    less: 'കുറവ്',
    more: 'കൂടുതൽ',
    noData: 'ഡാറ്റയില്ല',
    level: 'നില',
  },
} satisfies ProLocale

export default proLocale
