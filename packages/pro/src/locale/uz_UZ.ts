import type { ProLocale } from './types'
import locale from 'antdv-next/locale/uz_UZ'
import cronLocale from '../cron/locale/uz_UZ'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
