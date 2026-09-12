import type { ProLocale } from './types'
import locale from 'antdv-next/locale/sr_RS'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Топлотна мапа',
    less: 'Мање',
    more: 'Више',
    noData: 'Нема података',
    level: 'Ниво',
  },
} satisfies ProLocale

export default proLocale
