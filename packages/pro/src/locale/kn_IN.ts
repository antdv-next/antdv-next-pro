import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/kn_IN'

const cronLocale = {
  fields: {
    second: 'ಎರಡನೇ',
    minute: 'ನಿಮಿಷ',
    hour: 'ಗಂಟೆ',
    day: 'ದಿನ',
    month: 'ತಿಂಗಳು',
    week: 'ವಾರ',
    year: 'ವರ್ಷ',
  },
  modes: {
    every: 'ಪ್ರತಿ',
    interval: 'ಮಧ್ಯಂತರ',
    specified: 'ನಿರ್ದಿಷ್ಟಪಡಿಸಲಾಗಿದೆ',
    range: 'ಶ್ರೇಣಿ',
    special: 'ವಿಶೇಷ',
  },
  notSpecified: 'ನಿರ್ದಿಷ್ಟಪಡಿಸಲಾಗಿಲ್ಲ',
  everyField: 'ಪ್ರತಿ {field}',
  everyStep: 'ಪ್ರತಿ {step} {field} ಚಲಾಯಿಸಿ',
  intervalField: ' {start} ರಿಂದ ಪ್ರಾರಂಭಿಸಿ, ನಂತರ ಪ್ರತಿ {step} {field} ಚಲಾಯಿಸಿ',
  specifiedField: '{values}',
  rangeField: '{start} ಗೆ {end}',
  unspecifiedDay: 'ದಿನ ನಿರ್ದಿಷ್ಟಪಡಿಸಿಲ್ಲ; ವಾರದ ಕ್ಷೇತ್ರವನ್ನು ಅನುಸರಿಸಿ',
  unspecifiedWeek: 'ವಾರ ನಿರ್ದಿಷ್ಟಪಡಿಸಿಲ್ಲ; ದಿನದ ಕ್ಷೇತ್ರವನ್ನು ಅನುಸರಿಸಿ',
  valueSeparator: ', ',
  expression: 'ಕ್ರಾನ್ ಅಭಿವ್ಯಕ್ತಿ',
  fieldList: 'ಕ್ರಾನ್ ಕ್ಷೇತ್ರಗಳು',
  fieldStart: '{field} ಆರಂಭ',
  fieldInterval: '{field} ಮಧ್ಯಂತರ',
  fieldRangeStart: '{field} ಶ್ರೇಣಿಯ ಪ್ರಾರಂಭ',
  fieldRangeEnd: '{field} ಶ್ರೇಣಿಯ ಅಂತ್ಯ',
  fieldValues: '{field} ಮೌಲ್ಯಗಳು',
  nextRun: 'ಮುಂದಿನ ಓಟ: {value}',
  noFutureRun: 'ಭವಿಷ್ಯದ ರನ್ ಇಲ್ಲ',
  specialLastDay: 'ಪ್ರತಿ ತಿಂಗಳ ಕೊನೆಯ ದಿನ',
  specialLastWeekday: 'ಪ್ರತಿ ತಿಂಗಳ ಕೊನೆಯ ಕೆಲಸದ ದಿನ',
  specialNearestWeekday: 'ಪ್ರತಿ ತಿಂಗಳ {day} ನೇ ದಿನಕ್ಕೆ ಹತ್ತಿರದ ಕೆಲಸದ ದಿನ',
  specialLastDayOfWeek: 'ಪ್ರತಿ ತಿಂಗಳ ಕೊನೆಯ {week}',
  specialNthDayOfWeek: 'ಪ್ರತಿ ತಿಂಗಳ {nth} {week}',
  specialLast: 'ಕೊನೆಯ',
  specialNth: 'nನೇ',
  nthLabels: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  },
  validation: {
    invalidStep: 'ಅಮಾನ್ಯ ಹಂತದ ಅಭಿವ್ಯಕ್ತಿ',
    stepOutOfRange: 'ಕ್ಷೇತ್ರ ವ್ಯಾಪ್ತಿಯೊಳಗೆ ಹಂತವು ಧನಾತ್ಮಕ ಮೌಲ್ಯವಾಗಿರಬೇಕು',
    invalidRange: 'ಅಮಾನ್ಯ ಶ್ರೇಣಿಯ ಅಭಿವ್ಯಕ್ತಿ',
    valueOutOfRange: 'ಮೌಲ್ಯವು {min} ಮತ್ತು {max} ನಡುವೆ ಇರಬೇಕು',
    rangeOrder: 'ಶ್ರೇಣಿಯ ಪ್ರಾರಂಭವು ಶ್ರೇಣಿಯ ಅಂತ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚಿರಬಾರದು',
    fieldRequired: 'ಫೀಲ್ಡ್ ಅಗತ್ಯವಿದೆ',
    questionMarkField: 'ಪ್ರಶ್ನೆ ಗುರುತು ದಿನ ಮತ್ತು ವಾರದ ಕ್ಷೇತ್ರಗಳಿಗೆ ಮಾತ್ರ ಬೆಂಬಲಿತವಾಗಿದೆ',
    questionMarkAlone: 'ಪ್ರಶ್ನೆ ಗುರುತು ಮಾತ್ರ ಕ್ಷೇತ್ರ ಮೌಲ್ಯವಾಗಿರಬೇಕು',
    unsupportedCharacter: 'ಕ್ಷೇತ್ರದಲ್ಲಿ ಬೆಂಬಲವಿಲ್ಲದ ಅಕ್ಷರ',
    expectedFields: 'ಆಯ್ಕೆಮಾಡಿದ ಕ್ವಾರ್ಟ್ಜ್ ಫಾರ್ಮ್ಯಾಟ್‌ಗಾಗಿ ನಿರೀಕ್ಷಿತ {count} ಕ್ಷೇತ್ರಗಳು',
    expectedUnixFields: 'Unix cron ಗೆ 5 ಕ್ಷೇತ್ರಗಳು ಬೇಕು',
    dayWeekQuestionMark: 'ಕ್ವಾರ್ಟ್ಜ್ ಅಭಿವ್ಯಕ್ತಿಯಲ್ಲಿ, ದಿನದ ಕ್ಷೇತ್ರ ಅಥವಾ ವಾರದ ಕ್ಷೇತ್ರವು ? ಆಗಿರಬೇಕು, ಆದರೆ ಎರಡೂ ಅಲ್ಲ',
    unixQuestionMark: 'Unix cron ನಲ್ಲಿ ಪ್ರಶ್ನಾರ್ಥಕ ಚಿಹ್ನೆ ಬೆಂಬಲಿತವಲ್ಲ',
    unsupportedSpecial: 'ಈ ವಿಶೇಷ ವಾಕ್ಯರಚನೆ ಬೆಂಬಲಿತವಲ್ಲ',
    invalidExpression: 'ಅಮಾನ್ಯ ಕ್ರಾನ್ ಅಭಿವ್ಯಕ್ತಿ',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'ಹೀಟ್‌ಮ್ಯಾಪ್',
    less: 'ಕಡಿಮೆ',
    more: 'ಹೆಚ್ಚು',
    noData: 'ಯಾವುದೇ ಡೇಟಾ ಇಲ್ಲ',
    level: 'ಮಟ್ಟ',
  },
  InputTag: {
    clear: 'ತೆರವುಗೊಳಿಸಿ',
    showMore: 'ಎಲ್ಲಾ ಟ್ಯಾಗ್‌ಗಳನ್ನು ತೋರಿಸಿ',
  },
} satisfies ProLocale

export default proLocale
