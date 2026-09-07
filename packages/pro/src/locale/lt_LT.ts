import type { ProLocale } from './types'
import locale from 'antdv-next/locale/lt_LT'
import cronLocale from '../cron/locale/lt_LT'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
