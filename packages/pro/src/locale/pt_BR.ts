import type { ProLocale } from './types'
import locale from 'antdv-next/locale/pt_BR'
import cronLocale from '../cron/locale/pt_BR'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
