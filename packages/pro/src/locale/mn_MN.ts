import type { ProLocale } from './types'
import locale from 'antdv-next/locale/mn_MN'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Дулааны зураг',
    less: 'Бага',
    more: 'Их',
    noData: 'Өгөгдөл алга',
    level: 'Түвшин',
  },
} satisfies ProLocale

export default proLocale
