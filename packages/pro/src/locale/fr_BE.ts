import type { ProLocale } from './types'
import locale from 'antdv-next/locale/fr_BE'
import sourceLocale from './fr_FR'

const proLocale = {
  ...locale,
  Cron: sourceLocale.Cron,
} satisfies ProLocale

export default proLocale
