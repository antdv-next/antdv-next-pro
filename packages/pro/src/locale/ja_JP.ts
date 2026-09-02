import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ja_JP'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'ヒートマップ',
    less: '少ない',
    more: '多い',
    noData: 'データなし',
    level: 'レベル',
  },
} satisfies ProLocale

export default proLocale
