import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/fa_IR'
import * as cronstrueFa from 'cronstrue/locales/fa.js'
import { defineCronDescriptionLocale } from '../cron/utils/description'

const cronLocale = {
  // 整句描述只带上当前语言，不再打包 cronstrue 的全部语言。
  descriptionLocale: defineCronDescriptionLocale('fa', cronstrueFa),
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
    special: 'ویژه',
  },
  notSpecified: 'مشخص نشده است',
  everyField: 'هر {field}',
  everyStep: 'هر {step} {field} اجرا شود',
  intervalField: 'از  {start} شروع شود و هر {step} {field} اجرا شود',
  specifiedField: '{values}',
  rangeField: '{start} به {end}',
  unspecifiedDay: 'روز مشخص نشده است؛ از فیلد هفته پیروی شود',
  unspecifiedWeek: 'هفته مشخص نشده است؛ از فیلد روز پیروی شود',
  valueSeparator: ', ',
  expression: 'بیان کرون',
  fieldList: 'فیلدهای کرون',
  fieldStart: 'شروع {field}',
  fieldInterval: '{field}',
  fieldRangeStart: 'شروع محدوده {field}',
  fieldRangeEnd: 'پایان محدوده {field}',
  fieldValues: '{field} مقادیر',
  nextRun: 'اجرای بعدی: {value}',
  noFutureRun: 'بدون اجرا در آینده',
  specialLastDay: 'آخرین روز هر ماه',
  specialLastWeekday: 'آخرین روز کاری هر ماه',
  specialNearestWeekday: 'نزدیک‌ترین روز کاری به روز {day} هر ماه',
  specialLastDayOfWeek: 'آخرین {week} هر ماه',
  specialNthDayOfWeek: '{nth} {week} هر ماه',
  specialLast: 'آخرین',
  specialNth: 'nام',
  nthLabels: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  },
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
    expectedUnixFields: 'Unix cron به 5 فیلد نیاز دارد',
    dayWeekQuestionMark: 'در عبارت کوارتز، یا فیلد روز یا فیلد هفته باید ? باشد، اما نه هر دو.',
    unixQuestionMark: 'علامت سؤال در Unix cron پشتیبانی نمی‌شود',
    unsupportedSpecial: 'این نحو ویژه پشتیبانی نمی‌شود',
    invalidExpression: 'عبارت cron نامعتبر است',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  CategorySearch: {
    placeholder: 'یک دسته را انتخاب یا جستجو کنید',
    clear: 'پاک کردن',
    confirm: 'تایید',
    cancel: 'لغو',
    selectAll: 'انتخاب همه',
    min: 'حداقل',
    max: 'حداکثر',
    rangeSeparator: ' ~ ',
    valueSeparator: '، ',
  },
  Code: {
    added: 'Added',
    removed: 'Removed',
  },
  Cron: cronLocale,
  Heatmap: {
    label: 'نقشه حرارتی',
    less: 'کمتر',
    more: 'بیشتر',
    noData: 'داده‌ای وجود ندارد',
    level: 'سطح',
  },
  InputTag: {
    clear: 'پاک کردن',
    showMore: 'نمایش همه برچسب‌ها',
  },
} satisfies ProLocale

export default proLocale
