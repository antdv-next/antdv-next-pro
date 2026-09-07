import type { ProLocale } from './types'
import locale from 'antdv-next/locale/sk_SK'
import cronLocale from '../cron/locale/sk_SK'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
