import type { ProLocale } from './types'
import locale from 'antdv-next/locale/lv_LV'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Siltuma karte',
    less: 'Mazāk',
    more: 'Vairāk',
    noData: 'Nav datu',
    level: 'Līmenis',
  },
} satisfies ProLocale

export default proLocale
