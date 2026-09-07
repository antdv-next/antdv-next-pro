import type { ProLocale } from './types'
import locale from 'antdv-next/locale/fa_IR'
import cronLocale from '../cron/locale/fa_IR'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
