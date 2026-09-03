import type { ProLocale } from './types'
import locale from 'antdv-next/locale/uk_UA'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Теплова карта',
    less: 'Менше',
    more: 'Більше',
    noData: 'Немає даних',
    level: 'Рівень',
  },
} satisfies ProLocale

export default proLocale
