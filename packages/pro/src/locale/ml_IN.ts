import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ml_IN'
import cronLocale from '../cron/locale/ml_IN'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
