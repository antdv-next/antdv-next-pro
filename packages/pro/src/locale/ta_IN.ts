import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ta_IN'

const cronLocale = {
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
    special: 'சிறப்பு',
  },
  notSpecified: 'குறிப்பிடப்படவில்லை',
  everyField: 'ஒவ்வொரு {field}',
  everyStep: 'ஒவ்வொரு {step} {field} இயக்கவும்',
  intervalField: ' {start} இல் தொடங்கி, பிறகு ஒவ்வொரு {step} {field} இயக்கவும்',
  specifiedField: '{values}',
  rangeField: '{start} முதல் {end}',
  unspecifiedDay: 'நாள் குறிப்பிடப்படவில்லை; வாரம் புலத்தைப் பின்பற்றவும்',
  unspecifiedWeek: 'வாரம் குறிப்பிடப்படவில்லை; நாள் புலத்தைப் பின்பற்றவும்',
  valueSeparator: ', ',
  expression: 'கிரான் வெளிப்பாடு',
  fieldList: 'கிரான் புலங்கள்',
  fieldStart: '{field} தொடக்கம்',
  fieldInterval: '{field} இடைவெளி',
  fieldRangeStart: '{field} வரம்பு தொடக்கம்',
  fieldRangeEnd: '{field} வரம்பு முடிவு',
  fieldValues: '{field} மதிப்புகள்',
  nextRun: 'அடுத்த ஓட்டம்: {value}',
  noFutureRun: 'எதிர்கால ஓட்டம் இல்லை',
  specialLastDay: 'ஒவ்வொரு மாதத்தின் கடைசி நாள்',
  specialLastWeekday: 'ஒவ்வொரு மாதத்தின் கடைசி வேலை நாள்',
  specialNearestWeekday: 'ஒவ்வொரு மாதமும் {day} ஆம் நாளுக்கு அருகிலுள்ள வேலை நாள்',
  specialLastDayOfWeek: 'ஒவ்வொரு மாதத்தின் கடைசி {week}',
  specialNthDayOfWeek: 'ஒவ்வொரு மாதத்தின் {nth} {week}',
  specialLast: 'கடைசி',
  specialNth: 'n-ஆம்',
  nthLabels: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  },
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
    expectedUnixFields: 'Unix cron-க்கு 5 புலங்கள் தேவை',
    dayWeekQuestionMark: 'குவார்ட்ஸ் வெளிப்பாட்டில், நாள் புலம் அல்லது வாரப் புலமானது ? ஆக இருக்க வேண்டும், ஆனால் இரண்டும் அல்ல',
    unixQuestionMark: 'Unix cron-இல் கேள்விக்குறி ஆதரிக்கப்படாது',
    unsupportedSpecial: 'இந்த சிறப்பு தொடரியல் ஆதரிக்கப்படாது',
    invalidExpression: 'தவறான கிரான் வெளிப்பாடு',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'வெப்ப வரைபடம்',
    less: 'குறைவு',
    more: 'அதிகம்',
    noData: 'தரவு இல்லை',
    level: 'நிலை',
  },
  InputTag: {
    clear: 'அழி',
    showMore: 'அனைத்து குறிச்சொற்களையும் காட்டு',
  },
} satisfies ProLocale

export default proLocale
