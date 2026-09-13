import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/hr_HR'

const cronLocale = {
  fields: {
    second: 'sekunda',
    minute: 'Minuta',
    hour: 'sat',
    day: 'dan',
    month: 'Mjesec',
    week: 'Tjedan',
    year: 'godina',
  },
  modes: {
    every: 'Svaki',
    interval: 'Interval',
    specified: 'Navedeno',
    range: 'Raspon',
    special: 'Posebno',
  },
  notSpecified: 'Nije navedeno',
  everyField: 'svakih {field}',
  everyStep: 'Izvršavaj svakih {step} {field}',
  intervalField: 'Započni na minute {start} i izvršavaj svakih {step} {field}',
  specifiedField: '{values}',
  rangeField: '{start} do {end}',
  unspecifiedDay: 'Dan nije određen; slijedi polje tjedna',
  unspecifiedWeek: 'Tjedan nije određen; slijedi polje dana',
  valueSeparator: ', ',
  expression: 'Cron izraz',
  fieldList: 'Cron polja',
  fieldStart: '{field} početak',
  fieldInterval: '{field} interval',
  fieldRangeStart: '{field} početak raspona',
  fieldRangeEnd: '{field} kraj raspona',
  fieldValues: '{field} vrijednosti',
  nextRun: 'Sljedeće pokretanje: {value}',
  noFutureRun: 'Nema budućeg trčanja',
  specialLastDay: 'zadnji dan svakog mjeseca',
  specialLastWeekday: 'zadnji radni dan svakog mjeseca',
  specialNearestWeekday: 'radni dan najbliži {day}. danu svakog mjeseca',
  specialLastDayOfWeek: 'zadnji {week} svakog mjeseca',
  specialNthDayOfWeek: '{nth} {week} svakog mjeseca',
  specialLast: 'Zadnji',
  specialNth: 'N.',
  nthLabels: {
    1: '1.',
    2: '2.',
    3: '3.',
    4: '4.',
    5: '5.',
  },
  validation: {
    invalidStep: 'Nevažeći izraz koraka',
    stepOutOfRange: 'Korak mora biti pozitivna vrijednost unutar raspona polja',
    invalidRange: 'Nevažeći izraz raspona',
    valueOutOfRange: 'Vrijednost mora biti između {min} i {max}',
    rangeOrder: 'Početak raspona ne smije biti veći od kraja raspona',
    fieldRequired: 'Polje je obavezno',
    questionMarkField: 'Upitnik je podržan samo za polja dana i tjedna',
    questionMarkAlone: 'Upitnik mora biti jedina vrijednost polja',
    unsupportedCharacter: 'Nepodržani znak u polju',
    expectedFields: 'Očekivana {count} polja za odabrani Quartz format',
    expectedUnixFields: 'Unix cron očekuje 5 polja',
    dayWeekQuestionMark: 'U Quartz izrazu polje dana ili tjedna mora biti ?, ali ne oboje',
    unixQuestionMark: 'Upitnik nije podržan u Unix cronu',
    unsupportedSpecial: 'Ova posebna sintaksa nije podržana',
    invalidExpression: 'Nevažeći cron izraz',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'Toplinska karta',
    less: 'Manje',
    more: 'Više',
    noData: 'Nema podataka',
    level: 'Razina',
  },
  InputTag: {
    clear: 'Očisti',
    showMore: 'Prikaži sve oznake',
  },
} satisfies ProLocale

export default proLocale
