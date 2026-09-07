import type { ProLocale } from './types'
import locale from 'antdv-next/locale/es_ES'
import cronLocale from '../cron/locale/es_ES'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
