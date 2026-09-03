import type { ProLocale } from './types'
import locale from 'antdv-next/locale/mk_MK'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Топлинска карта',
    less: 'Помалку',
    more: 'Повеќе',
    noData: 'Нема податоци',
    level: 'Ниво',
  },
} satisfies ProLocale

export default proLocale
