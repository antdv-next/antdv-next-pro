import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ko_KR'
import cronLocale from '../cron/locale/ko_KR'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
