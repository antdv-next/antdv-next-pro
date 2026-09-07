import type { ProLocale } from './types'
import locale from 'antdv-next/locale/gl_ES'
import cronLocale from '../cron/locale/gl_ES'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
