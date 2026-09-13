import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/bn_BD'

const cronLocale = {
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
    special: 'বিশেষ',
  },
  notSpecified: 'নির্দিষ্ট করা নেই',
  everyField: 'প্রতি {field}',
  everyStep: 'প্রতি {step} {field} চালান',
  intervalField: ' {start} থেকে শুরু করুন, তারপর প্রতি {step} {field} চালান',
  specifiedField: '{values}',
  rangeField: '{start} থেকে {end}',
  unspecifiedDay: 'দিন নির্দিষ্ট নয়; সপ্তাহ ক্ষেত্র অনুসরণ করুন',
  unspecifiedWeek: 'সপ্তাহ নির্দিষ্ট নয়; দিন ক্ষেত্র অনুসরণ করুন',
  valueSeparator: ', ',
  expression: 'ক্রোন এক্সপ্রেশন',
  fieldList: 'ক্রোন ক্ষেত্র',
  fieldStart: '{field} শুরু',
  fieldInterval: '{field} ব্যবধান',
  fieldRangeStart: '{field} পরিসর শুরু',
  fieldRangeEnd: '{field} পরিসর শেষ',
  fieldValues: '{field}টি মান',
  nextRun: 'পরবর্তী রান: {value}',
  noFutureRun: 'কোন ভবিষ্যৎ রান',
  specialLastDay: 'প্রতি মাসের শেষ দিন',
  specialLastWeekday: 'প্রতি মাসের শেষ কর্মদিবস',
  specialNearestWeekday: 'প্রতি মাসের {day} তারিখের নিকটতম কর্মদিবস',
  specialLastDayOfWeek: 'প্রতি মাসের শেষ {week}',
  specialNthDayOfWeek: 'প্রতি মাসের {nth} {week}',
  specialLast: 'শেষ',
  specialNth: 'n-তম',
  nthLabels: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  },
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
    expectedUnixFields: 'Unix cron-এ 5টি ক্ষেত্র প্রয়োজন',
    dayWeekQuestionMark: 'একটি কোয়ার্টজ এক্সপ্রেশনে, দিনের ক্ষেত্র বা সপ্তাহের ক্ষেত্র অবশ্যই ? হতে হবে, তবে উভয়ই নয়',
    unixQuestionMark: 'Unix cron-এ প্রশ্নবোধক চিহ্ন সমর্থিত নয়',
    unsupportedSpecial: 'এই বিশেষ সিনট্যাক্স সমর্থিত নয়',
    invalidExpression: 'অবৈধ ক্রোন এক্সপ্রেশন',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'হিটম্যাপ',
    less: 'কম',
    more: 'বেশি',
    noData: 'কোনও ডেটা নেই',
    level: 'স্তর',
  },
  InputTag: {
    clear: 'মুছুন',
    showMore: 'সব ট্যাগ দেখান',
  },
} satisfies ProLocale

export default proLocale
