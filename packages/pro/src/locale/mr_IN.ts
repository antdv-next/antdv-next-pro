import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/mr_IN'

const cronLocale: CronLocale = {
  fields: {
    second: 'सेकंद',
    minute: 'मिनिट',
    hour: 'तास',
    day: 'दिवस',
    month: 'महिना',
    week: 'आठवडा',
    year: 'वर्ष',
  },
  modes: {
    every: 'प्रत्येक',
    interval: 'मध्यांतर',
    specified: 'निर्दिष्ट',
    range: 'श्रेणी',
    list: 'यादी',
  },
  any: 'कोणतीही',
  notSpecified: 'निर्दिष्ट नाही',
  every: 'प्रत्येक',
  everyField: 'प्रत्येक {field}',
  valueSeparator: ', ',
  to: 'ते',
  expression: 'क्रॉन अभिव्यक्ती',
  fieldList: 'क्रॉन फील्ड',
  fieldStart: '{field} प्रारंभ',
  fieldInterval: '{field} मध्यांतर',
  fieldRangeStart: '{field} श्रेणी प्रारंभ',
  fieldRangeEnd: '{field} श्रेणी समाप्त',
  fieldValue: '{field} मूल्य',
  fieldValues: '{field} मूल्ये',
  nextRun: 'पुढील रन: {value}',
  noFutureRun: 'भविष्यात कोणतीही धाव नाही',
  everySeconds: 'प्रत्येक {value} सेकंदांनी',
  everyMinutes: 'प्रत्येक {value} मिनिटांनी',
  everyDayAt: 'दररोज {value} वाजता',
  customSchedule: 'सानुकूल शेड्यूल',
  validation: {
    invalidStep: 'अवैध चरण अभिव्यक्ती',
    stepOutOfRange: 'पायरी फील्ड श्रेणीमध्ये सकारात्मक मूल्य असणे आवश्यक आहे',
    invalidRange: 'अवैध श्रेणी अभिव्यक्ती',
    valueOutOfRange: 'मूल्य {min} आणि {max} दरम्यान असणे आवश्यक आहे',
    rangeOrder: 'श्रेणी प्रारंभ श्रेणी समाप्तीपेक्षा मोठी नसावी',
    fieldRequired: 'फील्ड आवश्यक आहे',
    questionMarkField: 'प्रश्नचिन्ह फक्त दिवस आणि आठवड्याच्या फील्डसाठी समर्थित आहे',
    questionMarkAlone: 'प्रश्नचिन्ह हे एकमेव फील्ड मूल्य असणे आवश्यक आहे',
    unsupportedCharacter: 'फील्डमध्ये असमर्थित वर्ण',
    expectedFields: 'निवडलेल्या क्वार्ट्ज फॉरमॅटसाठी अपेक्षित {count} फील्ड',
    dayWeekQuestionMark: 'क्वार्ट्ज अभिव्यक्तीमध्ये, दिवस फील्ड किंवा आठवड्याचे फील्ड ? असणे आवश्यक आहे, परंतु दोन्ही नाही',
    invalidExpression: 'अवैध क्रॉन अभिव्यक्ती',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
