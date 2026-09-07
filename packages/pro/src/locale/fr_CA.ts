import type { ProLocale } from './types'
import locale from 'antdv-next/locale/fr_CA'
import cronLocale from '../cron/locale/fr_CA'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
