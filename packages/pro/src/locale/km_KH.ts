import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/km_KH'

const cronLocale: CronLocale = {
  fields: {
    second: 'ទីពីរ',
    minute: 'នាទី',
    hour: 'ម៉ោង',
    day: 'ថ្ងៃ',
    month: 'ខែ',
    week: 'សប្តាហ៍',
    year: 'ឆ្នាំច',
  },
  modes: {
    every: 'រៀងរាល់',
    interval: 'ចន្លោះពេល',
    specified: 'បញ្ជាក់',
    range: 'ជួរ',
    list: 'បញ្ជី',
  },
  any: 'ណាមួយ។',
  notSpecified: 'មិនបានបញ្ជាក់',
  every: 'រៀងរាល់',
  everyField: 'រៀងរាល់ {field}',
  to: 'ទៅ',
  expression: 'កន្សោម Cron',
  fieldList: 'វាល Cron',
  fieldStart: '{field} ចាប់ផ្តើម',
  fieldInterval: '{field} ចន្លោះពេល',
  fieldRangeStart: '{field} ជួរចាប់ផ្តើម',
  fieldRangeEnd: '{field} ជួរបញ្ចប់',
  fieldValue: 'តម្លៃ {field}',
  fieldValues: 'តម្លៃ {field}',
  nextRun: 'ការរត់បន្ទាប់៖ {value}',
  noFutureRun: 'គ្មានការរត់នាពេលអនាគតទេ។',
  everySeconds: 'រៀងរាល់ {value} វិនាទី',
  everyMinutes: 'រៀងរាល់ {value} នាទី',
  everyDayAt: 'រៀងរាល់ថ្ងៃនៅម៉ោង {value}',
  customSchedule: 'កាលវិភាគផ្ទាល់ខ្លួន',
  validation: {
    invalidStep: 'កន្សោមជំហានមិនត្រឹមត្រូវ',
    stepOutOfRange: 'ជំហានត្រូវតែជាតម្លៃវិជ្ជមានក្នុងជួរវាល',
    invalidRange: 'កន្សោមជួរមិនត្រឹមត្រូវ',
    valueOutOfRange: 'តម្លៃត្រូវតែនៅចន្លោះ {min} និង {max}',
    rangeOrder: 'ជួរចាប់ផ្តើមមិនត្រូវធំជាងការបញ្ចប់ជួរទេ។',
    fieldRequired: 'វាលត្រូវបានទាមទារ',
    questionMarkField: 'សញ្ញាសួរត្រូវបានគាំទ្រសម្រាប់តែវាលថ្ងៃ និងសប្តាហ៍ប៉ុណ្ណោះ។',
    questionMarkAlone: 'សញ្ញាសួរត្រូវតែជាតម្លៃវាលតែមួយគត់',
    unsupportedCharacter: 'តួអក្សរមិនគាំទ្រនៅក្នុងវាល',
    expectedFields: 'វាល {count} រំពឹងទុកសម្រាប់ទម្រង់ Quartz ដែលបានជ្រើសរើស',
    dayWeekQuestionMark: 'នៅក្នុងកន្សោម Quartz ទាំងវាលថ្ងៃ ឬវាលសប្តាហ៍ត្រូវតែ ? ប៉ុន្តែមិនមែនទាំងពីរទេ',
    invalidExpression: 'កន្សោម cron មិនត្រឹមត្រូវ',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
