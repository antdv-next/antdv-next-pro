import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ku_IQ'
import cronLocale from '../cron/locale/ku_IQ'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
