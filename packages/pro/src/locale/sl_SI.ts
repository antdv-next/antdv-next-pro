import type { ProLocale } from './types'
import locale from 'antdv-next/locale/sl_SI'
import cronLocale from '../cron/locale/sl_SI'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
