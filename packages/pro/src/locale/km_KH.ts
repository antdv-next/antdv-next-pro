import type { ProLocale } from './types'
import locale from 'antdv-next/locale/km_KH'
import cronLocale from '../cron/locale/km_KH'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
