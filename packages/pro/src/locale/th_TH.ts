import type { ProLocale } from './types'
import locale from 'antdv-next/locale/th_TH'
import cronLocale from '../cron/locale/th_TH'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
