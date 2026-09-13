import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/zh_TW'

const cronLocale = {
  fields: {
    second: '秒',
    minute: '分鐘',
    hour: '小時',
    day: '日',
    month: '月',
    week: '星期',
    year: '年',
  },
  modes: {
    every: '每',
    interval: '間隔',
    specified: '指定',
    range: '範圍',
    special: '特殊',
  },
  notSpecified: '不指定',
  everyField: '每{field}執行',
  everyStep: '每 {step} {field}執行',
  intervalField: '從 {start} 開始，每 {step} {field}執行',
  specifiedField: '{values}',
  rangeField: '從 {start} 到 {end}',
  unspecifiedDay: '不指定日期，按星期執行',
  unspecifiedWeek: '不指定星期，按日期執行',
  valueSeparator: '、',
  expression: 'Cron 表達式',
  fieldList: 'Cron 欄位',
  fieldStart: '{field}起始值',
  fieldInterval: '{field}間隔',
  fieldRangeStart: '{field}範圍起始值',
  fieldRangeEnd: '{field}範圍結束值',
  fieldValues: '{field}值',
  nextRun: '下次執行：{value}',
  noFutureRun: '無後續執行時間',
  specialLastDay: '每月最後一天',
  specialLastWeekday: '每月最後一個工作日',
  specialNearestWeekday: '每月最接近 {day} 日的工作日',
  specialLastDayOfWeek: '每月最後一個{week}',
  specialNthDayOfWeek: '每月第 {nth} 個{week}',
  specialLast: '最後一個',
  specialNth: '第 n 個',
  nthLabels: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  },
  validation: {
    invalidStep: '步長表達式無效',
    stepOutOfRange: '步長必須為欄位範圍內的正數',
    invalidRange: '範圍表達式無效',
    valueOutOfRange: '值必須在 {min} 到 {max} 之間',
    rangeOrder: '範圍起始值不能大於結束值',
    fieldRequired: '欄位不能為空',
    questionMarkField: '問號僅支援日和星期欄位',
    questionMarkAlone: '問號必須是欄位的唯一值',
    unsupportedCharacter: '欄位中包含不支援的字元',
    expectedFields: '目前 Quartz 格式需要 {count} 個欄位',
    expectedUnixFields: 'Unix 格式需要 5 個欄位',
    dayWeekQuestionMark: 'Quartz 表達式的日和星期欄位必須且只能有一個問號',
    unixQuestionMark: 'Unix 格式不支援問號',
    unsupportedSpecial: '不支援該特殊語法',
    invalidExpression: 'Cron 表達式無效',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: '熱力圖',
    less: '少',
    more: '多',
    noData: '無資料',
    level: '等級',
  },
  InputTag: {
    clear: '清空',
    showMore: '展開全部標籤',
  },
} satisfies ProLocale

export default proLocale
