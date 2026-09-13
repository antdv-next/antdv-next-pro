import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/hi_IN'

const cronLocale = {
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
    special: 'विशेष',
  },
  notSpecified: 'निर्दिष्ट नहीं',
  everyField: 'प्रत्येक {field}',
  everyStep: 'हर {step} {field} चलाएँ',
  intervalField: ' {start} से शुरू करें, फिर हर {step} {field} चलाएँ',
  specifiedField: '{values}',
  rangeField: '{start} से {end}',
  unspecifiedDay: 'दिन निर्दिष्ट नहीं है; सप्ताह फ़ील्ड का पालन करें',
  unspecifiedWeek: 'सप्ताह निर्दिष्ट नहीं है; दिन फ़ील्ड का पालन करें',
  valueSeparator: ', ',
  expression: 'क्रोन अभिव्यक्ति',
  fieldList: 'क्रॉन फ़ील्ड',
  fieldStart: '{field} प्रारंभ',
  fieldInterval: '{field} अंतराल',
  fieldRangeStart: '{field} रेंज प्रारंभ',
  fieldRangeEnd: '{field} सीमा समाप्त',
  fieldValues: '{field} मान',
  nextRun: 'अगला रन: {value}',
  noFutureRun: 'कोई भविष्य नहीं',
  specialLastDay: 'प्रत्येक माह का अंतिम दिन',
  specialLastWeekday: 'प्रत्येक माह का अंतिम कार्यदिवस',
  specialNearestWeekday: 'प्रत्येक माह के दिन {day} के निकटतम कार्यदिवस',
  specialLastDayOfWeek: 'प्रत्येक माह का अंतिम {week}',
  specialNthDayOfWeek: 'प्रत्येक माह का {nth} {week}',
  specialLast: 'अंतिम',
  specialNth: 'nवाँ',
  nthLabels: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  },
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
    expectedUnixFields: 'Unix cron के लिए 5 फ़ील्ड चाहिए',
    dayWeekQuestionMark: 'क्वार्ट्ज अभिव्यक्ति में, या तो दिन फ़ील्ड या सप्ताह फ़ील्ड ? होनी चाहिए, लेकिन दोनों नहीं',
    unixQuestionMark: 'Unix cron में प्रश्न चिह्न समर्थित नहीं है',
    unsupportedSpecial: 'यह विशेष वाक्य रचना समर्थित नहीं है',
    invalidExpression: 'अमान्य क्रोन अभिव्यक्ति',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'हीटमैप',
    less: 'कम',
    more: 'अधिक',
    noData: 'कोई डेटा नहीं',
    level: 'स्तर',
  },
  InputTag: {
    clear: 'साफ़ करें',
    showMore: 'सभी टैग दिखाएँ',
  },
} satisfies ProLocale

export default proLocale
