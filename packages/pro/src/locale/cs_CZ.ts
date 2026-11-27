import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/cs_CZ'
import * as cronstrueCs from 'cronstrue/locales/cs.js'
import { defineCronDescriptionLocale } from '../cron/utils/description'

const cronLocale = {
  // 整句描述只带上当前语言，不再打包 cronstrue 的全部语言。
  descriptionLocale: defineCronDescriptionLocale('cs', cronstrueCs),
  fields: {
    second: 'sekunda',
    minute: 'minuta',
    hour: 'hodina',
    day: 'den',
    month: 'Měsíc',
    week: 'týden',
    year: 'rok',
  },
  modes: {
    every: 'Každý',
    interval: 'Interval',
    specified: 'Zadáno',
    range: 'Rozsah',
    special: 'Speciální',
  },
  notSpecified: 'Neuvedeno',
  everyField: 'Každých {field}',
  everyStep: 'Spouštět každých {step} minut {field}',
  intervalField: 'Začít v minuty {start} a spouštět každých {step} minut {field}',
  specifiedField: '{values}',
  rangeField: '{start} až {end}',
  unspecifiedDay: 'Den není určen; použít pole týdne',
  unspecifiedWeek: 'Týden není určen; použít pole dne',
  valueSeparator: ', ',
  expression: 'Cron výraz',
  fieldList: 'Cron pole',
  fieldStart: '{field}',
  fieldInterval: '{field} interval',
  fieldRangeStart: '{field} začátek rozsahu',
  fieldRangeEnd: '{field} konec rozsahu',
  fieldValues: '{field} hodnot',
  nextRun: 'Další spuštění: {value}',
  noFutureRun: 'Žádný budoucí běh',
  specialLastDay: 'poslední den každého měsíce',
  specialLastWeekday: 'poslední pracovní den každého měsíce',
  specialNearestWeekday: 'nejbližší pracovní den k {day}. dni každého měsíce',
  specialLastDayOfWeek: 'poslední {week} každého měsíce',
  specialNthDayOfWeek: '{nth} {week} každého měsíce',
  specialLast: 'Poslední',
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
    stepOutOfRange: 'Krok musí být kladná hodnota v rozsahu pole',
    invalidRange: 'Neplatný výraz rozsahu',
    valueOutOfRange: 'Hodnota musí být mezi {min} a {max}',
    rangeOrder: 'Začátek rozsahu nesmí být větší než konec rozsahu',
    fieldRequired: 'Pole je povinné',
    questionMarkField: 'Otazník je podporován pouze pro pole dne a týdne',
    questionMarkAlone: 'Otazník musí být jedinou hodnotou pole',
    unsupportedCharacter: 'Nepodporovaný znak v poli',
    expectedFields: 'Očekávaných polí: {count} pro vybraný formát Quartz',
    expectedUnixFields: 'Unix cron očekává 5 polí',
    dayWeekQuestionMark: 'Ve výrazu Quartz musí být buď pole dne nebo pole týdne ?, ale ne obojí',
    unixQuestionMark: 'Otazník není v Unix cron podporován',
    unsupportedSpecial: 'Tato speciální syntaxe není podporována',
    invalidExpression: 'Neplatný cron výraz',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  CategorySearch: {
    placeholder: 'Vyberte kategorii nebo hledejte',
    clear: 'Vymazat',
    confirm: 'OK',
    cancel: 'Zrušit',
    selectAll: 'Vybrat vše',
    min: 'Min.',
    max: 'Max.',
    rangeSeparator: ' ~ ',
    valueSeparator: ', ',
  },
  Code: {
    added: 'Added',
    removed: 'Removed',
  },
  Cron: cronLocale,
  Heatmap: {
    label: 'Tepelná mapa',
    less: 'Méně',
    more: 'Více',
    noData: 'Žádná data',
    level: 'Úroveň',
  },
  InputTag: {
    clear: 'Vymazat',
    showMore: 'Zobrazit všechny štítky',
  },
} satisfies ProLocale

export default proLocale
