import type { ProLocale } from './types'
import locale from 'antdv-next/locale/pt_PT'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Mapa de calor',
    less: 'Menos',
    more: 'Mais',
    noData: 'Sem dados',
    level: 'Nível',
  },
} satisfies ProLocale

export default proLocale
