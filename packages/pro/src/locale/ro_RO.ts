import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ro_RO'
import cronLocale from '../cron/locale/ro_RO'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
