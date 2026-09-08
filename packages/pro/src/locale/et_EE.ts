import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/et_EE'

const cronLocale: CronLocale = {
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
    list: 'Loend',
  },
  any: 'Igasugune',
  notSpecified: 'Pole täpsustatud',
  every: 'iga',
  everyField: 'Iga {field}',
  to: 'kuni',
  expression: 'Cron avaldis',
  fieldList: 'Cron väljad',
  fieldStart: '{field} algus',
  fieldInterval: '{field} intervall',
  fieldRangeStart: '{field} vahemiku algus',
  fieldRangeEnd: '{field} vahemiku lõpp',
  fieldValue: '{field} väärtus',
  fieldValues: '{field} väärtust',
  nextRun: 'Järgmine kord: {value}',
  noFutureRun: 'Tulevikus ei käitata',
  everySeconds: 'Iga {value} sekundi järel',
  everyMinutes: 'Iga {value} minuti järel',
  everyDayAt: 'Iga päev kell {value}',
  customSchedule: 'Kohandatud ajakava',
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
    dayWeekQuestionMark: 'Quartz-avaldises peab päeva või nädala väli olema ?, kuid mitte mõlemad',
    invalidExpression: 'Vigane cron-avaldis',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
