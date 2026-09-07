import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ar_EG'
import cronLocale from '../cron/locale/ar_EG'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
