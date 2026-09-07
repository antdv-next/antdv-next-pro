import type { ProLocale } from './types'
import locale from 'antdv-next/locale/fr_BE'
import cronLocale from '../cron/locale/fr_BE'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
