import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ku_IQ'

const cronLocale = {
  fields: {
    second: 'Duyem',
    minute: 'Deqe',
    hour: 'Saet',
    day: 'Roj',
    month: 'Meh',
    week: 'Hefteyê',
    year: 'Sal',
  },
  modes: {
    every: 'Her',
    interval: 'Navber',
    specified: 'diyar kirin',
    range: 'Rêze',
    special: 'تایبەت',
  },
  notSpecified: 'Ne diyar e',
  everyField: 'Her {field}',
  everyStep: 'هەر {step} خولەک جێبەجێ بکە {field}',
  intervalField: 'لە خولەک {start} دەست پێبکە، پاشان هەر {step} خولەک جێبەجێ بکە {field}',
  specifiedField: '{values}',
  rangeField: '{start} ber {end}',
  unspecifiedDay: 'ڕۆژ دیاری نەکراوە؛ خانەی هەفتە بەکاربهێنە',
  unspecifiedWeek: 'هەفتە دیاری نەکراوە؛ خانەی ڕۆژ بەکاربهێنە',
  valueSeparator: ', ',
  expression: 'Cron îfade',
  fieldList: 'Zeviyên Cron',
  fieldStart: '{field} dest pê dike',
  fieldInterval: '{field} navber',
  fieldRangeStart: 'Rêjeya {field} dest pê dike',
  fieldRangeEnd: '{field} dawiya rêzê',
  fieldValues: '{field} nirx',
  nextRun: 'Rêvekirina Paşê: {value}',
  noFutureRun: 'Pêşeroj tune',
  specialLastDay: 'کۆتا ڕۆژی هەر مانگێک',
  specialLastWeekday: 'کۆتا ڕۆژی کارکردنی هەر مانگێک',
  specialNearestWeekday: 'نزیكترین ڕۆژی کارکردن بۆ ڕۆژی {day}ی هەر مانگێک',
  specialLastDayOfWeek: 'کۆتا {week}ی هەر مانگێک',
  specialNthDayOfWeek: '{nth} {week}ی هەر مانگێک',
  specialLast: 'کۆتا',
  specialNth: 'n-em',
  nthLabels: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  },
  validation: {
    invalidStep: 'Gotina gavê nederbasdar',
    stepOutOfRange: 'Divê gav di nav qada zeviyê de nirxek erênî be',
    invalidRange: 'Ravekirina nederbasdar',
    valueOutOfRange: 'Divê nirx di navbera {min} û {max} de be',
    rangeOrder: 'Destpêka rêzê divê ji dawiya rêzê mezintir nebe',
    fieldRequired: 'Qad pêwîst e',
    questionMarkField: 'Nîşana pirsê tenê ji bo qadên roj û hefteyê tê piştgirî kirin',
    questionMarkAlone: 'Nîşana pirsê divê tenê nirxa zeviyê be',
    unsupportedCharacter: 'Karaktera nepiştgir li zeviyê',
    expectedFields: 'Ji bo forma Quartz a hilbijartî {count} qadên çaverêkirî',
    expectedUnixFields: 'Unix cron پێویستی بە 5 خانە هەیە',
    dayWeekQuestionMark: 'Di bêjeyeke Quartz de, divê qada rojê an qada heftê ? be, lê ne her du be.',
    unixQuestionMark: 'نیشانەی پرسیار لە Unix cron پشتگیری ناکرێت',
    unsupportedSpecial: 'ئەم ڕستەسازییە تایبەتە پشتگیری ناکرێت',
    invalidExpression: 'Ravekirina kron nederbasdar',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'نەخشەی گەرم',
    less: 'کەم',
    more: 'زیاتر',
    noData: 'هیچ داتا نییە',
    level: 'ئاست',
  },
  InputTag: {
    clear: 'پاککردنەوە',
    showMore: 'هەموو تاگەکان پیشان بدە',
  },
} satisfies ProLocale

export default proLocale
