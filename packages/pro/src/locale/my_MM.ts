import type { ProLocale } from './types'
import locale from 'antdv-next/locale/my_MM'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'အပူမြေပုံ',
    less: 'လျော့',
    more: 'ပို',
    noData: 'ဒေတာမရှိ',
    level: 'အဆင့်',
  },
} satisfies ProLocale

export default proLocale
