import type { ProLocale } from './types'
import locale from 'antdv-next/locale/es_US'
import cronLocale from '../cron/locale/es_US'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
