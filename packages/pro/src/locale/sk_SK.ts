import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/sk_SK'

const cronLocale: CronLocale = {
  fields: {
    second: 'sekunda',
    minute: 'minúta',
    hour: 'hodina',
    day: 'Deň',
    month: 'Mesiac',
    week: 'týždeň',
    year: 'rok',
  },
  modes: {
    every: 'Každý',
    interval: 'Interval',
    specified: 'Špecifikované',
    range: 'Rozsah',
    list: 'Zoznam',
  },
  any: 'Akékoľvek',
  notSpecified: 'Neuvedené',
  every: 'každý',
  everyField: 'Každých {field}',
  valueSeparator: ', ',
  to: 'až',
  expression: 'Cron výraz',
  fieldList: 'Cron polia',
  fieldStart: '{field} začiatok',
  fieldInterval: '{field} interval',
  fieldRangeStart: '{field} začiatok rozsahu',
  fieldRangeEnd: '{field} koniec rozsahu',
  fieldValue: '{field}',
  fieldValues: '{field} hodnôt',
  nextRun: 'Ďalšie spustenie: {value}',
  noFutureRun: 'Žiadny budúci beh',
  everySeconds: 'Každých {value} sekúnd',
  everyMinutes: 'Každých {value} minút',
  everyDayAt: 'Každý deň o {value}',
  customSchedule: 'Vlastný rozvrh',
  validation: {
    invalidStep: 'Neplatný výraz kroku',
    stepOutOfRange: 'Krok musí byť kladná hodnota v rámci rozsahu poľa',
    invalidRange: 'Neplatný výraz rozsahu',
    valueOutOfRange: 'Hodnota musí byť medzi {min} a {max}',
    rangeOrder: 'Začiatok rozsahu nesmie byť väčší ako koniec rozsahu',
    fieldRequired: 'pole je povinné',
    questionMarkField: 'Otáznik je podporovaný len pre polia dňa a týždňa',
    questionMarkAlone: 'Otáznik musí byť jedinou hodnotou poľa',
    unsupportedCharacter: 'Nepodporovaný znak v poli',
    expectedFields: 'Očakávaný počet polí pre vybratý formát Quartz: {count}',
    dayWeekQuestionMark: 'Vo výraze Quartz musí byť pole dňa alebo týždňa ?, ale nie obidve',
    invalidExpression: 'Neplatný cron výraz',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
