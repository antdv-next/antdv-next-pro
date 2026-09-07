import type { ProLocale } from './types'
import locale from 'antdv-next/locale/bn_BD'
import cronLocale from '../cron/locale/bn_BD'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
