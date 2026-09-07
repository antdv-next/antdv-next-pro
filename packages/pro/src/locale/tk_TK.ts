import type { ProLocale } from './types'
import locale from 'antdv-next/locale/tk_TK'
import cronLocale from '../cron/locale/tk_TK'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
