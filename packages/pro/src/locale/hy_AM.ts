import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/hy_AM'

const cronLocale = {
  fields: {
    second: 'Երկրորդ',
    minute: 'րոպե',
    hour: 'Ժամ',
    day: 'օր',
    month: 'ամիս',
    week: 'Շաբաթ',
    year: 'Տարի',
  },
  modes: {
    every: 'Ամեն',
    interval: 'ինտերվալ',
    specified: 'Նշված է',
    range: 'Շրջանակ',
    special: 'Հատուկ',
  },
  notSpecified: 'Չի նշվում',
  everyField: 'Ամեն {field}',
  everyStep: 'Կատարել յուրաքանչյուր {step} {field}',
  intervalField: 'Սկսել  {start}-ից, ապա կատարել յուրաքանչյուր {step} {field}',
  specifiedField: '{values}',
  rangeField: '{start} դեպի {end}',
  unspecifiedDay: 'Օրը նշված չէ; հետևել շաբաթվա դաշտին',
  unspecifiedWeek: 'Շաբաթը նշված չէ; հետևել օրվա դաշտին',
  valueSeparator: ', ',
  expression: 'Cron արտահայտություն',
  fieldList: 'Cron դաշտեր',
  fieldStart: '{field} սկիզբ',
  fieldInterval: '{field} ընդմիջում',
  fieldRangeStart: '{field} միջակայքի սկիզբ',
  fieldRangeEnd: '{field} ընդգրկույթի վերջ',
  fieldValues: '{field} արժեքներ',
  nextRun: 'Հաջորդ վազքը՝ {value}',
  noFutureRun: 'Ոչ մի ապագա վազք',
  specialLastDay: 'յուրաքանչյուր ամսվա վերջին օրը',
  specialLastWeekday: 'յուրաքանչյուր ամսվա վերջին աշխատանքային օրը',
  specialNearestWeekday: 'յուրաքանչյուր ամսվա {day}-րդ օրին ամենամոտ աշխատանքային օրը',
  specialLastDayOfWeek: 'յուրաքանչյուր ամսվա վերջին {week}',
  specialNthDayOfWeek: 'յուրաքանչյուր ամսվա {nth} {week}',
  specialLast: 'Վերջին',
  specialNth: 'N-րդ',
  nthLabels: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  },
  validation: {
    invalidStep: 'Անվավեր քայլ արտահայտություն',
    stepOutOfRange: 'Քայլը պետք է լինի դրական արժեք դաշտի տիրույթում',
    invalidRange: 'Անվավեր ընդգրկույթի արտահայտություն',
    valueOutOfRange: 'արժեքը պետք է լինի {min}-ից {max}-ի միջև',
    rangeOrder: 'Շրջանակի սկիզբը չպետք է մեծ լինի միջակայքի ավարտից',
    fieldRequired: 'Դաշտը պարտադիր է',
    questionMarkField: 'Հարցական նշանը աջակցվում է միայն օրվա և շաբաթվա դաշտերի համար',
    questionMarkAlone: 'Հարցական նշանը պետք է լինի դաշտի միակ արժեքը',
    unsupportedCharacter: 'Չաջակցվող նիշ դաշտում',
    expectedFields: 'Ակնկալվում է {count} դաշտ ընտրված Quartz ձևաչափի համար',
    expectedUnixFields: 'Unix cron-ը սպասում է 5 դաշտ',
    dayWeekQuestionMark: 'Քվարց արտահայտության մեջ օրվա դաշտը կամ շաբաթվա դաշտը պետք է լինի ?, բայց ոչ երկուսն էլ',
    unixQuestionMark: 'Հարցական նշանը Unix cron-ում չի աջակցվում',
    unsupportedSpecial: 'Այս հատուկ շարահյուսությունը չի աջակցվում',
    invalidExpression: 'Անվավեր cron արտահայտություն',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'Ջերմային քարտեզ',
    less: 'Ավելի քիչ',
    more: 'Ավելի շատ',
    noData: 'Տվյալ չկա',
    level: 'Մակարդակ',
  },
  InputTag: {
    clear: 'Մաքրել',
    showMore: 'Ցուցադրել բոլոր պիտակները',
  },
} satisfies ProLocale

export default proLocale
