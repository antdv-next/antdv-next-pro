import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ne_NP'

const cronLocale: CronLocale = {
  fields: {
    second: 'सेकेन्ड',
    minute: 'मिनेट',
    hour: 'घण्टा',
    day: 'दिन',
    month: 'महिना',
    week: 'हप्ता',
    year: 'वर्ष',
  },
  modes: {
    every: 'हरेक',
    interval: 'अन्तराल',
    specified: 'निर्दिष्ट',
    range: 'दायरा',
    list: 'सूची',
  },
  any: 'कुनै पनि',
  notSpecified: 'निर्दिष्ट गरिएको छैन',
  every: 'हरेक',
  everyField: 'हरेक {field}',
  valueSeparator: ', ',
  to: 'देखि',
  expression: 'क्रोन अभिव्यक्ति',
  fieldList: 'क्रोन क्षेत्रहरू',
  fieldStart: '{field} सुरु',
  fieldInterval: '{field} अन्तराल',
  fieldRangeStart: '{field} दायरा सुरु',
  fieldRangeEnd: '{field} दायरा अन्त्य',
  fieldValue: '{field} मान',
  fieldValues: '{field} मानहरू',
  nextRun: 'अर्को रन: {value}',
  noFutureRun: 'कुनै भविष्य रन छैन',
  everySeconds: 'प्रत्येक {value} सेकेन्डमा',
  everyMinutes: 'हरेक {value} मिनेटमा',
  everyDayAt: 'हरेक दिन {value} बजे',
  customSchedule: 'अनुकूलन तालिका',
  validation: {
    invalidStep: 'अवैध चरण अभिव्यक्ति',
    stepOutOfRange: 'चरण क्षेत्र दायरा भित्र सकारात्मक मान हुनुपर्छ',
    invalidRange: 'अमान्य दायरा अभिव्यक्ति',
    valueOutOfRange: 'मान {min} र {max} बीचको हुनुपर्छ',
    rangeOrder: 'दायरा सुरु दायरा अन्त्य भन्दा ठूलो हुनु हुँदैन',
    fieldRequired: 'क्षेत्र आवश्यक छ',
    questionMarkField: 'प्रश्न चिन्ह दिन र हप्ता क्षेत्रहरूको लागि मात्र समर्थित छ',
    questionMarkAlone: 'प्रश्न चिन्ह मात्र क्षेत्र मान हुनुपर्छ',
    unsupportedCharacter: 'क्षेत्रमा असमर्थित वर्ण',
    expectedFields: 'चयनित क्वार्ट्ज ढाँचाको लागि अपेक्षित {count} क्षेत्रहरू',
    dayWeekQuestionMark: 'क्वार्ट्ज अभिव्यक्तिमा, या त दिन फिल्ड वा हप्ता फिल्ड ? हुनुपर्छ, तर दुबै होइन',
    invalidExpression: 'अमान्य क्रोन अभिव्यक्ति',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
