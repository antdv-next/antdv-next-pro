import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/tr_TR'

const cronLocale = {
  fields: {
    second: 'Saniye',
    minute: 'Dakika',
    hour: 'Saat',
    day: 'Gün',
    month: 'Ay',
    week: 'Hafta',
    year: 'Yıl',
  },
  modes: {
    every: 'Her',
    interval: 'Aralık',
    specified: 'Belirtildi',
    range: 'Aralık',
    special: 'Özel',
  },
  notSpecified: 'Belirtilmedi',
  everyField: 'Her {field}',
  everyStep: 'Her {step} {field} çalıştır',
  intervalField: ' {start} değerinden başla, ardından her {step} {field} çalıştır',
  specifiedField: '{values}',
  rangeField: '{start} -e {end}',
  unspecifiedDay: 'Gün belirtilmedi; hafta alanını kullan',
  unspecifiedWeek: 'Hafta belirtilmedi; gün alanını kullan',
  valueSeparator: ', ',
  expression: 'Cron ifadesi',
  fieldList: 'Cron alanları',
  fieldStart: '{field} başlangıç',
  fieldInterval: '{field} aralığı',
  fieldRangeStart: '{field} aralık başlangıcı',
  fieldRangeEnd: '{field} aralık sonu',
  fieldValues: '{field} değer',
  nextRun: 'Sonraki çalıştırma: {value}',
  noFutureRun: 'Gelecekte çalıştırma yok',
  specialLastDay: 'her ayın son günü',
  specialLastWeekday: 'her ayın son iş günü',
  specialNearestWeekday: 'her ayın {day}. gününe en yakın iş günü',
  specialLastDayOfWeek: 'her ayın son {week} günü',
  specialNthDayOfWeek: 'her ayın {nth} {week} günü',
  specialLast: 'Son',
  specialNth: 'N.',
  nthLabels: {
    1: '1.',
    2: '2.',
    3: '3.',
    4: '4.',
    5: '5.',
  },
  validation: {
    invalidStep: 'Geçersiz adım ifadesi',
    stepOutOfRange: 'Adım, alan aralığında pozitif bir değer olmalıdır',
    invalidRange: 'Geçersiz aralık ifadesi',
    valueOutOfRange: 'Değer {min} ile {max} arasında olmalıdır',
    rangeOrder: 'Aralık başlangıcı aralık sonundan büyük olmamalıdır',
    fieldRequired: 'Alan zorunludur',
    questionMarkField: 'Soru işareti yalnızca gün ve hafta alanlarında desteklenir',
    questionMarkAlone: 'Alandaki tek değer soru işareti olmalıdır',
    unsupportedCharacter: 'Alanda desteklenmeyen karakter',
    expectedFields: 'Seçilen Quartz formatı için beklenen {count} alan',
    expectedUnixFields: 'Unix cron 5 alan bekler',
    dayWeekQuestionMark: 'Quartz ifadesinde, ya gün alanı ya da hafta alanı ? olmalıdır, ancak ikisi birden olamaz',
    unixQuestionMark: 'Unix cron soru işaretini desteklemez',
    unsupportedSpecial: 'Bu özel sözdizimi desteklenmiyor',
    invalidExpression: 'Geçersiz cron ifadesi',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'Isı haritası',
    less: 'Daha az',
    more: 'Daha fazla',
    noData: 'Veri yok',
    level: 'Seviye',
  },
  InputTag: {
    clear: 'Temizle',
    showMore: 'Tüm etiketleri göster',
  },
} satisfies ProLocale

export default proLocale
