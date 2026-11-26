import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/sk_SK'
import * as cronstrueSk from 'cronstrue/locales/sk.js'
import { defineCronDescriptionLocale } from '../cron/utils/description'

const cronLocale = {
  // 整句描述只带上当前语言，不再打包 cronstrue 的全部语言。
  descriptionLocale: defineCronDescriptionLocale('sk', cronstrueSk),
  fields: {
    second: 'sekunda',
    minute: 'minúta',
    hour: 'hodina',
    day: 'Deň',
    month: 'Mesiac',
    week: 'týždeň',
    year: 'rok',
  },
  modes: {
    every: 'Každý',
    interval: 'Interval',
    specified: 'Špecifikované',
    range: 'Rozsah',
    special: 'Špeciálne',
  },
  notSpecified: 'Neuvedené',
  everyField: 'Každých {field}',
  everyStep: 'Spúšťať každých {step} minút {field}',
  intervalField: 'Začať v minúty {start} a spúšťať každých {step} minút {field}',
  specifiedField: '{values}',
  rangeField: '{start} až {end}',
  unspecifiedDay: 'Deň nie je určený; použiť pole týždňa',
  unspecifiedWeek: 'Týždeň nie je určený; použiť pole dňa',
  valueSeparator: ', ',
  expression: 'Cron výraz',
  fieldList: 'Cron polia',
  fieldStart: '{field} začiatok',
  fieldInterval: '{field} interval',
  fieldRangeStart: '{field} začiatok rozsahu',
  fieldRangeEnd: '{field} koniec rozsahu',
  fieldValues: '{field} hodnôt',
  nextRun: 'Ďalšie spustenie: {value}',
  noFutureRun: 'Žiadny budúci beh',
  specialLastDay: 'posledný deň každého mesiaca',
  specialLastWeekday: 'posledný pracovný deň každého mesiaca',
  specialNearestWeekday: 'najbližší pracovný deň k {day}. dňu každého mesiaca',
  specialLastDayOfWeek: 'posledný {week} každého mesiaca',
  specialNthDayOfWeek: '{nth} {week} každého mesiaca',
  specialLast: 'Posledný',
  specialNth: 'N.',
  nthLabels: {
    1: '1.',
    2: '2.',
    3: '3.',
    4: '4.',
    5: '5.',
  },
  validation: {
    invalidStep: 'Neplatný výraz kroku',
    stepOutOfRange: 'Krok musí byť kladná hodnota v rámci rozsahu poľa',
    invalidRange: 'Neplatný výraz rozsahu',
    valueOutOfRange: 'Hodnota musí byť medzi {min} a {max}',
    rangeOrder: 'Začiatok rozsahu nesmie byť väčší ako koniec rozsahu',
    fieldRequired: 'pole je povinné',
    questionMarkField: 'Otáznik je podporovaný len pre polia dňa a týždňa',
    questionMarkAlone: 'Otáznik musí byť jedinou hodnotou poľa',
    unsupportedCharacter: 'Nepodporovaný znak v poli',
    expectedFields: 'Očakávaný počet polí pre vybratý formát Quartz: {count}',
    expectedUnixFields: 'Unix cron očakáva 5 polí',
    dayWeekQuestionMark: 'Vo výraze Quartz musí byť pole dňa alebo týždňa ?, ale nie obidve',
    unixQuestionMark: 'Otáznik nie je v Unix crone podporovaný',
    unsupportedSpecial: 'Táto špeciálna syntax nie je podporovaná',
    invalidExpression: 'Neplatný cron výraz',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  CategorySearch: {
    placeholder: 'Vyberte kategóriu alebo vyhľadajte',
    clear: 'Vymazať',
    confirm: 'OK',
    cancel: 'Zrušiť',
    selectAll: 'Vybrať všetko',
    min: 'Min.',
    max: 'Max.',
    rangeSeparator: ' ~ ',
    valueSeparator: ', ',
  },
  Cron: cronLocale,
  Heatmap: {
    label: 'Tepelná mapa',
    less: 'Menej',
    more: 'Viac',
    noData: 'Žiadne údaje',
    level: 'Úroveň',
  },
  InputTag: {
    clear: 'Vymazať',
    showMore: 'Zobraziť všetky štítky',
  },
} satisfies ProLocale

export default proLocale
