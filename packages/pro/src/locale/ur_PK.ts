import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ur_PK'

const cronLocale: CronLocale = {
  fields: {
    second: 'سیکنڈ',
    minute: 'منٹ',
    hour: 'گھنٹہ',
    day: 'دن',
    month: 'مہینہ',
    week: 'ہفتہ',
    year: 'سال',
  },
  modes: {
    every: 'ہر',
    interval: 'وقفہ',
    specified: 'مخصوص',
    range: 'رینج',
    list: 'فہرست',
  },
  any: 'کوئی بھی',
  notSpecified: 'متعین نہیں ہے۔',
  every: 'ہر',
  everyField: 'ہر {field}',
  to: 'سے',
  expression: 'کرون اظہار',
  fieldList: 'کرون فیلڈز',
  fieldStart: '{field} شروع',
  fieldInterval: '{field} وقفہ',
  fieldRangeStart: '{field} رینج شروع',
  fieldRangeEnd: '{field} رینج کا اختتام',
  fieldValue: '{field} قدر',
  fieldValues: '{field} اقدار',
  nextRun: 'اگلی دوڑ: {value}',
  noFutureRun: 'مستقبل میں کوئی بھاگ دوڑ نہیں۔',
  everySeconds: 'ہر {value} سیکنڈ بعد',
  everyMinutes: 'ہر {value} منٹ پر',
  everyDayAt: 'ہر روز {value} بجے',
  customSchedule: 'حسب ضرورت شیڈول',
  validation: {
    invalidStep: 'قدم کا غلط اظہار',
    stepOutOfRange: 'مرحلہ فیلڈ رینج کے اندر ایک مثبت قدر ہونا چاہیے۔',
    invalidRange: 'رینج کا غلط اظہار',
    valueOutOfRange: 'قدر {min} اور {max} کے درمیان ہونی چاہیے',
    rangeOrder: 'رینج کا آغاز رینج کے اختتام سے زیادہ نہیں ہونا چاہیے۔',
    fieldRequired: 'فیلڈ درکار ہے۔',
    questionMarkField: 'سوالیہ نشان صرف دن اور ہفتے کے شعبوں کے لیے معاون ہے۔',
    questionMarkAlone: 'سوالیہ نشان صرف فیلڈ ویلیو ہونا چاہیے۔',
    unsupportedCharacter: 'فیلڈ میں غیر تعاون یافتہ کردار',
    expectedFields: 'منتخب کوارٹز فارمیٹ کے لیے متوقع {count} فیلڈز',
    dayWeekQuestionMark: 'کوارٹز اظہار میں، یا تو دن کا میدان یا ہفتہ کا فیلڈ ? ہونا چاہیے، لیکن دونوں نہیں',
    invalidExpression: 'غلط کرون اظہار',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
