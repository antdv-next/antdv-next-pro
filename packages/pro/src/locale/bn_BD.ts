import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/bn_BD'

const cronLocale: CronLocale = {
  fields: {
    second: 'সেকেন্ড',
    minute: 'মিনিট',
    hour: 'ঘন্টা',
    day: 'দিন',
    month: 'মাস',
    week: 'সপ্তাহ',
    year: 'বছর',
  },
  modes: {
    every: 'প্রতি',
    interval: 'ব্যবধান',
    specified: 'নির্দিষ্ট করা হয়েছে',
    range: 'পরিসর',
    list: 'তালিকা',
  },
  any: 'যেকোনো',
  notSpecified: 'নির্দিষ্ট করা নেই',
  every: 'প্রতি',
  everyField: 'প্রতি {field}',
  valueSeparator: ', ',
  to: 'থেকে',
  expression: 'ক্রোন এক্সপ্রেশন',
  fieldList: 'ক্রোন ক্ষেত্র',
  fieldStart: '{field} শুরু',
  fieldInterval: '{field} ব্যবধান',
  fieldRangeStart: '{field} পরিসর শুরু',
  fieldRangeEnd: '{field} পরিসর শেষ',
  fieldValue: '{field} মান',
  fieldValues: '{field}টি মান',
  nextRun: 'পরবর্তী রান: {value}',
  noFutureRun: 'কোন ভবিষ্যৎ রান',
  everySeconds: 'প্রতি {value} সেকেন্ডে',
  everyMinutes: 'প্রতি {value} মিনিটে',
  everyDayAt: 'প্রতিদিন {value} এ',
  customSchedule: 'কাস্টম সময়সূচী',
  validation: {
    invalidStep: 'অবৈধ পদক্ষেপ অভিব্যক্তি',
    stepOutOfRange: 'ধাপ অবশ্যই ক্ষেত্রের পরিসরের মধ্যে একটি ইতিবাচক মান হতে হবে',
    invalidRange: 'অবৈধ পরিসীমা অভিব্যক্তি',
    valueOutOfRange: 'মান অবশ্যই {min} এবং {max} এর মধ্যে হতে হবে',
    rangeOrder: 'পরিসরের শুরু অবশ্যই পরিসীমা শেষের চেয়ে বেশি হবে না',
    fieldRequired: 'ক্ষেত্র প্রয়োজন',
    questionMarkField: 'প্রশ্ন চিহ্ন শুধুমাত্র দিন এবং সপ্তাহের ক্ষেত্রের জন্য সমর্থিত',
    questionMarkAlone: 'প্রশ্ন চিহ্ন অবশ্যই একমাত্র ফিল্ড মান হতে হবে',
    unsupportedCharacter: 'ক্ষেত্রে অসমর্থিত অক্ষর',
    expectedFields: 'নির্বাচিত কোয়ার্টজ বিন্যাসের জন্য প্রত্যাশিত {count}টি ক্ষেত্র',
    dayWeekQuestionMark: 'একটি কোয়ার্টজ এক্সপ্রেশনে, দিনের ক্ষেত্র বা সপ্তাহের ক্ষেত্র অবশ্যই ? হতে হবে, তবে উভয়ই নয়',
    invalidExpression: 'অবৈধ ক্রোন এক্সপ্রেশন',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
