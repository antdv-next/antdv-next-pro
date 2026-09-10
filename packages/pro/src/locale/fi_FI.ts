import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/fi_FI'

const cronLocale: CronLocale = {
  fields: {
    second: 'Sekunti',
    minute: 'Minuutti',
    hour: 'Tunti',
    day: 'Päivä',
    month: 'Kuukausi',
    week: 'Viikko',
    year: 'Vuosi',
  },
  modes: {
    every: 'Joka',
    interval: 'Väli',
    specified: 'Määritetty',
    range: 'Alue',
    list: 'Luettelo',
  },
  any: 'Mikä tahansa',
  notSpecified: 'Ei määritelty',
  every: 'joka',
  everyField: 'Joka {field}',
  valueSeparator: ', ',
  to: '–',
  expression: 'Cron-lauseke',
  fieldList: 'Cron-kentät',
  fieldStart: '{field} alkaa',
  fieldInterval: '{field} intervalli',
  fieldRangeStart: '{field} alueen alku',
  fieldRangeEnd: '{field} alueen loppu',
  fieldValue: '{field} arvo',
  fieldValues: '{field} arvoa',
  nextRun: 'Seuraava ajo: {value}',
  noFutureRun: 'Ei tulevaa ajoa',
  everySeconds: '{value} sekunnin välein',
  everyMinutes: '{value} minuutin välein',
  everyDayAt: 'Joka päivä klo {value}',
  customSchedule: 'Mukautettu aikataulu',
  validation: {
    invalidStep: 'Virheellinen askellauseke',
    stepOutOfRange: 'Askeleen on oltava positiivinen arvo kenttäalueen sisällä',
    invalidRange: 'Virheellinen välilauseke',
    valueOutOfRange: 'Arvon on oltava välillä {min} - {max}',
    rangeOrder: 'Alueen alku ei saa olla suurempi kuin alueen loppu',
    fieldRequired: 'Kenttä on pakollinen',
    questionMarkField: 'Kysymysmerkkiä tuetaan vain päivä- ja viikkokentissä',
    questionMarkAlone: 'Kysymysmerkin on oltava kentän ainoa arvo',
    unsupportedCharacter: 'Ei-tuettu merkki kentässä',
    expectedFields: 'Odotettu {count} kenttää valitulle Quartz-muodolle',
    dayWeekQuestionMark: 'Kvartsilausekkeessa joko päivä- tai viikkokentän on oltava ?, mutta ei molempia',
    invalidExpression: 'Virheellinen cron-lauseke',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
