import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/tr_TR'

const cronLocale: CronLocale = {
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
    list: 'Liste',
  },
  any: 'Herhangi biri',
  notSpecified: 'Belirtilmedi',
  every: 'her',
  everyField: 'Her {field}',
  to: '-e',
  expression: 'Cron ifadesi',
  fieldList: 'Cron alanları',
  fieldStart: '{field} başlangıç',
  fieldInterval: '{field} aralığı',
  fieldRangeStart: '{field} aralık başlangıcı',
  fieldRangeEnd: '{field} aralık sonu',
  fieldValue: '{field} değeri',
  fieldValues: '{field} değer',
  nextRun: 'Sonraki çalıştırma: {value}',
  noFutureRun: 'Gelecekte çalıştırma yok',
  everySeconds: 'Her {value} saniyede bir',
  everyMinutes: 'Her {value} dakikada bir',
  everyDayAt: 'Her gün saat {value}\'da',
  customSchedule: 'Özel program',
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
    dayWeekQuestionMark: 'Quartz ifadesinde, ya gün alanı ya da hafta alanı ? olmalıdır, ancak ikisi birden olamaz',
    invalidExpression: 'Geçersiz cron ifadesi',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
