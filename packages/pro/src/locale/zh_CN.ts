import type { ProLocale } from './types'
import locale from 'antdv-next/locale/zh_CN'
import cronLocale from '../cron/locale/zh_CN'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
