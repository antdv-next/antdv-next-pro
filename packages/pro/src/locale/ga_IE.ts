import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ga_IE'
import cronLocale from '../cron/locale/ga_IE'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
