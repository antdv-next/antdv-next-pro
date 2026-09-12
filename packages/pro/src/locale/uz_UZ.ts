import type { ProLocale } from './types'
import locale from 'antdv-next/locale/uz_UZ'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Issiqlik xaritasi',
    less: 'Kam',
    more: 'Ko‘p',
    noData: 'Maʼlumot yo‘q',
    level: 'Daraja',
  },
} satisfies ProLocale

export default proLocale
