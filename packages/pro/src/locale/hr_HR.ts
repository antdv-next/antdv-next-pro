import type { ProLocale } from './types'
import locale from 'antdv-next/locale/hr_HR'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Toplinska karta',
    less: 'Manje',
    more: 'Više',
    noData: 'Nema podataka',
    level: 'Razina',
  },
} satisfies ProLocale

export default proLocale
