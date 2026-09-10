import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/nb_NO'

const cronLocale: CronLocale = {
  fields: {
    second: 'andre',
    minute: 'minutt',
    hour: 'Time',
    day: 'Dag',
    month: 'Måned',
    week: 'Uke',
    year: 'År',
  },
  modes: {
    every: 'Hver',
    interval: 'Intervall',
    specified: 'Spesifisert',
    range: 'Rekkevidde',
    list: 'Liste',
  },
  any: 'Alle',
  notSpecified: 'Ikke spesifisert',
  every: 'hver',
  everyField: 'Hver {field}',
  valueSeparator: ', ',
  to: 'til',
  expression: 'Cron-uttrykk',
  fieldList: 'Cron-felt',
  fieldStart: '{field} start',
  fieldInterval: '{field} intervall',
  fieldRangeStart: '{field} rekkeviddestart',
  fieldRangeEnd: '{field} områdeslutt',
  fieldValue: '{field} verdi',
  fieldValues: '{field} verdier',
  nextRun: 'Neste kjøring: {value}',
  noFutureRun: 'Ingen fremtidig kjøring',
  everySeconds: 'Hvert {value}. sekund',
  everyMinutes: 'Hvert {value}. minutt',
  everyDayAt: 'Hver dag kl. {value}',
  customSchedule: 'Egendefinert tidsplan',
  validation: {
    invalidStep: 'Ugyldig trinnuttrykk',
    stepOutOfRange: 'Trinn må være en positiv verdi innenfor feltområdet',
    invalidRange: 'Ugyldig områdeuttrykk',
    valueOutOfRange: 'Verdien må være mellom {min} og {max}',
    rangeOrder: 'Rekkeviddestart må ikke være større enn rekkeviddeslutt',
    fieldRequired: 'Felt er obligatorisk',
    questionMarkField: 'Spørsmålstegn støttes kun for dag- og ukefelt',
    questionMarkAlone: 'Spørsmålstegnet må være den eneste feltverdien',
    unsupportedCharacter: 'Ustøttet tegn i feltet',
    expectedFields: 'Forventet {count} felt for det valgte Quartz-formatet',
    dayWeekQuestionMark: 'I et Quartz-uttrykk må enten dagfeltet eller ukefeltet være ?, men ikke begge deler',
    invalidExpression: 'Ugyldig cron-uttrykk',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
