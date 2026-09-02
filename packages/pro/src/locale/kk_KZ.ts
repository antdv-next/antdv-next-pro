import type { ProLocale } from './types'
import locale from 'antdv-next/locale/kk_KZ'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Жылу картасы',
    less: 'Аз',
    more: 'Көп',
    noData: 'Деректер жоқ',
    level: 'Деңгей',
  },
} satisfies ProLocale

export default proLocale
