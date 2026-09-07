import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ru_RU'
import cronLocale from '../cron/locale/ru_RU'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
