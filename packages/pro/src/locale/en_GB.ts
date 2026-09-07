import type { ProLocale } from './types'
import locale from 'antdv-next/locale/en_GB'
import cronLocale from '../cron/locale/en_GB'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
