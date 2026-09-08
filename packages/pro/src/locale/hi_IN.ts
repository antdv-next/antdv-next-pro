import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/hi_IN'

const cronLocale: CronLocale = {
  fields: {
    second: 'सेकंड',
    minute: 'मिनट',
    hour: 'घंटा',
    day: 'दिन',
    month: 'महीना',
    week: 'सप्ताह',
    year: 'वर्ष',
  },
  modes: {
    every: 'प्रत्येक',
    interval: 'अंतराल',
    specified: 'निर्दिष्ट',
    range: 'रेंज',
    list: 'सूची',
  },
  any: 'कोई भी',
  notSpecified: 'निर्दिष्ट नहीं',
  every: 'प्रत्येक',
  everyField: 'प्रत्येक {field}',
  to: 'से',
  expression: 'क्रोन अभिव्यक्ति',
  fieldList: 'क्रॉन फ़ील्ड',
  fieldStart: '{field} प्रारंभ',
  fieldInterval: '{field} अंतराल',
  fieldRangeStart: '{field} रेंज प्रारंभ',
  fieldRangeEnd: '{field} सीमा समाप्त',
  fieldValue: '{field} मान',
  fieldValues: '{field} मान',
  nextRun: 'अगला रन: {value}',
  noFutureRun: 'कोई भविष्य नहीं',
  everySeconds: 'प्रत्येक {value} सेकंड',
  everyMinutes: 'हर {value} मिनट में',
  everyDayAt: 'प्रतिदिन {value} पर',
  customSchedule: 'कस्टम शेड्यूल',
  validation: {
    invalidStep: 'अमान्य चरण अभिव्यक्ति',
    stepOutOfRange: 'चरण फ़ील्ड सीमा के भीतर एक सकारात्मक मान होना चाहिए',
    invalidRange: 'अमान्य श्रेणी अभिव्यक्ति',
    valueOutOfRange: 'मान {min} और {max} के बीच होना चाहिए',
    rangeOrder: 'रेंज प्रारंभ, रेंज अंत से अधिक नहीं होना चाहिए',
    fieldRequired: 'फ़ील्ड आवश्यक है',
    questionMarkField: 'प्रश्न चिह्न केवल दिन और सप्ताह फ़ील्ड के लिए समर्थित है',
    questionMarkAlone: 'प्रश्न चिह्न ही एकमात्र फ़ील्ड मान होना चाहिए',
    unsupportedCharacter: 'फ़ील्ड में असमर्थित वर्ण',
    expectedFields: 'चयनित क्वार्ट्ज़ प्रारूप के लिए अपेक्षित {count} फ़ील्ड',
    dayWeekQuestionMark: 'क्वार्ट्ज अभिव्यक्ति में, या तो दिन फ़ील्ड या सप्ताह फ़ील्ड ? होनी चाहिए, लेकिन दोनों नहीं',
    invalidExpression: 'अमान्य क्रोन अभिव्यक्ति',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
