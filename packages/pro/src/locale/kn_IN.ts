import type { ProLocale } from './types'
import locale from 'antdv-next/locale/kn_IN'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'ಹೀಟ್‌ಮ್ಯಾಪ್',
    less: 'ಕಡಿಮೆ',
    more: 'ಹೆಚ್ಚು',
    noData: 'ಯಾವುದೇ ಡೇಟಾ ಇಲ್ಲ',
    level: 'ಮಟ್ಟ',
  },
} satisfies ProLocale

export default proLocale
