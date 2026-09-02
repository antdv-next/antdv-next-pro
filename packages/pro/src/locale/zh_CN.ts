import type { ProLocale } from './types'
import locale from 'antdv-next/locale/zh_CN'

const proLocale = {
  ...locale,
  Heatmap: {
    label: '热力图',
    less: '少',
    more: '多',
    noData: '无数据',
    level: '等级',
  },
} satisfies ProLocale

export default proLocale
