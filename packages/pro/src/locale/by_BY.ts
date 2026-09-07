import type { ProLocale } from './types'
import locale from 'antdv-next/locale/by_BY'
import cronLocale from '../cron/locale/by_BY'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
