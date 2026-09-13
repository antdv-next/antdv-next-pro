import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/mk_MK'

const cronLocale = {
  fields: {
    second: 'Втора',
    minute: 'Минута',
    hour: 'Час',
    day: 'Ден',
    month: 'Месец',
    week: 'Недела',
    year: 'Година',
  },
  modes: {
    every: 'Секој',
    interval: 'Интервал',
    specified: 'Наведено',
    range: 'Опсег',
    special: 'Специјално',
  },
  notSpecified: 'Не е одредено',
  everyField: 'секој {field}',
  everyStep: 'Извршувај на секои {step} минути {field}',
  intervalField: 'Почни од {field} {start} и извршувај на секои {step} минути',
  specifiedField: '{values}',
  rangeField: '{start} до {end}',
  unspecifiedDay: 'Денот не е одреден; следи го полето за недела',
  unspecifiedWeek: 'Неделата не е одредена; следи го полето за ден',
  valueSeparator: ', ',
  expression: 'Крон израз',
  fieldList: 'Cron полиња',
  fieldStart: '{field} почеток',
  fieldInterval: '{field} интервал',
  fieldRangeStart: 'почеток на опсегот {field}',
  fieldRangeEnd: 'крај на опсегот {field}',
  fieldValues: '{field} вредности',
  nextRun: 'Следно возење: {value}',
  noFutureRun: 'Нема идно трчање',
  specialLastDay: 'последниот ден од секој месец',
  specialLastWeekday: 'последниот работен ден од секој месец',
  specialNearestWeekday: 'најблискиот работен ден до {day}. ден од секој месец',
  specialLastDayOfWeek: 'последниот {week} од секој месец',
  specialNthDayOfWeek: '{nth} {week} од секој месец',
  specialLast: 'Последен',
  specialNth: 'N-ти',
  nthLabels: {
    1: '1.',
    2: '2.',
    3: '3.',
    4: '4.',
    5: '5.',
  },
  validation: {
    invalidStep: 'Неважечки чекор израз',
    stepOutOfRange: 'Чекорот мора да биде позитивна вредност во опсегот на полето',
    invalidRange: 'Неважечки израз на опсег',
    valueOutOfRange: 'Вредноста мора да биде помеѓу {min} и {max}',
    rangeOrder: 'Почетокот на опсегот не смее да биде поголем од крајот на опсегот',
    fieldRequired: 'Полето е потребно',
    questionMarkField: 'Прашалникот е поддржан само за дневни и седмични полиња',
    questionMarkAlone: 'Прашалникот мора да биде единствената вредност на полето',
    unsupportedCharacter: 'Неподдржан знак во полето',
    expectedFields: 'Очекувани {count} полиња за избраниот формат Кварц',
    expectedUnixFields: 'Unix cron очекува 5 полиња',
    dayWeekQuestionMark: 'Во кварцниот израз, или полето дневно или седмичното поле мора да биде ?, но не и двете',
    unixQuestionMark: 'Прашалникот не е поддржан во Unix cron',
    unsupportedSpecial: 'Оваа специјална синтакса не е поддржана',
    invalidExpression: 'Неважечки cron израз',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'Топлинска карта',
    less: 'Помалку',
    more: 'Повеќе',
    noData: 'Нема податоци',
    level: 'Ниво',
  },
  InputTag: {
    clear: 'Исчисти',
    showMore: 'Прикажи ги сите ознаки',
  },
} satisfies ProLocale

export default proLocale
