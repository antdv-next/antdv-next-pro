import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ca_ES'
import cronLocale from '../cron/locale/ca_ES'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
