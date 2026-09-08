import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/hu_HU'

const cronLocale: CronLocale = {
  fields: {
    second: 'Másodperc',
    minute: 'Perc',
    hour: 'Óra',
    day: 'nap',
    month: 'Hónap',
    week: 'hét',
    year: 'Év',
  },
  modes: {
    every: 'Minden',
    interval: 'Időköz',
    specified: 'Megadva',
    range: 'Tartomány',
    list: 'Lista',
  },
  any: 'Bármelyik',
  notSpecified: 'Nincs megadva',
  every: 'minden',
  everyField: 'Minden {field}.',
  to: 'ide',
  expression: 'Cron kifejezés',
  fieldList: 'Cron mezők',
  fieldStart: '{field} kezdete',
  fieldInterval: '{field} intervallum',
  fieldRangeStart: '{field} tartomány kezdete',
  fieldRangeEnd: '{field} tartomány vége',
  fieldValue: '{field} érték',
  fieldValues: '{field} értékek',
  nextRun: 'Következő futás: {value}',
  noFutureRun: 'Nincs jövőbeli futtatás',
  everySeconds: '{value} másodpercenként',
  everyMinutes: '{value} percenként',
  everyDayAt: 'Minden nap ekkor: {value}',
  customSchedule: 'Egyéni ütemezés',
  validation: {
    invalidStep: 'Érvénytelen lépéses kifejezés',
    stepOutOfRange: 'A lépésnek pozitív értéknek kell lennie a mezőtartományon belül',
    invalidRange: 'Érvénytelen tartománykifejezés',
    valueOutOfRange: 'Az értéknek {min} és {max} között kell lennie',
    rangeOrder: 'A tartomány kezdete nem lehet nagyobb, mint a tartomány vége',
    fieldRequired: 'A mező kitöltése kötelező',
    questionMarkField: 'A kérdőjel csak a nap és a hét mezőkben használható',
    questionMarkAlone: 'A kérdőjel lehet az egyetlen mezőérték',
    unsupportedCharacter: 'Nem támogatott karakter a mezőben',
    expectedFields: 'A kiválasztott Quartz formátumhoz {count} mező várható',
    dayWeekQuestionMark: 'A Quartz kifejezésben a nap vagy a hét mezőnek ?-nek kell lennie, de nem mindkettőnek',
    invalidExpression: 'Érvénytelen cron kifejezés',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
