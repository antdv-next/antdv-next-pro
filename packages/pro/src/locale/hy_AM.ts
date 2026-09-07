import type { ProLocale } from './types'
import locale from 'antdv-next/locale/hy_AM'
import cronLocale from '../cron/locale/hy_AM'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
