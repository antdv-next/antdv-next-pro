import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/uk_UA'

const cronLocale: CronLocale = {
  fields: {
    second: 'Секунда',
    minute: 'Хвилина',
    hour: 'година',
    day: 'день',
    month: 'місяць',
    week: 'тиждень',
    year: 'рік',
  },
  modes: {
    every: 'Кожен',
    interval: 'Інтервал',
    specified: 'Вказано',
    range: 'Діапазон',
    list: 'Список',
  },
  any: 'Будь-який',
  notSpecified: 'Не вказано',
  every: 'кожні',
  everyField: 'кожні {field}',
  valueSeparator: ', ',
  to: 'до',
  expression: 'Вираз Cron',
  fieldList: 'Поля Cron',
  fieldStart: '{field} початок',
  fieldInterval: '{field} інтервал',
  fieldRangeStart: '{field} початок діапазону',
  fieldRangeEnd: '{field} кінець діапазону',
  fieldValue: '{field} значення',
  fieldValues: '{field} значень',
  nextRun: 'Наступний запуск: {value}',
  noFutureRun: 'Немає майбутнього запуску',
  everySeconds: 'Кожні {value} секунд',
  everyMinutes: 'Кожні {value} хвилин',
  everyDayAt: 'щодня о {value}',
  customSchedule: 'Спеціальний графік',
  validation: {
    invalidStep: 'Недійсний вираз кроку',
    stepOutOfRange: 'Крок має бути додатним значенням у діапазоні поля',
    invalidRange: 'Недійсний вираз діапазону',
    valueOutOfRange: 'Значення має бути між {min} і {max}',
    rangeOrder: 'Початок діапазону не повинен перевищувати кінець діапазону',
    fieldRequired: 'Поле обов\'язкове для заповнення',
    questionMarkField: 'Знак питання підтримується лише для полів дня та тижня',
    questionMarkAlone: 'Знак питання має бути єдиним значенням поля',
    unsupportedCharacter: 'Непідтримуваний символ у полі',
    expectedFields: 'Очікується {count} полів для вибраного формату Quartz',
    dayWeekQuestionMark: 'У виразі Quartz поле дня або поля тижня має бути ?, але не обидва',
    invalidExpression: 'Недійсний вираз cron',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
