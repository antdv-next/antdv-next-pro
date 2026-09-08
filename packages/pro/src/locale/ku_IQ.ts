import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ku_IQ'

const cronLocale: CronLocale = {
  fields: {
    second: 'Duyem',
    minute: 'Deqe',
    hour: 'Saet',
    day: 'Roj',
    month: 'Meh',
    week: 'Hefteyê',
    year: 'Sal',
  },
  modes: {
    every: 'Her',
    interval: 'Navber',
    specified: 'diyar kirin',
    range: 'Rêze',
    list: 'Lîsteya',
  },
  any: 'Her kes',
  notSpecified: 'Ne diyar e',
  every: 'her',
  everyField: 'Her {field}',
  to: 'ber',
  expression: 'Cron îfade',
  fieldList: 'Zeviyên Cron',
  fieldStart: '{field} dest pê dike',
  fieldInterval: '{field} navber',
  fieldRangeStart: 'Rêjeya {field} dest pê dike',
  fieldRangeEnd: '{field} dawiya rêzê',
  fieldValue: '{field} nirx',
  fieldValues: '{field} nirx',
  nextRun: 'Rêvekirina Paşê: {value}',
  noFutureRun: 'Pêşeroj tune',
  everySeconds: 'Her {value} saniye',
  everyMinutes: 'Her {value} deqîqe',
  everyDayAt: 'Her roj li {value}',
  customSchedule: 'Bernameya xwerû',
  validation: {
    invalidStep: 'Gotina gavê nederbasdar',
    stepOutOfRange: 'Divê gav di nav qada zeviyê de nirxek erênî be',
    invalidRange: 'Ravekirina nederbasdar',
    valueOutOfRange: 'Divê nirx di navbera {min} û {max} de be',
    rangeOrder: 'Destpêka rêzê divê ji dawiya rêzê mezintir nebe',
    fieldRequired: 'Qad pêwîst e',
    questionMarkField: 'Nîşana pirsê tenê ji bo qadên roj û hefteyê tê piştgirî kirin',
    questionMarkAlone: 'Nîşana pirsê divê tenê nirxa zeviyê be',
    unsupportedCharacter: 'Karaktera nepiştgir li zeviyê',
    expectedFields: 'Ji bo forma Quartz a hilbijartî {count} qadên çaverêkirî',
    dayWeekQuestionMark: 'Di bêjeyeke Quartz de, divê qada rojê an qada heftê ? be, lê ne her du be.',
    invalidExpression: 'Ravekirina kron nederbasdar',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
