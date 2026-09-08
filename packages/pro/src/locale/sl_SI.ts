import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/sl_SI'

const cronLocale: CronLocale = {
  fields: {
    second: 'sekunda',
    minute: 'minuta',
    hour: 'ura',
    day: 'dan',
    month: 'mesec',
    week: 'Teden',
    year: 'Leto',
  },
  modes: {
    every: 'Vsak',
    interval: 'Interval',
    specified: 'Določeno',
    range: 'Razpon',
    list: 'Seznam',
  },
  any: 'Karkoli',
  notSpecified: 'Ni določeno',
  every: 'vsak',
  everyField: 'vsak {field}',
  to: 'do',
  expression: 'Cron izraz',
  fieldList: 'Cron polja',
  fieldStart: '{field} začetek',
  fieldInterval: '{field} interval',
  fieldRangeStart: '{field} začetek obsega',
  fieldRangeEnd: '{field} konec obsega',
  fieldValue: '{field} vrednost',
  fieldValues: '{field} vrednosti',
  nextRun: 'Naslednji zagon: {value}',
  noFutureRun: 'Brez prihodnjega teka',
  everySeconds: 'Vsakih {value} sekund',
  everyMinutes: 'Vsakih {value} minut',
  everyDayAt: 'Vsak dan ob {value}',
  customSchedule: 'Urnik po meri',
  validation: {
    invalidStep: 'Neveljaven izraz koraka',
    stepOutOfRange: 'Korak mora biti pozitivna vrednost znotraj obsega polja',
    invalidRange: 'Neveljaven izraz obsega',
    valueOutOfRange: 'Vrednost mora biti med {min} in {max}',
    rangeOrder: 'Začetek razpona ne sme biti večji od konca razpona',
    fieldRequired: 'Polje je obvezno',
    questionMarkField: 'Vprašaj je podprt samo za polja za dan in teden',
    questionMarkAlone: 'Vprašaj mora biti edina vrednost polja',
    unsupportedCharacter: 'Nepodprt znak v polju',
    expectedFields: 'Pričakovana {count} polja za izbrani format Quartz',
    dayWeekQuestionMark: 'V izrazu Quartz mora biti polje dneva ali polje tedna ?, vendar ne oboje',
    invalidExpression: 'Neveljaven cron izraz',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
