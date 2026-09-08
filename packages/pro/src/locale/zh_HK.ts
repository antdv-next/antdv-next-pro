import type { ProLocale } from './types'
import locale from 'antdv-next/locale/zh_HK'
import sourceLocale from './zh_TW'

const proLocale = {
  ...locale,
  Cron: sourceLocale.Cron,
} satisfies ProLocale

export default proLocale
