import type { ProLocale } from './types'
import locale from 'antdv-next/locale/gl_ES'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Mapa de calor',
    less: 'Menos',
    more: 'Máis',
    noData: 'Sen datos',
    level: 'Nivel',
  },
} satisfies ProLocale

export default proLocale
