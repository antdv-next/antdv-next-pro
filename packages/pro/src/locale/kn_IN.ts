import type { ProLocale } from './types'
import locale from 'antdv-next/locale/kn_IN'
import cronLocale from '../cron/locale/kn_IN'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
