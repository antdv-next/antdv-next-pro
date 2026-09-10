import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ko_KR'

const cronLocale: CronLocale = {
  fields: {
    second: '초',
    minute: '분',
    hour: '시',
    day: '일',
    month: '월',
    week: '주',
    year: '연도',
  },
  modes: {
    every: '매',
    interval: '간격',
    specified: '지정됨',
    range: '범위',
    list: '목록',
  },
  any: '모두',
  notSpecified: '지정되지 않음',
  every: '마다',
  everyField: '매 {field}',
  valueSeparator: ', ',
  to: '~에게',
  expression: '크론 표현',
  fieldList: '크론 필드',
  fieldStart: '{field} 시작',
  fieldInterval: '{field} 간격',
  fieldRangeStart: '{field} 범위 시작',
  fieldRangeEnd: '{field} 범위 끝',
  fieldValue: '{field} 값',
  fieldValues: '{field} 값',
  nextRun: '다음 실행: {value}',
  noFutureRun: '향후 실행 없음',
  everySeconds: '매 {value}초마다',
  everyMinutes: '매 {value}분마다',
  everyDayAt: '매일 {value}에',
  customSchedule: '맞춤 일정',
  validation: {
    invalidStep: '잘못된 단계 표현',
    stepOutOfRange: '단계는 필드 범위 내에서 양수 값이어야 합니다.',
    invalidRange: '잘못된 범위 표현',
    valueOutOfRange: '값은 {min}에서 {max} 사이여야 합니다.',
    rangeOrder: '범위 시작은 범위 끝보다 클 수 없습니다.',
    fieldRequired: '필드는 필수입니다',
    questionMarkField: '물음표는 일 및 주 필드에만 지원됩니다.',
    questionMarkAlone: '물음표는 유일한 필드 값이어야 합니다',
    unsupportedCharacter: '필드에 지원되지 않는 문자가 있습니다.',
    expectedFields: '선택한 Quartz 형식에 대해 예상되는 {count} 필드',
    dayWeekQuestionMark: 'Quartz 표현식에서 일 필드 또는 주 필드는 ?여야 하지만 둘 다일 수는 없습니다.',
    invalidExpression: '잘못된 크론 표현',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
