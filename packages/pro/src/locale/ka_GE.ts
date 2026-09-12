import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ka_GE'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'სითბოს რუკა',
    less: 'ნაკლები',
    more: 'მეტი',
    noData: 'მონაცემები არ არის',
    level: 'დონე',
  },
} satisfies ProLocale

export default proLocale
