import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/mn_MN'

const cronLocale: CronLocale = {
  fields: {
    second: 'секунд',
    minute: 'Минут',
    hour: 'Цаг',
    day: 'Өдөр',
    month: 'Сар',
    week: 'долоо хоног',
    year: 'Он',
  },
  modes: {
    every: 'Бүр',
    interval: 'Интервал',
    specified: 'Тодорхойлсон',
    range: 'Хүрээ',
    list: 'Жагсаалт',
  },
  any: 'Ямар ч',
  notSpecified: 'Тодорхойлоогүй',
  every: 'бүр',
  everyField: '{field} бүр',
  valueSeparator: ', ',
  to: 'хүртэл',
  expression: 'Кроны илэрхийлэл',
  fieldList: 'Крон талбарууд',
  fieldStart: '{field} эхлэх',
  fieldInterval: '{field} интервал',
  fieldRangeStart: '{field} хүрээний эхлэл',
  fieldRangeEnd: '{field} хүрээний төгсгөл',
  fieldValue: '{field} утга',
  fieldValues: '{field} утга',
  nextRun: 'Дараагийн гүйлт: {value}',
  noFutureRun: 'Цаашид гүйлт байхгүй',
  everySeconds: '{value} секунд тутамд',
  everyMinutes: '{value} минут тутамд',
  everyDayAt: 'Өдөр бүр {value}-д',
  customSchedule: 'Захиалгат хуваарь',
  validation: {
    invalidStep: 'Алхам илэрхийлэл буруу',
    stepOutOfRange: 'Алхам нь талбарын хүрээнд эерэг утгатай байх ёстой',
    invalidRange: 'Мужийн илэрхийлэл буруу',
    valueOutOfRange: 'Утга нь {min}-с {max} хооронд байх ёстой',
    rangeOrder: 'Хүрээний эхлэл нь хүрээний төгсгөлөөс их байж болохгүй',
    fieldRequired: 'Талбар оруулах шаардлагатай',
    questionMarkField: 'Асуултын тэмдгийг зөвхөн өдөр, долоо хоногийн талбарт дэмждэг',
    questionMarkAlone: 'Асуултын тэмдэг нь талбарын цорын ганц утга байх ёстой',
    unsupportedCharacter: 'Талбарт дэмжигдээгүй тэмдэгт байна',
    expectedFields: 'Сонгосон кварц форматын хувьд хүлээгдэж буй {count} талбар',
    dayWeekQuestionMark: 'Кварцын илэрхийлэлд өдрийн талбар эсвэл долоо хоногийн талбар нь ? байх ёстой, гэхдээ хоёуланг нь биш.',
    invalidExpression: 'Cron илэрхийлэл буруу',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
