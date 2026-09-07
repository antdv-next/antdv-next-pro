import type { ProLocale } from './types'
import locale from 'antdv-next/locale/vi_VN'
import cronLocale from '../cron/locale/vi_VN'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
