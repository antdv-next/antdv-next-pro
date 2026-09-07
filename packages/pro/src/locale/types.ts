import type { Locale as AntLocale } from 'antdv-next/locale/index'
import type { CronLocale } from '../cron/types'

export interface ProLocale extends AntLocale {
  Cron?: CronLocale
}
