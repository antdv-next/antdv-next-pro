import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/lt_LT'

const cronLocale = {
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
    special: 'Specialus',
  },
  notSpecified: 'Nenurodyta',
  everyField: 'Kas {field}',
  everyStep: 'Vykdyti kas {step} minučių {field}',
  intervalField: 'Pradėti nuo {field} {start} ir vykdyti kas {step} minučių',
  specifiedField: '{values}',
  rangeField: '{start} iki {end}',
  unspecifiedDay: 'Diena nenurodyta; naudoti savaitės lauką',
  unspecifiedWeek: 'Savaitė nenurodyta; naudoti dienos lauką',
  valueSeparator: ', ',
  expression: 'Cron išraiška',
  fieldList: 'Cron laukai',
  fieldStart: '{field} pradžia',
  fieldInterval: '{field} intervalas',
  fieldRangeStart: '{field} diapazono pradžia',
  fieldRangeEnd: '{field} diapazono pabaiga',
  fieldValues: '{field} vertės',
  nextRun: 'Kitas paleidimas: {value}',
  noFutureRun: 'Jokio paleidimo ateityje',
  specialLastDay: 'paskutinė kiekvieno mėnesio diena',
  specialLastWeekday: 'paskutinė kiekvieno mėnesio darbo diena',
  specialNearestWeekday: 'artimiausia darbo diena {day}-ai kiekvieno mėnesio dienai',
  specialLastDayOfWeek: 'paskutinė kiekvieno mėnesio {week}',
  specialNthDayOfWeek: '{nth} kiekvieno mėnesio {week}',
  specialLast: 'Paskutinė',
  specialNth: 'N.',
  nthLabels: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  },
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
    expectedUnixFields: 'Unix cron tikisi 5 laukų',
    dayWeekQuestionMark: 'Kvarco išraiškoje dienos arba savaitės laukas turi būti ?, bet ne abu',
    unixQuestionMark: 'Klaustukas Unix cron nepalaikomas',
    unsupportedSpecial: 'Ši speciali sintaksė nepalaikoma',
    invalidExpression: 'Neteisinga cron išraiška',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'Šilumos žemėlapis',
    less: 'Mažiau',
    more: 'Daugiau',
    noData: 'Duomenų nėra',
    level: 'Lygis',
  },
  InputTag: {
    clear: 'Išvalyti',
    showMore: 'Rodyti visas žymas',
  },
} satisfies ProLocale

export default proLocale
