import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/sv_SE'

const cronLocale = {
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
    special: 'Speciell',
  },
  notSpecified: 'Ej specificerat',
  everyField: 'Varje {field}',
  everyStep: 'Kör var {step} {field}er',
  intervalField: 'Börja vid  {start} och kör var {step} {field}er',
  specifiedField: '{values}',
  rangeField: '{start} till {end}',
  unspecifiedDay: 'Dag inte angiven; följ veckofältet',
  unspecifiedWeek: 'Vecka inte angiven; följ dagfältet',
  valueSeparator: ', ',
  expression: 'Cron uttryck',
  fieldList: 'Cron-fält',
  fieldStart: '{field} start',
  fieldInterval: '{field} intervall',
  fieldRangeStart: '{field} intervallstart',
  fieldRangeEnd: '{field} intervall slut',
  fieldValues: '{field} värden',
  nextRun: 'Nästa körning: {value}',
  noFutureRun: 'Ingen framtida körning',
  specialLastDay: 'den sista dagen varje månad',
  specialLastWeekday: 'den sista vardagen varje månad',
  specialNearestWeekday: 'vardagen närmast dag {day} varje månad',
  specialLastDayOfWeek: 'den sista {week} varje månad',
  specialNthDayOfWeek: 'den {nth} {week} varje månad',
  specialLast: 'Sista',
  specialNth: 'N:e',
  nthLabels: {
    1: '1:a',
    2: '2:a',
    3: '3:e',
    4: '4:e',
    5: '5:e',
  },
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
    expectedUnixFields: 'Unix-cron förväntar sig 5 fält',
    dayWeekQuestionMark: 'I ett Quartz-uttryck måste antingen dagfältet eller veckofältet vara ?, men inte båda',
    unixQuestionMark: 'Frågetecken stöds inte i Unix-cron',
    unsupportedSpecial: 'Denna specialsyntax stöds inte',
    invalidExpression: 'Ogiltigt cron-uttryck',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'Värmekarta',
    less: 'Mindre',
    more: 'Mer',
    noData: 'Inga data',
    level: 'Nivå',
  },
  InputTag: {
    clear: 'Rensa',
    showMore: 'Visa alla taggar',
  },
} satisfies ProLocale

export default proLocale
