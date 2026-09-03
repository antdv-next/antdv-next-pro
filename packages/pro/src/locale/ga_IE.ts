import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ga_IE'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Léarscáil teasa',
    less: 'Níos lú',
    more: 'Níos mó',
    noData: 'Gan sonraí',
    level: 'Leibhéal',
  },
} satisfies ProLocale

export default proLocale
