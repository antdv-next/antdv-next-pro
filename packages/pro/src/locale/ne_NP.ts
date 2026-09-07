import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ne_NP'
import cronLocale from '../cron/locale/ne_NP'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
