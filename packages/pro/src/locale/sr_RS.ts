import type { ProLocale } from './types'
import locale from 'antdv-next/locale/sr_RS'
import cronLocale from '../cron/locale/sr_RS'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
