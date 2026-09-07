import type { ProLocale } from './types'
import locale from 'antdv-next/locale/si_LK'
import cronLocale from '../cron/locale/si_LK'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
