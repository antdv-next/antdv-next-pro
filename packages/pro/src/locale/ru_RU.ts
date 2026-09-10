import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ru_RU'

const cronLocale: CronLocale = {
  fields: {
    second: 'Секунда',
    minute: 'Минута',
    hour: 'Час',
    day: 'День',
    month: 'Месяц',
    week: 'Неделя',
    year: 'Год',
  },
  modes: {
    every: 'Каждые',
    interval: 'Интервал',
    specified: 'указано',
    range: 'Диапазон',
    list: 'Список',
  },
  any: 'Любой',
  notSpecified: 'Не указано',
  every: 'каждые',
  everyField: 'Каждые {field}',
  valueSeparator: ', ',
  to: 'до',
  expression: 'Выражение Cron',
  fieldList: 'Поля хрона',
  fieldStart: '{field} начало',
  fieldInterval: '{field} интервал',
  fieldRangeStart: '{field} начало диапазона',
  fieldRangeEnd: '{field} конец диапазона',
  fieldValue: '{field} значение',
  fieldValues: '{field} значений',
  nextRun: 'Следующий запуск: {value}',
  noFutureRun: 'Никакого будущего запуска',
  everySeconds: 'Каждые {value} секунды',
  everyMinutes: 'Каждые {value} минут',
  everyDayAt: 'Каждый день в {value}',
  customSchedule: 'Индивидуальное расписание',
  validation: {
    invalidStep: 'Неверное выражение шага',
    stepOutOfRange: 'Шаг должен быть положительным значением в пределах диапазона поля.',
    invalidRange: 'Недопустимое выражение диапазона.',
    valueOutOfRange: 'Значение должно быть между {min} и {max}.',
    rangeOrder: 'Начало диапазона не должно быть больше конца диапазона.',
    fieldRequired: 'Поле обязательно для заполнения',
    questionMarkField: 'Вопросительный знак поддерживается только для полей дня и недели.',
    questionMarkAlone: 'Вопросительный знак должен быть единственным значением поля.',
    unsupportedCharacter: 'Неподдерживаемый символ в поле.',
    expectedFields: 'Ожидается {count} полей для выбранного формата Quartz.',
    dayWeekQuestionMark: 'В выражении Quartz поле дня или поле недели должно быть ?, но не оба одновременно.',
    invalidExpression: 'Неверное выражение cron',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
