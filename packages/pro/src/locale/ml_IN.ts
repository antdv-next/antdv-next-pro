import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ml_IN'

const cronLocale: CronLocale = {
  fields: {
    second: 'സെക്കൻ്റ്',
    minute: 'മിനിറ്റ്',
    hour: 'മണിക്കൂർ',
    day: 'ദിവസം',
    month: 'മാസം',
    week: 'ആഴ്ച',
    year: 'വർഷം',
  },
  modes: {
    every: 'ഓരോന്നും',
    interval: 'ഇടവേള',
    specified: 'വ്യക്തമാക്കിയത്',
    range: 'ശ്രേണി',
    list: 'പട്ടിക',
  },
  any: 'ഏതെങ്കിലും',
  notSpecified: 'വ്യക്തമാക്കിയിട്ടില്ല',
  every: 'ഓരോന്നും',
  everyField: 'ഓരോ {field}',
  valueSeparator: ', ',
  to: 'വരെ',
  expression: 'ക്രോൺ എക്സ്പ്രഷൻ',
  fieldList: 'ക്രോൺ ഫീൽഡുകൾ',
  fieldStart: '{field} ആരംഭം',
  fieldInterval: '{field} ഇടവേള',
  fieldRangeStart: '{field} ശ്രേണി ആരംഭം',
  fieldRangeEnd: '{field} ശ്രേണി അവസാനം',
  fieldValue: '{field} മൂല്യം',
  fieldValues: '{field} മൂല്യങ്ങൾ',
  nextRun: 'അടുത്ത ഓട്ടം: {value}',
  noFutureRun: 'ഭാവിയിൽ റൺ ഇല്ല',
  everySeconds: 'ഓരോ {value} സെക്കൻഡിലും',
  everyMinutes: 'ഓരോ {value} മിനിറ്റിലും',
  everyDayAt: 'എല്ലാ ദിവസവും {value}-ന്',
  customSchedule: 'ഇഷ്‌ടാനുസൃത ഷെഡ്യൂൾ',
  validation: {
    invalidStep: 'അസാധുവായ സ്റ്റെപ്പ് എക്സ്പ്രഷൻ',
    stepOutOfRange: 'സ്റ്റെപ്പ് ഫീൽഡ് പരിധിക്കുള്ളിൽ പോസിറ്റീവ് മൂല്യമായിരിക്കണം',
    invalidRange: 'അസാധുവായ ശ്രേണി എക്സ്പ്രഷൻ',
    valueOutOfRange: 'മൂല്യം {min} നും {max} നും ഇടയിലായിരിക്കണം',
    rangeOrder: 'ശ്രേണി ആരംഭം പരിധി അവസാനിക്കുന്നതിനേക്കാൾ വലുതായിരിക്കരുത്',
    fieldRequired: 'ഫീൽഡ് ആവശ്യമാണ്',
    questionMarkField: 'ചോദ്യചിഹ്നം ദിവസം, ആഴ്‌ച ഫീൽഡുകൾക്കായി മാത്രമേ പിന്തുണയ്ക്കൂ',
    questionMarkAlone: 'ചോദ്യചിഹ്നം മാത്രമായിരിക്കണം ഫീൽഡ് മൂല്യം',
    unsupportedCharacter: 'ഫീൽഡിൽ പിന്തുണയ്ക്കാത്ത പ്രതീകം',
    expectedFields: 'തിരഞ്ഞെടുത്ത ക്വാർട്സ് ഫോർമാറ്റിനായി {count} ഫീൽഡുകൾ പ്രതീക്ഷിക്കുന്നു',
    dayWeekQuestionMark: 'ഒരു ക്വാർട്സ് എക്സ്പ്രഷനിൽ, ഡേ ഫീൽഡ് അല്ലെങ്കിൽ ആഴ്ച ഫീൽഡ് ? ആയിരിക്കണം, എന്നാൽ രണ്ടും അല്ല',
    invalidExpression: 'അസാധുവായ ക്രോൺ എക്സ്പ്രഷൻ',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
