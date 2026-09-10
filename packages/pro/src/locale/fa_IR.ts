import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/fa_IR'

const cronLocale: CronLocale = {
  fields: {
    second: 'دوم',
    minute: 'دقیقه',
    hour: 'ساعت',
    day: 'روز',
    month: 'ماه',
    week: 'هفته',
    year: 'سال',
  },
  modes: {
    every: 'هر',
    interval: 'فاصله',
    specified: 'مشخص شده است',
    range: 'محدوده',
    list: 'فهرست',
  },
  any: 'هر',
  notSpecified: 'مشخص نشده است',
  every: 'هر',
  everyField: 'هر {field}',
  valueSeparator: ', ',
  to: 'به',
  expression: 'بیان کرون',
  fieldList: 'فیلدهای کرون',
  fieldStart: 'شروع {field}',
  fieldInterval: '{field}',
  fieldRangeStart: 'شروع محدوده {field}',
  fieldRangeEnd: 'پایان محدوده {field}',
  fieldValue: '{field}',
  fieldValues: '{field} مقادیر',
  nextRun: 'اجرای بعدی: {value}',
  noFutureRun: 'بدون اجرا در آینده',
  everySeconds: 'هر {value} ثانیه',
  everyMinutes: 'هر {value} دقیقه',
  everyDayAt: 'هر روز در {value}',
  customSchedule: 'برنامه زمانی سفارشی',
  validation: {
    invalidStep: 'عبارت مرحله نامعتبر است',
    stepOutOfRange: 'Step باید یک مقدار مثبت در محدوده فیلد باشد',
    invalidRange: 'عبارت محدوده نامعتبر است',
    valueOutOfRange: 'مقدار باید بین {min} و {max} باشد',
    rangeOrder: 'شروع محدوده نباید بیشتر از پایان محدوده باشد',
    fieldRequired: 'فیلد الزامی است',
    questionMarkField: 'علامت سوال فقط برای فیلدهای روز و هفته پشتیبانی می شود',
    questionMarkAlone: 'علامت سوال باید تنها مقدار فیلد باشد',
    unsupportedCharacter: 'نویسه پشتیبانی نشده در فیلد',
    expectedFields: '{count} فیلد مورد انتظار برای قالب انتخابی کوارتز',
    dayWeekQuestionMark: 'در عبارت کوارتز، یا فیلد روز یا فیلد هفته باید ? باشد، اما نه هر دو.',
    invalidExpression: 'عبارت cron نامعتبر است',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
