import type { ProLocale } from './types'
import locale from 'antdv-next/locale/uk_UA'
import cronLocale from '../cron/locale/uk_UA'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
