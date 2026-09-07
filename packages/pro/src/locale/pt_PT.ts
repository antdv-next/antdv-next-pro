import type { ProLocale } from './types'
import locale from 'antdv-next/locale/pt_PT'
import cronLocale from '../cron/locale/pt_PT'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
