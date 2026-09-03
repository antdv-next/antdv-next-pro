import type { ProLocale } from './types'
import locale from 'antdv-next/locale/bg_BG'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Топлинна карта',
    less: 'По-малко',
    more: 'Повече',
    noData: 'Няма данни',
    level: 'Ниво',
  },
} satisfies ProLocale

export default proLocale
