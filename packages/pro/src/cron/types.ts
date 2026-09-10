import type { CSSProperties } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/semantic'

export const CRON_FIELD_NAMES = ['second', 'minute', 'hour', 'day', 'month', 'week', 'year'] as const

export type CronFieldName = (typeof CRON_FIELD_NAMES)[number]
export type CronFormat = 'quartz' | 'unix'
export type CronEditorMode = 'every' | 'interval' | 'specified' | 'range'
export type CronFieldMode = CronEditorMode | 'unspecified' | 'special'
export type CronSize = 'small' | 'medium' | 'large'
export type CronStatus = '' | 'error' | 'success' | 'validating' | 'warning'
export type CronValidateStatus = 'valid' | 'invalid' | 'empty'

export interface CronFieldModeDescription {
  editor: string
  preview: string
}

export type CronFieldDescriptions = Partial<Record<CronFieldName, Partial<Record<CronFieldMode, CronFieldModeDescription>>>>

export interface CronLocale {
  fields: Record<CronFieldName, string>
  modes: Record<CronEditorMode, string> & { special: string }
  any: string
  notSpecified: string
  every: string
  everyField: string
  fieldDescriptions?: CronFieldDescriptions
  valueLabels?: Partial<Record<CronFieldName, Record<string, string>>>
  valueSeparator?: string
  to: string
  or: string
  expression: string
  fieldList: string
  fieldStart: string
  fieldInterval: string
  fieldRangeStart: string
  fieldRangeEnd: string
  fieldValue: string
  fieldValues: string
  nextRun: string
  noFutureRun: string
  everySeconds: string
  everyMinutes: string
  everyDayAt: string
  customSchedule: string
  specialLastDay: string
  specialLastWeekday: string
  specialNearestWeekday: string
  specialLastDayOfWeek: string
  specialNthDayOfWeek: string
  specialLast: string
  specialNth: string
  nthLabels: Record<string, string>
  validation: {
    invalidStep: string
    stepOutOfRange: string
    invalidRange: string
    valueOutOfRange: string
    rangeOrder: string
    fieldRequired: string
    questionMarkField: string
    questionMarkAlone: string
    unsupportedCharacter: string
    expectedFields: string
    expectedUnixFields: string
    dayWeekQuestionMark: string
    unixQuestionMark: string
    unsupportedSpecial: string
    invalidExpression: string
  }
}

export interface CronFields {
  second?: string
  minute: string
  hour: string
  day: string
  month: string
  week: string
  year?: string
}

export interface CronOptions {
  format?: CronFormat
  showYear?: boolean
}

export type CronErrorCode
  = | 'INVALID_STEP'
    | 'STEP_OUT_OF_RANGE'
    | 'INVALID_RANGE'
    | 'VALUE_OUT_OF_RANGE'
    | 'RANGE_ORDER'
    | 'FIELD_REQUIRED'
    | 'QUESTION_MARK_FIELD'
    | 'QUESTION_MARK_ALONE'
    | 'UNSUPPORTED_CHARACTER'
    | 'EXPECTED_FIELDS'
    | 'EXPECTED_UNIX_FIELDS'
    | 'DAY_WEEK_QUESTION_MARK'
    | 'UNIX_QUESTION_MARK'
    | 'UNSUPPORTED_SPECIAL'
    | 'INVALID_EXPRESSION'

export interface CronError {
  field?: CronFieldName
  code: CronErrorCode
  message: string
}

export interface CronValidateResult {
  status: CronValidateStatus
  expression?: string
  errors?: CronError[]
}

export interface CronPreviewResult {
  expression: string
  description?: string
  nextRunAt?: Date
  nextRuns?: Date[]
}

export interface CronPreset {
  label: string
  value: string
  description?: string
}

export interface CronSemanticClassNames {
  root?: string
  input?: string
  fields?: string
  navigation?: string
  editor?: string
  field?: string
  presets?: string
  preview?: string
  error?: string
}

export interface CronSemanticStyles {
  root?: CSSProperties
  input?: CSSProperties
  fields?: CSSProperties
  navigation?: CSSProperties
  editor?: CSSProperties
  field?: CSSProperties
  presets?: CSSProperties
  preview?: CSSProperties
  error?: CSSProperties
}

export interface CronProps {
  prefixCls?: string
  rootClass?: string
  value?: string
  format?: CronFormat
  showYear?: boolean
  disabled?: boolean
  readonly?: boolean
  size?: CronSize
  status?: CronStatus
  preview?: boolean
  presets?: CronPreset[]
  classes?: CronClassNamesType
  styles?: CronStylesType
}

export type CronSemanticName = keyof CronSemanticClassNames & keyof CronSemanticStyles
export type CronClassNamesType = SemanticClassNamesType<CronProps, CronSemanticClassNames>
export type CronStylesType = SemanticStylesType<CronProps, CronSemanticStyles>

export interface CronEmits {
  'update:value': (value: string) => void
  change: (value: string) => void
  input: (value: string) => void
  validate: (result: CronValidateResult) => void
  [key: string]: (...args: any[]) => void
}

export interface CronFieldSlotProps {
  field: CronFieldName
  value: string
  disabled: boolean
  readonly: boolean
}

export interface CronSlots {
  field?: (props: CronFieldSlotProps) => any
  presets?: () => any
  preview?: (props: CronPreviewResult) => any
  error?: (props: CronValidateResult) => any
}

export interface CronConfig {
  format?: CronFormat
  showYear?: boolean
  disabled?: boolean
  readonly?: boolean
  size?: CronSize
  preview?: boolean
  presets?: CronPreset[]
  class?: string
  style?: CSSProperties
  classes?: CronClassNamesType
  styles?: CronStylesType
}
