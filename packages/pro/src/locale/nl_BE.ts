import type { ProLocale } from './types'
import locale from 'antdv-next/locale/nl_BE'
import sourceLocale from './nl_NL'

const proLocale = {
  ...locale,
  Cron: sourceLocale.Cron,
} satisfies ProLocale

export default proLocale
