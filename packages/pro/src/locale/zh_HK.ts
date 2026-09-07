import type { ProLocale } from './types'
import locale from 'antdv-next/locale/zh_HK'
import cronLocale from '../cron/locale/zh_TW'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
