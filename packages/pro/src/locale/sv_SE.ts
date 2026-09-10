import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/sv_SE'

const cronLocale: CronLocale = {
  fields: {
    second: 'andra',
    minute: 'minut',
    hour: 'timme',
    day: 'Dag',
    month: 'månad',
    week: 'Vecka',
    year: 'År',
  },
  modes: {
    every: 'Varje',
    interval: 'Intervall',
    specified: 'Specificerat',
    range: 'Räckvidd',
    list: 'Lista',
  },
  any: 'Alla',
  notSpecified: 'Ej specificerat',
  every: 'varje',
  everyField: 'Varje {field}',
  valueSeparator: ', ',
  to: 'till',
  expression: 'Cron uttryck',
  fieldList: 'Cron-fält',
  fieldStart: '{field} start',
  fieldInterval: '{field} intervall',
  fieldRangeStart: '{field} intervallstart',
  fieldRangeEnd: '{field} intervall slut',
  fieldValue: '{field} värde',
  fieldValues: '{field} värden',
  nextRun: 'Nästa körning: {value}',
  noFutureRun: 'Ingen framtida körning',
  everySeconds: 'Var {value} sekund',
  everyMinutes: 'Var {value} minut',
  everyDayAt: 'Varje dag kl. {value}',
  customSchedule: 'Anpassat schema',
  validation: {
    invalidStep: 'Ogiltigt steguttryck',
    stepOutOfRange: 'Steget måste vara ett positivt värde inom fältområdet',
    invalidRange: 'Ogiltigt intervalluttryck',
    valueOutOfRange: 'Värdet måste vara mellan {min} och {max}',
    rangeOrder: 'Räckviddsstart får inte vara större än intervallslut',
    fieldRequired: 'Fält krävs',
    questionMarkField: 'Frågetecken stöds endast för dag- och veckofält',
    questionMarkAlone: 'Frågetecken måste vara det enda fältvärdet',
    unsupportedCharacter: 'Tecken som inte stöds i fältet',
    expectedFields: 'Förväntade {count} fält för det valda Quartz-formatet',
    dayWeekQuestionMark: 'I ett Quartz-uttryck måste antingen dagfältet eller veckofältet vara ?, men inte båda',
    invalidExpression: 'Ogiltigt cron-uttryck',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
