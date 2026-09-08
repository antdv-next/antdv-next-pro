import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/da_DK'

const cronLocale: CronLocale = {
  fields: {
    second: 'sekund',
    minute: 'minut',
    hour: 'Time',
    day: 'Dag',
    month: 'Måned',
    week: 'uge',
    year: 'år',
  },
  modes: {
    every: 'Hver',
    interval: 'Interval',
    specified: 'Specificeret',
    range: 'Rækkevidde',
    list: 'Liste',
  },
  any: 'Enhver',
  notSpecified: 'Ikke specificeret',
  every: 'hver',
  everyField: 'Hver {field}',
  to: 'til',
  expression: 'Cron udtryk',
  fieldList: 'Cron felter',
  fieldStart: '{field} start',
  fieldInterval: '{field} interval',
  fieldRangeStart: '{field} områdestart',
  fieldRangeEnd: '{field} områdeslut',
  fieldValue: '{field} værdi',
  fieldValues: '{field} værdier',
  nextRun: 'Næste kørsel: {value}',
  noFutureRun: 'Ingen fremtidig kørsel',
  everySeconds: 'Hvert {value} sekund',
  everyMinutes: 'Hvert {value}. minut',
  everyDayAt: 'Hver dag kl. {value}',
  customSchedule: 'Brugerdefineret tidsplan',
  validation: {
    invalidStep: 'Ugyldigt trinudtryk',
    stepOutOfRange: 'Trin skal være en positiv værdi inden for feltområdet',
    invalidRange: 'Ugyldigt områdeudtryk',
    valueOutOfRange: 'Værdien skal være mellem {min} og {max}',
    rangeOrder: 'Range start må ikke være større end range end',
    fieldRequired: 'Felt er påkrævet',
    questionMarkField: 'Spørgsmålstegn understøttes kun for dag- og ugefelter',
    questionMarkAlone: 'Spørgsmålstegn skal være den eneste feltværdi',
    unsupportedCharacter: 'Ikke-understøttet tegn i feltet',
    expectedFields: 'Forventede {count} felter for det valgte Quartz-format',
    dayWeekQuestionMark: 'I et Quartz-udtryk skal enten dagfeltet eller ugefeltet være ?, men ikke begge',
    invalidExpression: 'Ugyldigt cron-udtryk',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
