import type { ProLocale } from './types'
import locale from 'antdv-next/locale/de_DE'
import cronLocale from '../cron/locale/de_DE'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
