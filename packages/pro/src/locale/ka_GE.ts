import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ka_GE'
import cronLocale from '../cron/locale/ka_GE'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
