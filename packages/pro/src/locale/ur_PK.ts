import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ur_PK'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'حرارتی نقشہ',
    less: 'کم',
    more: 'زیادہ',
    noData: 'کوئی ڈیٹا نہیں',
    level: 'سطح',
  },
} satisfies ProLocale

export default proLocale
