import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/uz_UZ'

const cronLocale: CronLocale = {
  fields: {
    second: 'soniya',
    minute: 'daqiqa',
    hour: 'Soat',
    day: 'kun',
    month: 'Oy',
    week: 'Hafta',
    year: 'Yil',
  },
  modes: {
    every: 'Har bir',
    interval: 'Interval',
    specified: 'Belgilangan',
    range: 'diapazon',
    list: 'Ro\'yxat',
  },
  any: 'Har qanday',
  notSpecified: 'Belgilanmagan',
  every: 'har',
  everyField: 'Har {field}',
  to: 'gacha',
  expression: 'Cron ifodasi',
  fieldList: 'Cron maydonlari',
  fieldStart: '{field} boshlanish',
  fieldInterval: '{field} interval',
  fieldRangeStart: '{field} diapazon boshlanishi',
  fieldRangeEnd: '{field} diapazon oxiri',
  fieldValue: '{field} qiymati',
  fieldValues: '{field} qiymat',
  nextRun: 'Keyingi yugurish: {value}',
  noFutureRun: 'Kelajakda yugurish yo\'q',
  everySeconds: 'Har {value} soniyada',
  everyMinutes: 'Har {value} daqiqada',
  everyDayAt: 'Har kuni {value} da',
  customSchedule: 'Shaxsiy jadval',
  validation: {
    invalidStep: 'Qadam ifodasi yaroqsiz',
    stepOutOfRange: 'Qadam maydon oralig\'ida ijobiy qiymat bo\'lishi kerak',
    invalidRange: 'oraliq ifodasi yaroqsiz',
    valueOutOfRange: 'Qiymat {min} va {max} orasida boʻlishi kerak',
    rangeOrder: 'Diapazon boshlanishi diapazon oxiridan katta bo‘lmasligi kerak',
    fieldRequired: 'Maydonni kiritish shart',
    questionMarkField: 'Savol belgisi faqat kun va hafta maydonlari uchun qo\'llab-quvvatlanadi',
    questionMarkAlone: 'Savol belgisi yagona maydon qiymati bo\'lishi kerak',
    unsupportedCharacter: 'Maydonda qoʻllab-quvvatlanmaydigan belgi',
    expectedFields: 'Tanlangan kvarts formati uchun kutilgan {count} ta maydon',
    dayWeekQuestionMark: 'Kvars ifodasida kun yoki hafta maydoni ? bo\'lishi kerak, lekin ikkalasi ham emas',
    invalidExpression: 'cron ifodasi yaroqsiz',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
