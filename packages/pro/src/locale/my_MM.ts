import type { ProLocale } from './types'
import locale from 'antdv-next/locale/my_MM'
import cronLocale from '../cron/locale/my_MM'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
