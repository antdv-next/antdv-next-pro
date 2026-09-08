import type { ProLocale } from './types'
import locale from 'antdv-next/locale/en_GB'
import sourceLocale from './en_US'

const proLocale = {
  ...locale,
  Cron: sourceLocale.Cron,
} satisfies ProLocale

export default proLocale
