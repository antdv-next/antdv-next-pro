import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/zh_CN'

const cronLocale = {
  fields: {
    second: '秒',
    minute: '分钟',
    hour: '小时',
    day: '日',
    month: '月',
    week: '星期',
    year: '年',
  },
  modes: {
    every: '每',
    interval: '间隔',
    specified: '指定',
    range: '范围',
    special: '特殊',
  },
  notSpecified: '不指定',
  everyField: '每{field}执行',
  everyStep: '每 {step} {field}执行',
  intervalField: '从 {start} 开始，每 {step} {field}执行',
  specifiedField: '{values}',
  rangeField: '从 {start} 到 {end}',
  unspecifiedDay: '不指定日期，按星期执行',
  unspecifiedWeek: '不指定星期，按日期执行',
  valueSeparator: '、',
  expression: 'Cron 表达式',
  fieldList: 'Cron 字段',
  fieldStart: '{field}起始值',
  fieldInterval: '{field}间隔',
  fieldRangeStart: '{field}范围起始值',
  fieldRangeEnd: '{field}范围结束值',
  fieldValues: '{field}值',
  nextRun: '下次执行：{value}',
  noFutureRun: '无后续执行时间',
  specialLastDay: '每月最后一天',
  specialLastWeekday: '每月最后一个工作日',
  specialNearestWeekday: '每月最接近 {day} 日的工作日',
  specialLastDayOfWeek: '每月最后一个{week}',
  specialNthDayOfWeek: '每月第 {nth} 个{week}',
  specialLast: '最后一个',
  specialNth: '第 n 个',
  nthLabels: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  },
  validation: {
    invalidStep: '步长表达式无效',
    stepOutOfRange: '步长必须为字段范围内的正数',
    invalidRange: '范围表达式无效',
    valueOutOfRange: '值必须在 {min} 到 {max} 之间',
    rangeOrder: '范围起始值不能大于结束值',
    fieldRequired: '字段不能为空',
    questionMarkField: '问号仅支持日和星期字段',
    questionMarkAlone: '问号必须是字段的唯一值',
    unsupportedCharacter: '字段中包含不支持的字符',
    expectedFields: '当前 Quartz 格式需要 {count} 个字段',
    expectedUnixFields: 'Unix 格式需要 5 个字段',
    dayWeekQuestionMark: 'Quartz 表达式的日和星期字段必须且只能有一个问号',
    unixQuestionMark: 'Unix 格式不支持问号',
    unsupportedSpecial: '不支持该特殊语法',
    invalidExpression: 'Cron 表达式无效',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: '热力图',
    less: '少',
    more: '多',
    noData: '无数据',
    level: '等级',
  },
  InputTag: {
    clear: '清空',
    showMore: '展开全部标签',
  },
} satisfies ProLocale

export default proLocale
