import type { ProLocale } from './types'
import locale from 'antdv-next/locale/nb_NO'
import cronLocale from '../cron/locale/nb_NO'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
