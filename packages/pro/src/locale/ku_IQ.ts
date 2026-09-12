import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ku_IQ'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'نەخشەی گەرم',
    less: 'کەم',
    more: 'زیاتر',
    noData: 'هیچ داتا نییە',
    level: 'ئاست',
  },
} satisfies ProLocale

export default proLocale
