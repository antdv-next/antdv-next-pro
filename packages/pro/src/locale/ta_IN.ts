import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ta_IN'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'வெப்ப வரைபடம்',
    less: 'குறைவு',
    more: 'அதிகம்',
    noData: 'தரவு இல்லை',
    level: 'நிலை',
  },
} satisfies ProLocale

export default proLocale
