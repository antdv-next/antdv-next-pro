import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/hr_HR'

const cronLocale: CronLocale = {
  fields: {
    second: 'sekunda',
    minute: 'Minuta',
    hour: 'sat',
    day: 'dan',
    month: 'Mjesec',
    week: 'Tjedan',
    year: 'godina',
  },
  modes: {
    every: 'Svaki',
    interval: 'Interval',
    specified: 'Navedeno',
    range: 'Raspon',
    list: 'Popis',
  },
  any: 'Bilo koji',
  notSpecified: 'Nije navedeno',
  every: 'svaki',
  everyField: 'svakih {field}',
  to: 'do',
  expression: 'Cron izraz',
  fieldList: 'Cron polja',
  fieldStart: '{field} početak',
  fieldInterval: '{field} interval',
  fieldRangeStart: '{field} početak raspona',
  fieldRangeEnd: '{field} kraj raspona',
  fieldValue: '{field} vrijednost',
  fieldValues: '{field} vrijednosti',
  nextRun: 'Sljedeće pokretanje: {value}',
  noFutureRun: 'Nema budućeg trčanja',
  everySeconds: 'Svakih {value} sekundi',
  everyMinutes: 'Svakih {value} minuta',
  everyDayAt: 'Svaki dan u {value}',
  customSchedule: 'Prilagođeni raspored',
  validation: {
    invalidStep: 'Nevažeći izraz koraka',
    stepOutOfRange: 'Korak mora biti pozitivna vrijednost unutar raspona polja',
    invalidRange: 'Nevažeći izraz raspona',
    valueOutOfRange: 'Vrijednost mora biti između {min} i {max}',
    rangeOrder: 'Početak raspona ne smije biti veći od kraja raspona',
    fieldRequired: 'Polje je obavezno',
    questionMarkField: 'Upitnik je podržan samo za polja dana i tjedna',
    questionMarkAlone: 'Upitnik mora biti jedina vrijednost polja',
    unsupportedCharacter: 'Nepodržani znak u polju',
    expectedFields: 'Očekivana {count} polja za odabrani Quartz format',
    dayWeekQuestionMark: 'U Quartz izrazu polje dana ili tjedna mora biti ?, ali ne oboje',
    invalidExpression: 'Nevažeći cron izraz',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
