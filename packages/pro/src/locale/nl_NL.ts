import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/nl_NL'

const cronLocale: CronLocale = {
  fields: {
    second: 'Seconde',
    minute: 'Minuut',
    hour: 'Uur',
    day: 'Dag',
    month: 'Maand',
    week: 'Week',
    year: 'Jaar',
  },
  modes: {
    every: 'Elke',
    interval: 'Interval',
    specified: 'Gespecificeerd',
    range: 'Bereik',
    list: 'Lijst',
  },
  any: 'Elke',
  notSpecified: 'Niet gespecificeerd',
  every: 'elke',
  everyField: 'Elke {field}',
  valueSeparator: ', ',
  to: 'tot',
  expression: 'Cron-expressie',
  fieldList: 'Cron-velden',
  fieldStart: '{field} begin',
  fieldInterval: '{field} interval',
  fieldRangeStart: '{field} bereikbegin',
  fieldRangeEnd: '{field} einde bereik',
  fieldValue: '{field} waarde',
  fieldValues: '{field} waarden',
  nextRun: 'Volgende uitvoering: {value}',
  noFutureRun: 'Geen toekomstige run',
  everySeconds: 'Elke {value} seconden',
  everyMinutes: 'Elke {value} minuten',
  everyDayAt: 'Elke dag om {value}',
  customSchedule: 'Aangepast schema',
  validation: {
    invalidStep: 'Ongeldige stapexpressie',
    stepOutOfRange: 'Stap moet een positieve waarde zijn binnen het veldbereik',
    invalidRange: 'Ongeldige bereikexpressie',
    valueOutOfRange: 'Waarde moet tussen {min} en {max} liggen',
    rangeOrder: 'Het begin van het bereik mag niet groter zijn dan het einde van het bereik',
    fieldRequired: 'Veld is verplicht',
    questionMarkField: 'Vraagteken wordt alleen ondersteund voor dag- en weekvelden',
    questionMarkAlone: 'Vraagteken moet de enige veldwaarde zijn',
    unsupportedCharacter: 'Niet-ondersteund teken in veld',
    expectedFields: 'Verwachte {count} velden voor het geselecteerde Quartz-formaat',
    dayWeekQuestionMark: 'In een Quartz-expressie moet het dagveld of het weekveld ? zijn, maar niet beide',
    invalidExpression: 'Ongeldige cron-expressie',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
