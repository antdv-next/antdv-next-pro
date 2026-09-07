import type { ProLocale } from './types'
import locale from 'antdv-next/locale/mn_MN'
import cronLocale from '../cron/locale/mn_MN'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
