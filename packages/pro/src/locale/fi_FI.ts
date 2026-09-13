import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/fi_FI'

const cronLocale = {
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
    special: 'Erityinen',
  },
  notSpecified: 'Ei määritelty',
  everyField: 'Joka {field}',
  everyStep: 'Suorita {step} minuutin välein {field}',
  intervalField: 'Aloita {field} {start} ja suorita {step} minuutin välein',
  specifiedField: '{values}',
  rangeField: '{start} – {end}',
  unspecifiedDay: 'Päivää ei ole määritetty; käytä viikkokenttää',
  unspecifiedWeek: 'Viikkoa ei ole määritetty; käytä päiväkenttää',
  valueSeparator: ', ',
  expression: 'Cron-lauseke',
  fieldList: 'Cron-kentät',
  fieldStart: '{field} alkaa',
  fieldInterval: '{field} intervalli',
  fieldRangeStart: '{field} alueen alku',
  fieldRangeEnd: '{field} alueen loppu',
  fieldValues: '{field} arvoa',
  nextRun: 'Seuraava ajo: {value}',
  noFutureRun: 'Ei tulevaa ajoa',
  specialLastDay: 'kunkin kuukauden viimeinen päivä',
  specialLastWeekday: 'kunkin kuukauden viimeinen arkipäivä',
  specialNearestWeekday: 'arkipäivä, joka on lähinnä kuukauden {day}. päivää',
  specialLastDayOfWeek: 'kunkin kuukauden viimeinen {week}',
  specialNthDayOfWeek: 'kunkin kuukauden {nth} {week}',
  specialLast: 'Viimeinen',
  specialNth: 'N.',
  nthLabels: {
    1: '1.',
    2: '2.',
    3: '3.',
    4: '4.',
    5: '5.',
  },
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
    expectedUnixFields: 'Unix-cron odottaa 5 kenttää',
    dayWeekQuestionMark: 'Kvartsilausekkeessa joko päivä- tai viikkokentän on oltava ?, mutta ei molempia',
    unixQuestionMark: 'Kysymysmerkkiä ei tueta Unix-cronissa',
    unsupportedSpecial: 'Tätä erikoissyntaksia ei tueta',
    invalidExpression: 'Virheellinen cron-lauseke',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'Lämpökartta',
    less: 'Vähemmän',
    more: 'Enemmän',
    noData: 'Ei tietoja',
    level: 'Taso',
  },
  InputTag: {
    clear: 'Tyhjennä',
    showMore: 'Näytä kaikki tunnisteet',
  },
} satisfies ProLocale

export default proLocale
