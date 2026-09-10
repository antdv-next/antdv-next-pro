import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/mk_MK'

const cronLocale: CronLocale = {
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
    list: 'Список',
  },
  any: 'Секое',
  notSpecified: 'Не е одредено',
  every: 'секој',
  everyField: 'секој {field}',
  valueSeparator: ', ',
  to: 'до',
  expression: 'Крон израз',
  fieldList: 'Cron полиња',
  fieldStart: '{field} почеток',
  fieldInterval: '{field} интервал',
  fieldRangeStart: 'почеток на опсегот {field}',
  fieldRangeEnd: 'крај на опсегот {field}',
  fieldValue: '{field} вредност',
  fieldValues: '{field} вредности',
  nextRun: 'Следно возење: {value}',
  noFutureRun: 'Нема идно трчање',
  everySeconds: 'На секои {value} секунди',
  everyMinutes: 'На секои {value} минути',
  everyDayAt: 'Секој ден во {value}',
  customSchedule: 'Прилагоден распоред',
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
    dayWeekQuestionMark: 'Во кварцниот израз, или полето дневно или седмичното поле мора да биде ?, но не и двете',
    invalidExpression: 'Неважечки cron израз',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
