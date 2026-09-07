import type { ProLocale } from './types'
import locale from 'antdv-next/locale/sv_SE'
import cronLocale from '../cron/locale/sv_SE'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
