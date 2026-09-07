import type { ProLocale } from './types'
import locale from 'antdv-next/locale/nl_NL'
import cronLocale from '../cron/locale/nl_NL'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
