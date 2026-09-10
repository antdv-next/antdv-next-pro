import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/sr_RS'

const cronLocale: CronLocale = {
  fields: {
    second: 'Секунда',
    minute: 'Минут',
    hour: 'Сат',
    day: 'дан',
    month: 'Месец',
    week: 'недеља',
    year: 'Година',
  },
  modes: {
    every: 'Сваки',
    interval: 'Интервал',
    specified: 'Наведено',
    range: 'Распон',
    list: 'Листа',
  },
  any: 'Било који',
  notSpecified: 'Није наведено',
  every: 'сваки',
  everyField: 'Сваких {field}',
  valueSeparator: ', ',
  to: 'до',
  expression: 'Црон израз',
  fieldList: 'Црон поља',
  fieldStart: '{field} почетак',
  fieldInterval: '{field} интервал',
  fieldRangeStart: '{field} почетак опсега',
  fieldRangeEnd: '{field} крај опсега',
  fieldValue: '{field} вредност',
  fieldValues: '{field} вредности',
  nextRun: 'Следеће покретање: {value}',
  noFutureRun: 'Нема будућег трчања',
  everySeconds: 'Сваких {value} секунди',
  everyMinutes: 'Сваких {value} минута',
  everyDayAt: 'Сваки дан у {value}',
  customSchedule: 'Прилагођени распоред',
  validation: {
    invalidStep: 'Неважећи израз корака',
    stepOutOfRange: 'Корак мора бити позитивна вредност унутар опсега поља',
    invalidRange: 'Неважећи израз опсега',
    valueOutOfRange: 'Вредност мора да буде између {min} и {max}',
    rangeOrder: 'Почетак опсега не сме бити већи од краја опсега',
    fieldRequired: 'Поље је обавезно',
    questionMarkField: 'Знак питања је подржан само за поља дана и недеље',
    questionMarkAlone: 'Знак питања мора бити једина вредност поља',
    unsupportedCharacter: 'Неподржани знак у пољу',
    expectedFields: 'Очекивана {count} поља за изабрани Куартз формат',
    dayWeekQuestionMark: 'У Куартз изразу, или поље за дан или поље за седмицу мора бити ЗКСККУЕСТИОНККСЗ, али не обоје',
    invalidExpression: 'Неважећи црон израз',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
