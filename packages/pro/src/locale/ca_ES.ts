import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ca_ES'

const cronLocale: CronLocale = {
  fields: {
    second: 'Segon',
    minute: 'Minut',
    hour: 'Hora',
    day: 'Dia',
    month: 'Mes',
    week: 'Setmana',
    year: 'Any',
  },
  modes: {
    every: 'Cada',
    interval: 'Interval',
    specified: 'Especificat',
    range: 'Interval',
    list: 'Llista',
  },
  any: 'Qualsevol',
  notSpecified: 'No especificat',
  every: 'cada',
  everyField: 'Cada {field}',
  valueSeparator: ', ',
  to: 'a',
  expression: 'Expressió Cron',
  fieldList: 'Camps Cron',
  fieldStart: '{field} comença',
  fieldInterval: '{field} interval',
  fieldRangeStart: '{field} inici d\'interval',
  fieldRangeEnd: '{field} final d\'interval',
  fieldValue: '{field} valor',
  fieldValues: '{field} valors',
  nextRun: 'Proper execució: {value}',
  noFutureRun: 'No hi ha cap execució futura',
  everySeconds: 'Cada {value} segons',
  everyMinutes: 'Cada {value} minuts',
  everyDayAt: 'Cada dia a les {value}',
  customSchedule: 'Horari personalitzat',
  validation: {
    invalidStep: 'Expressió de pas no vàlida',
    stepOutOfRange: 'El pas ha de ser un valor positiu dins de l\'interval de camp',
    invalidRange: 'Expressió d\'interval no vàlida',
    valueOutOfRange: 'El valor ha d\'estar entre {min} i {max}',
    rangeOrder: 'L\'inici de l\'interval no ha de ser superior al final de l\'interval',
    fieldRequired: 'El camp és obligatori',
    questionMarkField: 'El signe d\'interrogació només s\'admet per als camps de dia i setmana',
    questionMarkAlone: 'El signe d\'interrogació ha de ser l\'únic valor del camp',
    unsupportedCharacter: 'Caràcter no admès al camp',
    expectedFields: 'S\'esperava {count} camps per al format Quartz seleccionat',
    dayWeekQuestionMark: 'En una expressió Quartz, el camp del dia o el camp de la setmana ha de ser ?, però no tots dos',
    invalidExpression: 'Expressió cron no vàlida',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
