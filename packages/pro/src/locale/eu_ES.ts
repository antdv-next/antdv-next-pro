import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/eu_ES'

const cronLocale: CronLocale = {
  fields: {
    second: 'Bigarren',
    minute: 'Minutua',
    hour: 'Ordua',
    day: 'Eguna',
    month: 'Hilabetea',
    week: 'Astea',
    year: 'Urtea',
  },
  modes: {
    every: 'Bakoitzak',
    interval: 'Tartea',
    specified: 'Zehaztuta',
    range: 'Barrutia',
    list: 'Zerrenda',
  },
  any: 'Edozein',
  notSpecified: 'Ez da zehaztu',
  every: 'bakoitzean',
  everyField: '{field} behin',
  to: 'to',
  expression: 'Cron adierazpena',
  fieldList: 'Cron eremuak',
  fieldStart: '{field} hasi',
  fieldInterval: '{field} tartea',
  fieldRangeStart: '{field} barrutiaren hasiera',
  fieldRangeEnd: '{field} barrutiaren amaiera',
  fieldValue: '{field} balioa',
  fieldValues: '{field} balioak',
  nextRun: 'Hurrengo lasterketa: {value}',
  noFutureRun: 'Etorkizuneko lasterketarik ez',
  everySeconds: '{value} segundoro',
  everyMinutes: '{value} minuturo',
  everyDayAt: 'Egunero {value}',
  customSchedule: 'Ordutegi pertsonalizatua',
  validation: {
    invalidStep: 'Urratsaren adierazpen baliogabea',
    stepOutOfRange: 'Urratsak balio positiboa izan behar du eremu barrutian',
    invalidRange: 'Barrutiaren adierazpen baliogabea',
    valueOutOfRange: 'Balioak {min} eta {max} artean egon behar du',
    rangeOrder: 'Barrutiaren hasiera ezin da izan barrutiaren amaiera baino handiagoa',
    fieldRequired: 'Eremua beharrezkoa da',
    questionMarkField: 'Galdera-ikurra eguneko eta asteko eremuetarako soilik onartzen da',
    questionMarkAlone: 'Galdera-markak eremuaren balio bakarra izan behar du',
    unsupportedCharacter: 'Onartu gabeko karakterea eremuan',
    expectedFields: '{count} eremu espero ziren hautatutako Quartz formatuan',
    dayWeekQuestionMark: 'Quartz adierazpen batean, egun eremuak edo aste eremuak ? izan behar du, baina ez biak',
    invalidExpression: 'Cron adierazpen baliogabea',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
