import type { ProLocale } from './types'
import locale from 'antdv-next/locale/mr_IN'
import cronLocale from '../cron/locale/mr_IN'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
