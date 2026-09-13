import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/en_GB'

const cronLocale = {
  fields: {
    second: 'Second',
    minute: 'Minute',
    hour: 'Hour',
    day: 'Day',
    month: 'Month',
    week: 'Week',
    year: 'Year',
  },
  modes: {
    every: 'Every',
    interval: 'Interval',
    specified: 'Specified',
    range: 'Range',
    special: 'Special',
  },
  notSpecified: 'Not specified',
  everyField: 'Every {field}',
  everyStep: 'Every {step} {field}',
  intervalField: 'From {start}, every {step} {field}',
  specifiedField: '{values}',
  rangeField: '{start} to {end}',
  unspecifiedDay: 'Day not specified; follow the week field',
  unspecifiedWeek: 'Week not specified; follow the day field',
  valueSeparator: ', ',
  expression: 'Cron expression',
  fieldList: 'Cron fields',
  fieldStart: '{field} start',
  fieldInterval: '{field} interval',
  fieldRangeStart: '{field} range start',
  fieldRangeEnd: '{field} range end',
  fieldValues: '{field} values',
  nextRun: 'Next run: {value}',
  noFutureRun: 'No future run',
  specialLastDay: 'the last day of each month',
  specialLastWeekday: 'the last weekday of each month',
  specialNearestWeekday: 'the nearest weekday to day {day} of each month',
  specialLastDayOfWeek: 'the last {week} of each month',
  specialNthDayOfWeek: 'the {nth} {week} of each month',
  specialLast: 'Last',
  specialNth: 'Nth',
  nthLabels: {
    1: '1st',
    2: '2nd',
    3: '3rd',
    4: '4th',
    5: '5th',
  },
  validation: {
    invalidStep: 'Invalid step expression',
    stepOutOfRange: 'Step must be a positive value within the field range',
    invalidRange: 'Invalid range expression',
    valueOutOfRange: 'Value must be between {min} and {max}',
    rangeOrder: 'Range start must not be greater than range end',
    fieldRequired: 'Field is required',
    questionMarkField: 'Question mark is only supported for day and week fields',
    questionMarkAlone: 'Question mark must be the only field value',
    unsupportedCharacter: 'Unsupported character in field',
    expectedFields: 'Expected {count} fields for the selected Quartz format',
    expectedUnixFields: 'Expected 5 fields for Unix cron',
    dayWeekQuestionMark: 'Exactly one of day and week must be ? in a Quartz expression',
    unixQuestionMark: 'Question mark is not supported in Unix cron',
    unsupportedSpecial: 'This special syntax is not supported',
    invalidExpression: 'Invalid cron expression',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'Heatmap',
    less: 'Less',
    more: 'More',
    noData: 'No data',
    level: 'Level',
  },
  InputTag: {
    clear: 'Clear',
    showMore: 'Show all tags',
  },
} satisfies ProLocale

export default proLocale
