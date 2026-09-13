import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ca_ES'

const cronLocale = {
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
    special: 'Especial',
  },
  notSpecified: 'No especificat',
  everyField: 'Cada {field}',
  everyStep: 'Executa cada {step} {field}',
  intervalField: 'Comença a  {start} i executa cada {step} {field}',
  specifiedField: '{values}',
  rangeField: '{start} a {end}',
  unspecifiedDay: 'El dia no està especificat; segueix el camp de la setmana',
  unspecifiedWeek: 'La setmana no està especificada; segueix el camp del dia',
  valueSeparator: ', ',
  expression: 'Expressió Cron',
  fieldList: 'Camps Cron',
  fieldStart: '{field} comença',
  fieldInterval: '{field} interval',
  fieldRangeStart: '{field} inici d\'interval',
  fieldRangeEnd: '{field} final d\'interval',
  fieldValues: '{field} valors',
  nextRun: 'Proper execució: {value}',
  noFutureRun: 'No hi ha cap execució futura',
  specialLastDay: 'l\'últim dia de cada mes',
  specialLastWeekday: 'l\'últim dia laborable de cada mes',
  specialNearestWeekday: 'el dia laborable més proper al dia {day} de cada mes',
  specialLastDayOfWeek: 'l\'últim {week} de cada mes',
  specialNthDayOfWeek: 'el {nth} {week} de cada mes',
  specialLast: 'Últim',
  specialNth: 'N-èsim',
  nthLabels: {
    1: '1r',
    2: '2n',
    3: '3r',
    4: '4t',
    5: '5è',
  },
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
    expectedUnixFields: 'Unix cron espera 5 camps',
    dayWeekQuestionMark: 'En una expressió Quartz, el camp del dia o el camp de la setmana ha de ser ?, però no tots dos',
    unixQuestionMark: 'El signe d\'interrogació no és compatible amb Unix cron',
    unsupportedSpecial: 'Aquesta sintaxi especial no és compatible',
    invalidExpression: 'Expressió cron no vàlida',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'Mapa de calor',
    less: 'Menys',
    more: 'Més',
    noData: 'Sense dades',
    level: 'Nivell',
  },
  InputTag: {
    clear: 'Esborra',
    showMore: 'Mostra totes les etiquetes',
  },
} satisfies ProLocale

export default proLocale
