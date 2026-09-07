import type { ProLocale } from './types'
import locale from 'antdv-next/locale/kk_KZ'
import cronLocale from '../cron/locale/kk_KZ'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
