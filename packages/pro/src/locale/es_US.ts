import type { ProLocale } from './types'
import locale from 'antdv-next/locale/es_US'
import sourceLocale from './es_ES'

const proLocale = {
  ...locale,
  Cron: sourceLocale.Cron,
} satisfies ProLocale

export default proLocale
