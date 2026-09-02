import type { ProLocale } from './types'
import locale from 'antdv-next/locale/hy_AM'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Ջերմային քարտեզ',
    less: 'Ավելի քիչ',
    more: 'Ավելի շատ',
    noData: 'Տվյալ չկա',
    level: 'Մակարդակ',
  },
} satisfies ProLocale

export default proLocale
