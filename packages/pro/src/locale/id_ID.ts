import type { ProLocale } from './types'
import locale from 'antdv-next/locale/id_ID'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Peta panas',
    less: 'Lebih sedikit',
    more: 'Lebih banyak',
    noData: 'Tidak ada data',
    level: 'Tingkat',
  },
} satisfies ProLocale

export default proLocale
