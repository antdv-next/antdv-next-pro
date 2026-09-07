import type { ProLocale } from './types'
import locale from 'antdv-next/locale/az_AZ'
import cronLocale from '../cron/locale/az_AZ'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
