import type { ProLocale } from './types'
import locale from 'antdv-next/locale/nl_BE'
import cronLocale from '../cron/locale/nl_BE'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
