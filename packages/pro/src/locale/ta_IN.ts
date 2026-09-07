import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ta_IN'
import cronLocale from '../cron/locale/ta_IN'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
