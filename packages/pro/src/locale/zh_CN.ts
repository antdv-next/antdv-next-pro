import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/zh_CN'

const cronLocale: CronLocale = {
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
    list: '列表',
  },
  any: '任意',
  notSpecified: '不指定',
  every: '每',
  everyField: '每{field}',
  to: '至',
  expression: 'Cron 表达式',
  fieldList: 'Cron 字段',
  fieldStart: '{field}起始值',
  fieldInterval: '{field}间隔',
  fieldRangeStart: '{field}范围起始值',
  fieldRangeEnd: '{field}范围结束值',
  fieldValue: '{field}值',
  fieldValues: '{field}值',
  nextRun: '下次执行：{value}',
  noFutureRun: '无后续执行时间',
  everySeconds: '每 {value} 秒',
  everyMinutes: '每 {value} 分钟',
  everyDayAt: '每天 {value}',
  customSchedule: '自定义计划',
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
    dayWeekQuestionMark: 'Quartz 表达式的日和星期字段必须且只能有一个问号',
    invalidExpression: 'Cron 表达式无效',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
