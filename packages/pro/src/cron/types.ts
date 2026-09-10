import type { CSSProperties } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/semantic'

export const CRON_FIELD_NAMES = ['second', 'minute', 'hour', 'day', 'month', 'week', 'year'] as const

export type CronFieldName = (typeof CRON_FIELD_NAMES)[number]
export type CronFieldMode = 'every' | 'interval' | 'specified' | 'range' | 'list' | 'unspecified'
export type CronSize = 'small' | 'middle' | 'large'
export type CronStatus = '' | 'error' | 'success' | 'validating' | 'warning'
export type CronValidateStatus = 'valid' | 'invalid' | 'empty'

export interface CronFieldModeDescription {
  editor: string
  preview: string
}

export type CronFieldDescriptions = Partial<Record<CronFieldName, Partial<Record<Exclude<CronFieldMode, 'list'>, CronFieldModeDescription>>>>

export interface CronLocale {
  fields: Record<CronFieldName, string>
  modes: Record<Exclude<CronFieldMode, 'unspecified'>, string>
  any: string
  notSpecified: string
  every: string
  everyField: string
  fieldDescriptions?: CronFieldDescriptions
  valueLabels?: Partial<Record<CronFieldName, Record<string, string>>>
  valueSeparator?: string
  to: string
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
    dayWeekQuestionMark: string
    invalidExpression: string
  }
}

export interface CronFields {
  second: string
  minute: string
  hour: string
  day: string
  month: string
  week: string
  year?: string
}

export interface CronError {
  field?: CronFieldName
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
