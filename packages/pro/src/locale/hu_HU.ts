import type { ProLocale } from './types'
import locale from 'antdv-next/locale/hu_HU'
import cronLocale from '../cron/locale/hu_HU'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
