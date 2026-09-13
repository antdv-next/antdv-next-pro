import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ja_JP'

const cronLocale = {
  fields: {
    second: '秒',
    minute: '分',
    hour: '時間',
    day: '日',
    month: '月',
    week: '週',
    year: '年',
  },
  modes: {
    every: '毎回',
    interval: '間隔',
    specified: '指定',
    range: '範囲',
    special: '特殊',
  },
  notSpecified: '指定されていません',
  everyField: '{field}ごと',
  everyStep: '{step} {field}ごとに実行',
  intervalField: '{start} から {step} {field}ごとに実行',
  specifiedField: '{values}',
  rangeField: '{start} まで {end}',
  unspecifiedDay: '日付は指定せず、曜日に従う',
  unspecifiedWeek: '曜日は指定せず、日付に従う',
  valueSeparator: '、',
  expression: 'Cron 式',
  fieldList: 'Cron フィールド',
  fieldStart: '{field} 開始',
  fieldInterval: '{field} 間隔',
  fieldRangeStart: '{field} 範囲開始',
  fieldRangeEnd: '{field} 範囲終了',
  fieldValues: '{field} 値',
  nextRun: '次の実行: {value}',
  noFutureRun: '今後の実行はありません',
  specialLastDay: '毎月の最終日',
  specialLastWeekday: '毎月の最終平日',
  specialNearestWeekday: '毎月 {day} 日に最も近い平日',
  specialLastDayOfWeek: '毎月最後の{week}',
  specialNthDayOfWeek: '毎月第 {nth} {week}',
  specialLast: '最後',
  specialNth: '第 n',
  nthLabels: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  },
  validation: {
    invalidStep: '無効なステップ式です',
    stepOutOfRange: 'ステップはフィールド範囲内の正の値である必要があります',
    invalidRange: '無効な範囲式です',
    valueOutOfRange: '値は {min} から {max} の間でなければなりません',
    rangeOrder: '範囲の開始値は範囲の終了値を超えてはなりません',
    fieldRequired: 'フィールドは必須です',
    questionMarkField: '疑問符は日フィールドと週フィールドでのみサポートされます',
    questionMarkAlone: 'フィールド値は疑問符のみである必要があります',
    unsupportedCharacter: 'フィールドでサポートされていない文字です',
    expectedFields: '選択した Quartz 形式に必要なフィールドは {count} 個です',
    expectedUnixFields: 'Unix 形式には 5 個のフィールドが必要です',
    dayWeekQuestionMark: 'Quartz 式では、日フィールドまたは週フィールドのいずれかが ? でなければなりませんが、両方を指定することはできません。',
    unixQuestionMark: 'Unix 形式では疑問符は使用できません',
    unsupportedSpecial: 'この特殊構文はサポートされていません',
    invalidExpression: '無効な cron 式です',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'ヒートマップ',
    less: '少ない',
    more: '多い',
    noData: 'データなし',
    level: 'レベル',
  },
  InputTag: {
    clear: 'クリア',
    showMore: 'すべてのタグを表示',
  },
} satisfies ProLocale

export default proLocale
