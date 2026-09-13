import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/et_EE'

const cronLocale = {
  fields: {
    second: 'sekund',
    minute: 'Minut',
    hour: 'tund',
    day: 'päev',
    month: 'Kuu',
    week: 'Nädal',
    year: 'Aasta',
  },
  modes: {
    every: 'Iga',
    interval: 'Intervall',
    specified: 'Määratud',
    range: 'Vahemik',
    special: 'Eriline',
  },
  notSpecified: 'Pole täpsustatud',
  everyField: 'Iga {field}',
  everyStep: 'Käivita iga {step} {field}i järel',
  intervalField: 'Alusta  {start} juurest ja käivita iga {step} {field}i järel',
  specifiedField: '{values}',
  rangeField: '{start} kuni {end}',
  unspecifiedDay: 'Päev pole määratud; kasuta nädala välja',
  unspecifiedWeek: 'Nädal pole määratud; kasuta päeva välja',
  valueSeparator: ', ',
  expression: 'Cron avaldis',
  fieldList: 'Cron väljad',
  fieldStart: '{field} algus',
  fieldInterval: '{field} intervall',
  fieldRangeStart: '{field} vahemiku algus',
  fieldRangeEnd: '{field} vahemiku lõpp',
  fieldValues: '{field} väärtust',
  nextRun: 'Järgmine kord: {value}',
  noFutureRun: 'Tulevikus ei käitata',
  specialLastDay: 'igakuine viimane päev',
  specialLastWeekday: 'igakuine viimane tööpäev',
  specialNearestWeekday: 'tööpäev, mis on lähim kuu {day}. päevale',
  specialLastDayOfWeek: 'igakuine viimane {week}',
  specialNthDayOfWeek: 'igakuine {nth} {week}',
  specialLast: 'Viimane',
  specialNth: 'N.',
  nthLabels: {
    1: '1.',
    2: '2.',
    3: '3.',
    4: '4.',
    5: '5.',
  },
  validation: {
    invalidStep: 'Sobimatu sammuavaldis',
    stepOutOfRange: 'Samm peab olema positiivne väärtus väljavahemikus',
    invalidRange: 'Kehtetu vahemiku avaldis',
    valueOutOfRange: 'Väärtus peab olema vahemikus {min} kuni {max}',
    rangeOrder: 'Vahemiku algus ei tohi olla suurem kui vahemiku lõpp',
    fieldRequired: 'Väli on kohustuslik',
    questionMarkField: 'Küsimärki toetatakse ainult päeva- ja nädalaväljade puhul',
    questionMarkAlone: 'Küsimärk peab olema ainus välja väärtus',
    unsupportedCharacter: 'Toetamata märk väljal',
    expectedFields: 'Valitud kvartsvormingus on oodata {count} välja',
    expectedUnixFields: 'Unix cron ootab 5 välja',
    dayWeekQuestionMark: 'Quartz-avaldises peab päeva või nädala väli olema ?, kuid mitte mõlemad',
    unixQuestionMark: 'Küsimärki Unix cron ei toeta',
    unsupportedSpecial: 'Seda erisüntaksit ei toetata',
    invalidExpression: 'Vigane cron-avaldis',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'Kuumuskaart',
    less: 'Vähem',
    more: 'Rohkem',
    noData: 'Andmed puuduvad',
    level: 'Tase',
  },
  InputTag: {
    clear: 'Tühjenda',
    showMore: 'Kuva kõik sildid',
  },
} satisfies ProLocale

export default proLocale
