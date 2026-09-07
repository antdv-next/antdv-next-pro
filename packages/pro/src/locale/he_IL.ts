import type { ProLocale } from './types'
import locale from 'antdv-next/locale/he_IL'
import cronLocale from '../cron/locale/he_IL'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
