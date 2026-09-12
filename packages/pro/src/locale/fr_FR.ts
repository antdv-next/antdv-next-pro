import type { ProLocale } from './types'
import locale from 'antdv-next/locale/fr_FR'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Carte thermique',
    less: 'Moins',
    more: 'Plus',
    noData: 'Aucune donnée',
    level: 'Niveau',
  },
} satisfies ProLocale

export default proLocale
