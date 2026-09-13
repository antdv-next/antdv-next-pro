import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ru_RU'

const cronLocale = {
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
    special: 'Особый',
  },
  notSpecified: 'Не указано',
  everyField: 'Каждые {field}',
  everyStep: 'Выполнять каждые {step} минут {field}',
  intervalField: 'Начать с минуты {start} и выполнять каждые {step} минут {field}',
  specifiedField: '{values}',
  rangeField: '{start} до {end}',
  unspecifiedDay: 'Дата не указана; следовать полю недели',
  unspecifiedWeek: 'День недели не указан; следовать полю дня',
  valueSeparator: ', ',
  expression: 'Выражение Cron',
  fieldList: 'Поля хрона',
  fieldStart: '{field} начало',
  fieldInterval: '{field} интервал',
  fieldRangeStart: '{field} начало диапазона',
  fieldRangeEnd: '{field} конец диапазона',
  fieldValues: '{field} значений',
  nextRun: 'Следующий запуск: {value}',
  noFutureRun: 'Никакого будущего запуска',
  specialLastDay: 'последний день каждого месяца',
  specialLastWeekday: 'последний рабочий день каждого месяца',
  specialNearestWeekday: 'ближайший рабочий день к {day}-му числу каждого месяца',
  specialLastDayOfWeek: 'последний {week} каждого месяца',
  specialNthDayOfWeek: '{nth} {week} каждого месяца',
  specialLast: 'Последний',
  specialNth: 'N-й',
  nthLabels: {
    1: '1-й',
    2: '2-й',
    3: '3-й',
    4: '4-й',
    5: '5-й',
  },
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
    expectedUnixFields: 'Unix cron ожидает 5 полей',
    dayWeekQuestionMark: 'В выражении Quartz поле дня или поле недели должно быть ?, но не оба одновременно.',
    unixQuestionMark: 'Вопросительный знак не поддерживается в Unix cron',
    unsupportedSpecial: 'Этот специальный синтаксис не поддерживается',
    invalidExpression: 'Неверное выражение cron',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'Тепловая карта',
    less: 'Меньше',
    more: 'Больше',
    noData: 'Нет данных',
    level: 'Уровень',
  },
  InputTag: {
    clear: 'Очистить',
    showMore: 'Показать все теги',
  },
} satisfies ProLocale

export default proLocale
