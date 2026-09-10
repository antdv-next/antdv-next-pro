import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/is_IS'

const cronLocale: CronLocale = {
  fields: {
    second: 'sekúndu',
    minute: 'mínúta',
    hour: 'klukkustund',
    day: 'Dagur',
    month: 'Mánuður',
    week: 'Vika',
    year: 'Ár',
  },
  modes: {
    every: 'Sérhver',
    interval: 'Millibil',
    specified: 'Tilgreint',
    range: 'Svið',
    list: 'Listi',
  },
  any: 'Hvaða sem er',
  notSpecified: 'Ekki tilgreint',
  every: 'á hverjum',
  everyField: 'Á {field} fresti',
  valueSeparator: ', ',
  to: 'til',
  expression: 'Cron tjáning',
  fieldList: 'Cron reitir',
  fieldStart: '{field} byrja',
  fieldInterval: '{field} bil',
  fieldRangeStart: '{field} svið byrjun',
  fieldRangeEnd: '{field} sviðslok',
  fieldValue: '{field} gildi',
  fieldValues: '{field} gildi',
  nextRun: 'Næsta keyrsla: {value}',
  noFutureRun: 'Engin framtíðarhlaup',
  everySeconds: 'Á {value} sekúndna fresti',
  everyMinutes: 'Á {value} mínútna fresti',
  everyDayAt: 'Alla daga kl. {value}',
  customSchedule: 'Sérsniðin áætlun',
  validation: {
    invalidStep: 'Ógild skrefsjáning',
    stepOutOfRange: 'Skref verður að vera jákvætt gildi innan svæðissviðsins',
    invalidRange: 'Ógild sviðssjáning',
    valueOutOfRange: 'Gildi verður að vera á milli {min} og {max}',
    rangeOrder: 'Sviðsbyrjun má ekki vera meiri en sviðslok',
    fieldRequired: 'Svið er áskilið',
    questionMarkField: 'Spurningamerki er aðeins stutt fyrir dag og viku reiti',
    questionMarkAlone: 'Spurningamerki verður að vera eina reitgildið',
    unsupportedCharacter: 'Óstuddur stafur í reit',
    expectedFields: 'Búist var við {count} reitum fyrir valið kvarssnið',
    dayWeekQuestionMark: 'Í Quartz tjáningu verður annað hvort dagreiturinn eða vikureiturinn að vera ?, en ekki bæði',
    invalidExpression: 'Ógild cron tjáning',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
