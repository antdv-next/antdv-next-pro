import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ta_IN'

const cronLocale: CronLocale = {
  fields: {
    second: 'இரண்டாவது',
    minute: 'நிமிடம்',
    hour: 'மணிநேரம்',
    day: 'நாள்',
    month: 'மாதம்',
    week: 'வாரம்',
    year: 'ஆண்டு',
  },
  modes: {
    every: 'ஒவ்வொரு',
    interval: 'இடைவெளி',
    specified: 'குறிப்பிடப்பட்டுள்ளது',
    range: 'வரம்பு',
    list: 'பட்டியல்',
  },
  any: 'ஏதேனும்',
  notSpecified: 'குறிப்பிடப்படவில்லை',
  every: 'ஒவ்வொரு',
  everyField: 'ஒவ்வொரு {field}',
  to: 'முதல்',
  expression: 'கிரான் வெளிப்பாடு',
  fieldList: 'கிரான் புலங்கள்',
  fieldStart: '{field} தொடக்கம்',
  fieldInterval: '{field} இடைவெளி',
  fieldRangeStart: '{field} வரம்பு தொடக்கம்',
  fieldRangeEnd: '{field} வரம்பு முடிவு',
  fieldValue: '{field} மதிப்பு',
  fieldValues: '{field} மதிப்புகள்',
  nextRun: 'அடுத்த ஓட்டம்: {value}',
  noFutureRun: 'எதிர்கால ஓட்டம் இல்லை',
  everySeconds: 'ஒவ்வொரு {value} வினாடிகளுக்கும்',
  everyMinutes: 'ஒவ்வொரு {value} நிமிடங்களுக்கும்',
  everyDayAt: 'ஒவ்வொரு நாளும் {value} மணிக்கு',
  customSchedule: 'தனிப்பயன் அட்டவணை',
  validation: {
    invalidStep: 'தவறான படி வெளிப்பாடு',
    stepOutOfRange: 'படியானது புல வரம்பிற்குள் நேர்மறை மதிப்பாக இருக்க வேண்டும்',
    invalidRange: 'தவறான வரம்பு வெளிப்பாடு',
    valueOutOfRange: 'மதிப்பு {min} மற்றும் {max} க்கு இடையில் இருக்க வேண்டும்',
    rangeOrder: 'வரம்பு தொடக்கமானது வரம்பு முடிவை விட அதிகமாக இருக்கக்கூடாது',
    fieldRequired: 'புலம் தேவை',
    questionMarkField: 'கேள்விக்குறி நாள் மற்றும் வார புலங்களுக்கு மட்டுமே ஆதரிக்கப்படும்',
    questionMarkAlone: 'கேள்விக்குறி மட்டுமே புல மதிப்பாக இருக்க வேண்டும்',
    unsupportedCharacter: 'புலத்தில் ஆதரிக்கப்படாத எழுத்து',
    expectedFields: 'தேர்ந்தெடுக்கப்பட்ட குவார்ட்ஸ் வடிவமைப்பிற்கு எதிர்பார்க்கப்படும் {count} புலங்கள்',
    dayWeekQuestionMark: 'குவார்ட்ஸ் வெளிப்பாட்டில், நாள் புலம் அல்லது வாரப் புலமானது ? ஆக இருக்க வேண்டும், ஆனால் இரண்டும் அல்ல',
    invalidExpression: 'தவறான கிரான் வெளிப்பாடு',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
