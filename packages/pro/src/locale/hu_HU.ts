import type { ProLocale } from './types'
import locale from 'antdv-next/locale/hu_HU'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Hőtérkép',
    less: 'Kevesebb',
    more: 'Több',
    noData: 'Nincs adat',
    level: 'Szint',
  },
} satisfies ProLocale

export default proLocale
