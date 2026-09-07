import type { ProLocale } from './types'
import locale from 'antdv-next/locale/fr_FR'
import cronLocale from '../cron/locale/fr_FR'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
