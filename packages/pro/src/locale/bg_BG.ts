import type { ProLocale } from './types'
import locale from 'antdv-next/locale/bg_BG'
import cronLocale from '../cron/locale/bg_BG'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
