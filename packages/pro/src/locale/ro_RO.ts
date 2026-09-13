import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ro_RO'

const cronLocale = {
  fields: {
    second: 'Al doilea',
    minute: 'Minut',
    hour: 'Ora',
    day: 'Zi',
    month: 'Luna',
    week: 'Săptămâna',
    year: 'An',
  },
  modes: {
    every: 'Fiecare',
    interval: 'Interval',
    specified: 'Specificat',
    range: 'Interval',
    special: 'Special',
  },
  notSpecified: 'Nespecificat',
  everyField: 'La fiecare {field}',
  everyStep: 'Execută la fiecare {step} {field}e',
  intervalField: 'Începe la  {start}, apoi execută la fiecare {step} {field}e',
  specifiedField: '{values}',
  rangeField: '{start} la {end}',
  unspecifiedDay: 'Ziua nu este specificată; urmează câmpul săptămânii',
  unspecifiedWeek: 'Săptămâna nu este specificată; urmează câmpul zilei',
  valueSeparator: ', ',
  expression: 'Expresia Cron',
  fieldList: 'Câmpuri Cron',
  fieldStart: '{field} începe',
  fieldInterval: '{field} interval',
  fieldRangeStart: '{field} început de interval',
  fieldRangeEnd: '{field} sfârşit interval',
  fieldValues: '{field} valori',
  nextRun: 'Următoarea rulare: {value}',
  noFutureRun: 'Nicio rulare viitoare',
  specialLastDay: 'ultima zi a fiecărei luni',
  specialLastWeekday: 'ultima zi lucrătoare a fiecărei luni',
  specialNearestWeekday: 'ziua lucrătoare cea mai apropiată de ziua {day} a fiecărei luni',
  specialLastDayOfWeek: 'ultima {week} a fiecărei luni',
  specialNthDayOfWeek: '{nth} {week} a fiecărei luni',
  specialLast: 'Ultima',
  specialNth: 'A n-a',
  nthLabels: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  },
  validation: {
    invalidStep: 'Expresie pas nevalidă',
    stepOutOfRange: 'Pasul trebuie să fie o valoare pozitivă în intervalul câmpului',
    invalidRange: 'Expresie de interval nevalidă',
    valueOutOfRange: 'Valoarea trebuie să fie între {min} și {max}',
    rangeOrder: 'Începutul intervalului nu trebuie să fie mai mare decât sfârșitul intervalului',
    fieldRequired: 'Câmpul este obligatoriu',
    questionMarkField: 'Semnul de întrebare este acceptat numai pentru câmpurile de zi și săptămână',
    questionMarkAlone: 'Semnul întrebării trebuie să fie singura valoare de câmp',
    unsupportedCharacter: 'Caracter neacceptat în câmp',
    expectedFields: 'Se așteptau {count} câmpuri pentru formatul Quartz selectat',
    expectedUnixFields: 'Unix cron așteaptă 5 câmpuri',
    dayWeekQuestionMark: 'Într-o expresie Quartz, fie câmpul zi, fie câmpul săptămânii trebuie să fie ?, dar nu ambele',
    unixQuestionMark: 'Semnul de întrebare nu este suportat în Unix cron',
    unsupportedSpecial: 'Această sintaxă specială nu este suportată',
    invalidExpression: 'Expresie cron nevalidă',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'Hartă termică',
    less: 'Mai puțin',
    more: 'Mai mult',
    noData: 'Nu există date',
    level: 'Nivel',
  },
  InputTag: {
    clear: 'Golește',
    showMore: 'Afișează toate etichetele',
  },
} satisfies ProLocale

export default proLocale
