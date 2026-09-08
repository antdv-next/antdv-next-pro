import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/by_BY'

const cronLocale: CronLocale = {
  fields: {
    second: 'секунда',
    minute: 'хвіліна',
    hour: 'гадзіна',
    day: 'Дзень',
    month: 'месяц',
    week: 'тыдзень',
    year: 'год',
  },
  modes: {
    every: 'Кожны',
    interval: 'Інтэрвал',
    specified: 'Указаны',
    range: 'Дыяпазон',
    list: 'Спіс',
  },
  any: 'Любы',
  notSpecified: 'Не ўказана',
  every: 'кожны',
  everyField: 'кожны {field}',
  to: 'да',
  expression: 'Выраз Cron',
  fieldList: 'Палі Cron',
  fieldStart: '{field} пачатак',
  fieldInterval: '{field} інтэрвал',
  fieldRangeStart: '{field} пачатак дыяпазону',
  fieldRangeEnd: '{field} канец дыяпазону',
  fieldValue: '{field} значэнне',
  fieldValues: '{field} значэння',
  nextRun: 'Наступны запуск: {value}',
  noFutureRun: 'Няма будучыні',
  everySeconds: 'Кожныя {value} секунд',
  everyMinutes: 'Кожныя {value} хвілін',
  everyDayAt: 'Кожны дзень у {value}',
  customSchedule: 'Індывідуальны расклад',
  validation: {
    invalidStep: 'Няправільны выраз кроку',
    stepOutOfRange: 'Крок павінен быць дадатным значэннем у дыяпазоне поля',
    invalidRange: 'Няправільны выраз дыяпазону',
    valueOutOfRange: 'Значэнне павінна быць паміж {min} і {max}',
    rangeOrder: 'Пачатак дыяпазону не павінен перавышаць канец дыяпазону',
    fieldRequired: 'Поле абавязковае',
    questionMarkField: 'Знак пытання падтрымліваецца толькі для палёў дня і тыдня',
    questionMarkAlone: 'Пытальнік павінен быць адзіным значэннем поля',
    unsupportedCharacter: 'Непадтрымоўваны сімвал у полі',
    expectedFields: 'Чакаецца {count} палёў для абранага фармату Quartz',
    dayWeekQuestionMark: 'У выразе Quartz поле дня або тыдня павінна быць ?, але не абодва',
    invalidExpression: 'Няправільны выраз cron',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
