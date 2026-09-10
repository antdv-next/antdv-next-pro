import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/si_LK'

const cronLocale: CronLocale = {
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
    list: 'ලැයිස්තුව',
  },
  any: 'ඕනෑම',
  notSpecified: 'නිශ්චිතව දක්වා නැත',
  every: 'සෑම',
  everyField: 'සෑම {field}',
  valueSeparator: ', ',
  to: 'දක්වා',
  expression: 'ක්‍රොන් ප්‍රකාශනය',
  fieldList: 'ක්‍රොන් ක්ෂේත්‍ර',
  fieldStart: '{field} ආරම්භය',
  fieldInterval: '{field} පරතරය',
  fieldRangeStart: '{field} පරාසය ආරම්භය',
  fieldRangeEnd: '{field} පරාසය අවසානය',
  fieldValue: '{field} අගය',
  fieldValues: '{field} අගයන්',
  nextRun: 'මීළඟ ධාවනය: {value}',
  noFutureRun: 'අනාගත ධාවනය නැත',
  everySeconds: 'සෑම තත්පර {value}කම',
  everyMinutes: 'සෑම විනාඩි {value}කම',
  everyDayAt: 'සෑම දිනකම {value} ට',
  customSchedule: 'අභිරුචි කාලසටහන',
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
    dayWeekQuestionMark: 'ක්වාර්ට්ස් ප්‍රකාශනයක, දින ක්ෂේත්‍රය හෝ සති ක්ෂේත්‍රය ? විය යුතුය, නමුත් දෙකම නොවේ',
    invalidExpression: 'වලංගු නොවන ක්‍රෝන් ප්‍රකාශනය',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
