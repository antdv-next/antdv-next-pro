import type { ProLocale } from './types'
import locale from 'antdv-next/locale/kmr_IQ'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Nexşeya germê',
    less: 'Kêm',
    more: 'Zêde',
    noData: 'Daneyên tune',
    level: 'Ast',
  },
} satisfies ProLocale

export default proLocale
