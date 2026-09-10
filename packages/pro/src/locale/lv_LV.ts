import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/lv_LV'

const cronLocale: CronLocale = {
  fields: {
    second: 'sekunde',
    minute: 'Minūte',
    hour: 'Stunda',
    day: 'diena',
    month: 'Mēnesis',
    week: 'Nedēļa',
    year: 'Gads',
  },
  modes: {
    every: 'Katru',
    interval: 'Intervāls',
    specified: 'Norādīts',
    range: 'Diapazons',
    list: 'Saraksts',
  },
  any: 'Jebkurš',
  notSpecified: 'Nav norādīts',
  every: 'katru',
  everyField: 'Ik pēc {field}',
  valueSeparator: ', ',
  to: 'līdz',
  expression: 'Krona izteiksme',
  fieldList: 'Cron lauki',
  fieldStart: '{field} sākums',
  fieldInterval: '{field} intervāls',
  fieldRangeStart: '{field} diapazona sākums',
  fieldRangeEnd: '{field} diapazona beigas',
  fieldValue: '{field} vērtība',
  fieldValues: '{field} vērtības',
  nextRun: 'Nākamā palaišana: {value}',
  noFutureRun: 'Nav turpmākas darbības',
  everySeconds: 'Ik pēc {value} sekundēm',
  everyMinutes: 'Ik pēc {value} minūtēm',
  everyDayAt: 'Katru dienu plkst. {value}',
  customSchedule: 'Pielāgots grafiks',
  validation: {
    invalidStep: 'Nederīga soļa izteiksme',
    stepOutOfRange: 'Solim ir jābūt pozitīvai vērtībai lauka diapazonā',
    invalidRange: 'Nederīga diapazona izteiksme',
    valueOutOfRange: 'Vērtībai ir jābūt no {min} līdz {max}',
    rangeOrder: 'Diapazona sākums nedrīkst būt lielāks par diapazona beigas',
    fieldRequired: 'Lauks ir jāaizpilda obligāti',
    questionMarkField: 'Jautājuma zīme tiek atbalstīta tikai dienas un nedēļas laukiem',
    questionMarkAlone: 'Vienīgajai lauka vērtībai ir jābūt jautājuma zīmei',
    unsupportedCharacter: 'Neatbalstīta rakstzīme laukā',
    expectedFields: 'Paredzēti {count} lauki atlasītajam kvarca formātam',
    dayWeekQuestionMark: 'Kvarca izteiksmē dienas laukam vai nedēļas laukam ir jābūt ?, bet ne abiem',
    invalidExpression: 'Nederīga cron izteiksme',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
