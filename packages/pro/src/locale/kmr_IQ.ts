import type { ProLocale } from './types'
import locale from 'antdv-next/locale/kmr_IQ'
import sourceLocale from './ku_IQ'

const proLocale = {
  ...locale,
  Cron: sourceLocale.Cron,
} satisfies ProLocale

export default proLocale
