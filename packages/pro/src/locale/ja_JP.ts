import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ja_JP'
import cronLocale from '../cron/locale/ja_JP'

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
