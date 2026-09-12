import type { ProLocale } from './types'
import locale from 'antdv-next/locale/el_GR'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Θερμικός χάρτης',
    less: 'Λιγότερα',
    more: 'Περισσότερα',
    noData: 'Δεν υπάρχουν δεδομένα',
    level: 'Επίπεδο',
  },
} satisfies ProLocale

export default proLocale
