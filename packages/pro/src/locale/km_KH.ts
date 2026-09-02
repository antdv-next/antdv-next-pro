import type { ProLocale } from './types'
import locale from 'antdv-next/locale/km_KH'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'ផែនទីកំដៅ',
    less: 'តិច',
    more: 'ច្រើន',
    noData: 'គ្មានទិន្នន័យ',
    level: 'កម្រិត',
  },
} satisfies ProLocale

export default proLocale
