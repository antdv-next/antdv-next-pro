import type { ProLocale } from './types'
import locale from 'antdv-next/locale/es_ES'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Mapa de calor',
    less: 'Menos',
    more: 'Más',
    noData: 'Sin datos',
    level: 'Nivel',
  },
} satisfies ProLocale

export default proLocale
