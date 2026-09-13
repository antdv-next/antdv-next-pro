import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/az_AZ'

const cronLocale = {
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
    special: 'Xüsusi',
  },
  notSpecified: 'Müəyyən edilməyib',
  everyField: 'Hər {field}',
  everyStep: 'Hər {step} {field} icra et',
  intervalField: ' {start} dəyərindən başla, sonra hər {step} {field} icra et',
  specifiedField: '{values}',
  rangeField: '{start} qədər {end}',
  unspecifiedDay: 'Gün təyin edilməyib; həftə sahəsinə əməl et',
  unspecifiedWeek: 'Həftə təyin edilməyib; gün sahəsinə əməl et',
  valueSeparator: ', ',
  expression: 'Cron ifadəsi',
  fieldList: 'Cron sahələri',
  fieldStart: '{field} başlanğıc',
  fieldInterval: '{field} interval',
  fieldRangeStart: '{field} diapazon başlanğıcı',
  fieldRangeEnd: '{field} aralığın sonu',
  fieldValues: '{field} dəyər',
  nextRun: 'Növbəti qaçış: {value}',
  noFutureRun: 'Gələcək qaçış yoxdur',
  specialLastDay: 'hər ayın son günü',
  specialLastWeekday: 'hər ayın son iş günü',
  specialNearestWeekday: 'hər ayın {day}-cü gününə ən yaxın iş günü',
  specialLastDayOfWeek: 'hər ayın son {week} günü',
  specialNthDayOfWeek: 'hər ayın {nth} {week} günü',
  specialLast: 'Son',
  specialNth: 'N-ci',
  nthLabels: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  },
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
    expectedUnixFields: 'Unix cron 5 sahə gözləyir',
    dayWeekQuestionMark: 'Kvars ifadəsində ya gün sahəsi, ya da həftə sahəsi ? olmalıdır, lakin hər ikisi deyil',
    unixQuestionMark: 'Unix cron sual işarəsini dəstəkləmir',
    unsupportedSpecial: 'Bu xüsusi sintaksis dəstəklənmir',
    invalidExpression: 'Yanlış cron ifadəsi',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'İstilik xəritəsi',
    less: 'Daha az',
    more: 'Daha çox',
    noData: 'Məlumat yoxdur',
    level: 'Səviyyə',
  },
  InputTag: {
    clear: 'Təmizlə',
    showMore: 'Bütün teqləri göstər',
  },
} satisfies ProLocale

export default proLocale
