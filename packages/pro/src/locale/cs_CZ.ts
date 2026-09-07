import type { ProLocale } from './types'
import locale from 'antdv-next/locale/cs_CZ'
import cronLocale from '../cron/locale/cs_CZ'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
