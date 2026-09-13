import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/si_LK'

const cronLocale = {
  fields: {
    second: 'දෙවන',
    minute: 'මිනිත්තු',
    hour: 'පැය',
    day: 'දින',
    month: 'මාසය',
    week: 'සතිය',
    year: 'වසර',
  },
  modes: {
    every: 'සෑම',
    interval: 'විරාමය',
    specified: 'නිශ්චිතව දක්වා ඇත',
    range: 'පරාසය',
    special: 'විශේෂ',
  },
  notSpecified: 'නිශ්චිතව දක්වා නැත',
  everyField: 'සෑම {field}',
  everyStep: 'සෑම {step} {field} ක් ක්‍රියාත්මක කරන්න',
  intervalField: 'ව {start} සිට ආරම්භ කර, පසුව සෑම {step} {field} ක් ක්‍රියාත්මක කරන්න',
  specifiedField: '{values}',
  rangeField: '{start} දක්වා {end}',
  unspecifiedDay: 'දිනය දක්වා නැත; සතිය ක්ෂේත්‍රය අනුගමනය කරන්න',
  unspecifiedWeek: 'සතිය දක්වා නැත; දින ක්ෂේත්‍රය අනුගමනය කරන්න',
  valueSeparator: ', ',
  expression: 'ක්‍රොන් ප්‍රකාශනය',
  fieldList: 'ක්‍රොන් ක්ෂේත්‍ර',
  fieldStart: '{field} ආරම්භය',
  fieldInterval: '{field} පරතරය',
  fieldRangeStart: '{field} පරාසය ආරම්භය',
  fieldRangeEnd: '{field} පරාසය අවසානය',
  fieldValues: '{field} අගයන්',
  nextRun: 'මීළඟ ධාවනය: {value}',
  noFutureRun: 'අනාගත ධාවනය නැත',
  specialLastDay: 'සෑම මසකම අවසාන දිනය',
  specialLastWeekday: 'සෑම මසකම අවසාන වැඩ දිනය',
  specialNearestWeekday: 'සෑම මසකම {day} වන දිනට ආසන්නතම වැඩ දිනය',
  specialLastDayOfWeek: 'සෑම මසකම අවසාන {week}',
  specialNthDayOfWeek: 'සෑම මසකම {nth} {week}',
  specialLast: 'අවසාන',
  specialNth: 'n වන',
  nthLabels: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  },
  validation: {
    invalidStep: 'වලංගු නොවන පියවර ප්‍රකාශනය',
    stepOutOfRange: 'පියවර ක්ෂේත්‍ර පරාසය තුළ ධන අගයක් විය යුතුය',
    invalidRange: 'වලංගු නොවන පරාස ප්‍රකාශනය',
    valueOutOfRange: 'අගය {min} සහ {max} අතර විය යුතුය',
    rangeOrder: 'පරාසය ආරම්භය පරාසයේ අවසානයට වඩා වැඩි නොවිය යුතුය',
    fieldRequired: 'ක්ෂේත්‍රය අවශ්‍යයි',
    questionMarkField: 'ප්‍රශ්න ලකුණ දින සහ සති ක්ෂේත්‍ර සඳහා පමණක් සහාය දක්වයි',
    questionMarkAlone: 'ප්‍රශ්න ලකුණ එකම ක්ෂේත්‍ර අගය විය යුතුය',
    unsupportedCharacter: 'ක්ෂේත්‍රයේ සහාය නොදක්වන චරිතය',
    expectedFields: 'තෝරාගත් ක්වාර්ට්ස් ආකෘතිය සඳහා ක්ෂේත්‍ර {count}ක් අපේක්ෂා කෙරේ',
    expectedUnixFields: 'Unix cron සඳහා ක්ෂේත්ර 5ක් අවශ්යයි',
    dayWeekQuestionMark: 'ක්වාර්ට්ස් ප්‍රකාශනයක, දින ක්ෂේත්‍රය හෝ සති ක්ෂේත්‍රය ? විය යුතුය, නමුත් දෙකම නොවේ',
    unixQuestionMark: 'Unix cron හි ප්රශ්න ලකුණ සහාය නොදක්වයි',
    unsupportedSpecial: 'මෙම විශේෂ වාග් රීතිය සහාය නොදක්වයි',
    invalidExpression: 'වලංගු නොවන ක්‍රෝන් ප්‍රකාශනය',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'තාප සිතියම',
    less: 'අඩු',
    more: 'වැඩි',
    noData: 'දත්ත නැත',
    level: 'මට්ටම',
  },
  InputTag: {
    clear: 'හිස් කරන්න',
    showMore: 'සියලු ටැග් පෙන්වන්න',
  },
} satisfies ProLocale

export default proLocale
