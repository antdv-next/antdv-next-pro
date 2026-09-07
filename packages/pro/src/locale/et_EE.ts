import type { ProLocale } from './types'
import locale from 'antdv-next/locale/et_EE'
import cronLocale from '../cron/locale/et_EE'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
