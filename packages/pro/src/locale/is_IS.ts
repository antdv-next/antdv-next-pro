import type { ProLocale } from './types'
import locale from 'antdv-next/locale/is_IS'
import cronLocale from '../cron/locale/is_IS'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
