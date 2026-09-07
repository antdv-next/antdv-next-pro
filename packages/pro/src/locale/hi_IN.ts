import type { ProLocale } from './types'
import locale from 'antdv-next/locale/hi_IN'
import cronLocale from '../cron/locale/hi_IN'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
