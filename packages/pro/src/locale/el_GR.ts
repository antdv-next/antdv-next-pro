import type { ProLocale } from './types'
import locale from 'antdv-next/locale/el_GR'
import cronLocale from '../cron/locale/el_GR'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
