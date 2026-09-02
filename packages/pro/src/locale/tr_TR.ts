import type { ProLocale } from './types'
import locale from 'antdv-next/locale/tr_TR'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Isı haritası',
    less: 'Daha az',
    more: 'Daha fazla',
    noData: 'Veri yok',
    level: 'Seviye',
  },
} satisfies ProLocale

export default proLocale
