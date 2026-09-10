import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/az_AZ'

const cronLocale: CronLocale = {
  fields: {
    second: 'Saniyə',
    minute: 'Dəqiqə',
    hour: 'Saat',
    day: 'Gün',
    month: 'Ay',
    week: 'Həftə',
    year: 'İl',
  },
  modes: {
    every: 'Hər',
    interval: 'Interval',
    specified: 'Müəyyən edilmişdir',
    range: 'Aralığı',
    list: 'Siyahı',
  },
  any: 'İstənilən',
  notSpecified: 'Müəyyən edilməyib',
  every: 'hər',
  everyField: 'Hər {field}',
  valueSeparator: ', ',
  to: 'qədər',
  expression: 'Cron ifadəsi',
  fieldList: 'Cron sahələri',
  fieldStart: '{field} başlanğıc',
  fieldInterval: '{field} interval',
  fieldRangeStart: '{field} diapazon başlanğıcı',
  fieldRangeEnd: '{field} aralığın sonu',
  fieldValue: '{field} dəyər',
  fieldValues: '{field} dəyər',
  nextRun: 'Növbəti qaçış: {value}',
  noFutureRun: 'Gələcək qaçış yoxdur',
  everySeconds: 'Hər {value} saniyədən bir',
  everyMinutes: 'Hər {value} dəqiqədən bir',
  everyDayAt: 'Hər gün {value} radələrində',
  customSchedule: 'Fərdi cədvəl',
  validation: {
    invalidStep: 'Yanlış addım ifadəsi',
    stepOutOfRange: 'Addım sahə diapazonunda müsbət dəyər olmalıdır',
    invalidRange: 'Yanlış sıra ifadəsi',
    valueOutOfRange: 'Dəyər {min} və {max} arasında olmalıdır',
    rangeOrder: 'Aralığın başlanğıcı diapazonun sonundan çox olmamalıdır',
    fieldRequired: 'Sahə tələb olunur',
    questionMarkField: 'Sual işarəsi yalnız gün və həftə sahələri üçün dəstəklənir',
    questionMarkAlone: 'Sual işarəsi yeganə sahə dəyəri olmalıdır',
    unsupportedCharacter: 'Sahədə dəstəklənməyən simvol',
    expectedFields: 'Seçilmiş Kvars formatı üçün gözlənilən {count} sahə',
    dayWeekQuestionMark: 'Kvars ifadəsində ya gün sahəsi, ya da həftə sahəsi ? olmalıdır, lakin hər ikisi deyil',
    invalidExpression: 'Yanlış cron ifadəsi',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
