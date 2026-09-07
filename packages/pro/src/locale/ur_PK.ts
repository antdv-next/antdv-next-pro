import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ur_PK'
import cronLocale from '../cron/locale/ur_PK'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
