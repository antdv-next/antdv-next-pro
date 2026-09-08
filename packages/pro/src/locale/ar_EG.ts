import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ar_EG'

const cronLocale: CronLocale = {
  fields: {
    second: 'الثانية',
    minute: 'الدقيقة',
    hour: 'الساعة',
    day: 'يوم',
    month: 'الشهر',
    week: 'الأسبوع',
    year: 'السنة',
  },
  modes: {
    every: 'كل',
    interval: 'الفاصل الزمني',
    specified: 'محدد',
    range: 'المدى',
    list: 'القائمة',
  },
  any: 'أي',
  notSpecified: 'غير محدد',
  every: 'كل',
  everyField: 'كل {field}',
  to: 'إلى',
  expression: 'تعبير كرون',
  fieldList: 'حقول كرون',
  fieldStart: '{field} البداية',
  fieldInterval: '{field} فاصل زمني',
  fieldRangeStart: '{field} بداية النطاق',
  fieldRangeEnd: '{field} نهاية النطاق',
  fieldValue: 'قيمة {field}.',
  fieldValues: '{field} قيم',
  nextRun: 'الجولة التالية: {value}',
  noFutureRun: 'لا يوجد تشغيل مستقبلي',
  everySeconds: 'كل {value} ثانية',
  everyMinutes: 'كل {value} دقيقة',
  everyDayAt: 'كل يوم في {value}',
  customSchedule: 'جدول مخصص',
  validation: {
    invalidStep: 'تعبير خطوة غير صالح',
    stepOutOfRange: 'يجب أن تكون الخطوة قيمة موجبة ضمن نطاق الحقل',
    invalidRange: 'تعبير نطاق غير صالح',
    valueOutOfRange: 'يجب أن تتراوح القيمة بين {min} و{max}',
    rangeOrder: 'يجب ألا تكون بداية النطاق أكبر من نهاية النطاق',
    fieldRequired: 'الحقل مطلوب',
    questionMarkField: 'علامة الاستفهام مدعومة فقط لحقول اليوم والأسبوع',
    questionMarkAlone: 'يجب أن تكون علامة الاستفهام هي قيمة الحقل الوحيدة',
    unsupportedCharacter: 'حرف غير مدعوم في الحقل',
    expectedFields: 'الحقول {count} المتوقعة لتنسيق الكوارتز المحدد',
    dayWeekQuestionMark: 'في تعبير الكوارتز، يجب أن يكون حقل اليوم أو حقل الأسبوع ?، ولكن ليس كليهما.',
    invalidExpression: 'تعبير cron غير صالح',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
