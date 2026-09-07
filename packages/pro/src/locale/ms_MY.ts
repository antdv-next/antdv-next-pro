import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ms_MY'
import cronLocale from '../cron/locale/ms_MY'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
