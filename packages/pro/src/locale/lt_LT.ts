import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/lt_LT'

const cronLocale: CronLocale = {
  fields: {
    second: 'sekundė',
    minute: 'Minutė',
    hour: 'valanda',
    day: 'diena',
    month: 'Mėnuo',
    week: 'Savaitė',
    year: 'Metai',
  },
  modes: {
    every: 'Kas',
    interval: 'Intervalas',
    specified: 'Nurodyta',
    range: 'Diapazonas',
    list: 'Sąrašas',
  },
  any: 'Bet koks',
  notSpecified: 'Nenurodyta',
  every: 'kas',
  everyField: 'Kas {field}',
  valueSeparator: ', ',
  to: 'iki',
  expression: 'Cron išraiška',
  fieldList: 'Cron laukai',
  fieldStart: '{field} pradžia',
  fieldInterval: '{field} intervalas',
  fieldRangeStart: '{field} diapazono pradžia',
  fieldRangeEnd: '{field} diapazono pabaiga',
  fieldValue: '{field} vertė',
  fieldValues: '{field} vertės',
  nextRun: 'Kitas paleidimas: {value}',
  noFutureRun: 'Jokio paleidimo ateityje',
  everySeconds: 'Kas {value} sek',
  everyMinutes: 'Kas {value} min',
  everyDayAt: 'Kiekvieną dieną {value}',
  customSchedule: 'Pasirinktinis tvarkaraštis',
  validation: {
    invalidStep: 'Netinkama žingsnio išraiška',
    stepOutOfRange: 'Veiksmas turi būti teigiama reikšmė lauko diapazone',
    invalidRange: 'Neteisinga diapazono išraiška',
    valueOutOfRange: 'Reikšmė turi būti nuo {min} iki {max}',
    rangeOrder: 'Diapazono pradžia neturi būti didesnė už diapazono pabaigą',
    fieldRequired: 'Lauką būtina užpildyti',
    questionMarkField: 'Klaustukas palaikomas tik dienos ir savaitės laukuose',
    questionMarkAlone: 'Klaustukas turi būti vienintelė lauko reikšmė',
    unsupportedCharacter: 'Nepalaikomas simbolis lauke',
    expectedFields: 'Numatyta {count} laukų pasirinktam kvarco formatui',
    dayWeekQuestionMark: 'Kvarco išraiškoje dienos arba savaitės laukas turi būti ?, bet ne abu',
    invalidExpression: 'Neteisinga cron išraiška',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
