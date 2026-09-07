import type { ProLocale } from './types'
import locale from 'antdv-next/locale/id_ID'
import cronLocale from '../cron/locale/id_ID'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
