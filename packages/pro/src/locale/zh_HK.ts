import type { ProLocale } from './types'
import locale from 'antdv-next/locale/zh_HK'

const proLocale = {
  ...locale,
  Heatmap: {
    label: '熱力圖',
    less: '少',
    more: '多',
    noData: '無資料',
    level: '等級',
  },
} satisfies ProLocale

export default proLocale
