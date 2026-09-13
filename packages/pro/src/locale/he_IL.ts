import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/he_IL'

const cronLocale = {
  fields: {
    second: 'שניה',
    minute: 'דקה',
    hour: 'שעה',
    day: 'יום',
    month: 'חודש',
    week: 'שבוע',
    year: 'שנה',
  },
  modes: {
    every: 'כל',
    interval: 'מרווח',
    specified: 'צוין',
    range: 'טווח',
    special: 'מיוחד',
  },
  notSpecified: 'לא צוין',
  everyField: 'כל {field}',
  everyStep: 'הפעלה כל {step} דקות {field}',
  intervalField: 'התחלה ב{field} {start} ואז הפעלה כל {step} דקות',
  specifiedField: '{values}',
  rangeField: '{start} ל {end}',
  unspecifiedDay: 'היום לא צוין; יש לעקוב אחר שדה השבוע',
  unspecifiedWeek: 'השבוע לא צוין; יש לעקוב אחר שדה היום',
  valueSeparator: ', ',
  expression: 'הבעת קרון',
  fieldList: 'שדות קרון',
  fieldStart: '{field} התחל',
  fieldInterval: 'מרווח {field}',
  fieldRangeStart: '{field}',
  fieldRangeEnd: 'סוף טווח {field}',
  fieldValues: '{field} ערכים',
  nextRun: 'ההרצה הבאה: {value}',
  noFutureRun: 'אין ריצה עתידית',
  specialLastDay: 'היום האחרון בכל חודש',
  specialLastWeekday: 'יום העבודה האחרון בכל חודש',
  specialNearestWeekday: 'יום העבודה הקרוב ביותר ליום {day} בכל חודש',
  specialLastDayOfWeek: 'ה{week} האחרון בכל חודש',
  specialNthDayOfWeek: 'ה{week} ה{nth} בכל חודש',
  specialLast: 'אחרון',
  specialNth: 'ה-N',
  nthLabels: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  },
  validation: {
    invalidStep: 'ביטוי צעד לא חוקי',
    stepOutOfRange: 'שלב חייב להיות ערך חיובי בטווח השדה',
    invalidRange: 'ביטוי טווח לא חוקי',
    valueOutOfRange: 'הערך חייב להיות בין {min} ל-{max}',
    rangeOrder: 'תחילת הטווח לא יכולה להיות גדולה מסוף הטווח',
    fieldRequired: 'נדרש שדה',
    questionMarkField: 'סימן שאלה נתמך רק עבור שדות יום ושבוע',
    questionMarkAlone: 'סימן שאלה חייב להיות ערך השדה היחיד',
    unsupportedCharacter: 'תו לא נתמך בשדה',
    expectedFields: 'צפויים {count} שדות עבור פורמט הקוורץ שנבחר',
    expectedUnixFields: 'Unix cron מצפה ל-5 שדות',
    dayWeekQuestionMark: 'בביטוי קוורץ, שדה היום או שדה השבוע חייבים להיות ?, אך לא שניהם',
    unixQuestionMark: 'סימן שאלה אינו נתמך ב-Unix cron',
    unsupportedSpecial: 'תחביר מיוחד זה אינו נתמך',
    invalidExpression: 'ביטוי cron לא חוקי',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'מפת חום',
    less: 'פחות',
    more: 'יותר',
    noData: 'אין נתונים',
    level: 'רמה',
  },
  InputTag: {
    clear: 'נקה',
    showMore: 'הצג את כל התגיות',
  },
} satisfies ProLocale

export default proLocale
