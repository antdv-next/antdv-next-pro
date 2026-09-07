import type { ProLocale } from './types'
import locale from 'antdv-next/locale/en_US'
import cronLocale from '../cron/locale/en_US'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
