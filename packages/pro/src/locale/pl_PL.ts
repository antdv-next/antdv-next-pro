import type { ProLocale } from './types'
import locale from 'antdv-next/locale/pl_PL'
import cronLocale from '../cron/locale/pl_PL'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
