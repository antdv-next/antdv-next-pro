import type { ProLocale } from './types'
import locale from 'antdv-next/locale/by_BY'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Цеплавая карта',
    less: 'Менш',
    more: 'Больш',
    noData: 'Няма даных',
    level: 'Узровень',
  },
} satisfies ProLocale

export default proLocale
