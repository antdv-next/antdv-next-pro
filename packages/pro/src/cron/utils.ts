import type { CronError, CronFieldMode, CronFieldName, CronFields, CronLocale, CronPreviewResult, CronValidateResult } from './types'
import { Cron } from 'croner'
import enUSLocale from '../locale/en_US'

const FIELD_ORDER: CronFieldName[] = ['second', 'minute', 'hour', 'day', 'month', 'week', 'year']
const enUS = enUSLocale.Cron!
const MONTHS: Record<string, number> = {
  JAN: 1,
  FEB: 2,
  MAR: 3,
  APR: 4,
  MAY: 5,
  JUN: 6,
  JUL: 7,
  AUG: 8,
  SEP: 9,
  OCT: 10,
  NOV: 11,
  DEC: 12,
}
const WEEKS: Record<string, number> = {
  SUN: 1,
  MON: 2,
  TUE: 3,
  WED: 4,
  THU: 5,
  FRI: 6,
  SAT: 7,
}

interface FieldDefinition {
  min: number
  max: number
  aliases?: Record<string, number>
}

const FIELD_DEFINITIONS: Record<CronFieldName, FieldDefinition> = {
  second: { min: 0, max: 59 },
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  day: { min: 1, max: 31 },
  month: { min: 1, max: 12, aliases: MONTHS },
  week: { min: 1, max: 7, aliases: WEEKS },
  year: { min: 1, max: 9999 },
}

const DEFAULT_FIELDS: CronFields = {
  second: '0',
  minute: '0',
  hour: '*',
  day: '*',
  month: '*',
  week: '?',
}

function getFieldName(index: number): CronFieldName | undefined {
  return FIELD_ORDER[index]
}

function normalizeValue(value: string) {
  return value.trim().toUpperCase()
}

function parseNumber(value: string, definition: FieldDefinition): number | undefined {
  const normalized = normalizeValue(value)
  const parsed = definition.aliases?.[normalized] ?? Number(normalized)
  return Number.isInteger(parsed) && parsed >= definition.min && parsed <= definition.max
    ? parsed
    : undefined
}

export function formatCronMessage(template: string, values: Record<string, number | string> = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`))
}

function validateSegment(segment: string, definition: FieldDefinition, locale: CronLocale): string | undefined {
  const [base, step] = segment.split('/')
  if (!base || (step !== undefined && segment.split('/').length !== 2)) {
    return locale.validation.invalidStep
  }
  if (step !== undefined) {
    const stepNumber = Number(step)
    if (!Number.isInteger(stepNumber) || stepNumber <= 0 || stepNumber > definition.max - definition.min + 1) {
      return locale.validation.stepOutOfRange
    }
  }
  if (base === '*') {
    return undefined
  }

  const range = base.split('-')
  if (range.length > 2 || range.some(item => !item)) {
    return locale.validation.invalidRange
  }
  const start = parseNumber(range[0]!, definition)
  const end = range.length === 2 ? parseNumber(range[1]!, definition) : start
  if (start === undefined || end === undefined) {
    return formatCronMessage(locale.validation.valueOutOfRange, { min: definition.min, max: definition.max })
  }
  if (start > end) {
    return locale.validation.rangeOrder
  }
}

function validateField(value: string, name: CronFieldName, locale: CronLocale): string | undefined {
  const normalized = normalizeValue(value)
  const definition = FIELD_DEFINITIONS[name]
  if (!normalized) {
    return locale.validation.fieldRequired
  }
  if (normalized === '?') {
    return name === 'day' || name === 'week'
      ? undefined
      : locale.validation.questionMarkField
  }
  if (normalized.includes('?')) {
    return locale.validation.questionMarkAlone
  }
  if (/[^\dA-Z*?,/\-]/.test(normalized)) {
    return locale.validation.unsupportedCharacter
  }
  return normalized.split(',').map(segment => validateSegment(segment, definition, locale)).find(Boolean)
}

function toFields(parts: string[]): CronFields {
  return {
    second: parts[0]!,
    minute: parts[1]!,
    hour: parts[2]!,
    day: parts[3]!,
    month: parts[4]!,
    week: parts[5]!,
    ...(parts[6] ? { year: parts[6] } : {}),
  }
}

function createCron(expression: string, showYear: boolean) {
  return new Cron(expression, {
    paused: true,
    mode: showYear ? '7-part' : '6-part',
    alternativeWeekdays: true,
    sloppyRanges: true,
  })
}

export function createDefaultFields(showYear = false): CronFields {
  return {
    ...DEFAULT_FIELDS,
    ...(showYear ? { year: '*' } : {}),
  }
}

export function formatExpression(fields: CronFields, showYear = false) {
  const values = FIELD_ORDER
    .slice(0, showYear ? 7 : 6)
    .map(name => normalizeValue(fields[name] ?? (name === 'year' ? '*' : '')))
  return values.join(' ')
}

export function parseExpression(expression: string, showYear = false, locale: CronLocale = enUS): CronFields | undefined {
  const result = validateExpression(expression, showYear, locale)
  if (result.status !== 'valid' || !result.expression) {
    return undefined
  }
  return toFields(result.expression.split(' '))
}

export function validateExpression(expression: string, showYear = false, locale: CronLocale = enUS): CronValidateResult {
  const normalized = expression.trim().replace(/\s+/g, ' ').toUpperCase()
  if (!normalized) {
    return { status: 'empty' }
  }

  const parts = normalized.split(' ')
  const expectedLength = showYear ? 7 : 6
  if (parts.length !== expectedLength) {
    return {
      status: 'invalid',
      errors: [{ message: formatCronMessage(locale.validation.expectedFields, { count: expectedLength }) }],
    }
  }

  const errors: CronError[] = parts.flatMap((value, index) => {
    const field = getFieldName(index)
    const message = field ? validateField(value, field, locale) : undefined
    return message ? [{ field, message }] : []
  })

  const day = parts[3]!
  const week = parts[5]!
  if ((day === '?') === (week === '?')) {
    errors.push({
      message: locale.validation.dayWeekQuestionMark,
    })
  }

  if (errors.length > 0) {
    return { status: 'invalid', errors }
  }

  try {
    createCron(normalized, showYear)
  }
  catch {
    return {
      status: 'invalid',
      errors: [{ message: locale.validation.invalidExpression }],
    }
  }

  return { status: 'valid', expression: normalized }
}

export function getFieldMode(value: string): CronFieldMode {
  if (value.includes(','))
    return 'list'
  if (value.includes('-'))
    return 'range'
  if (value.includes('/'))
    return 'interval'
  if (value === '*' || value === '?')
    return 'every'
  return 'specified'
}

export function describeExpression(fields: CronFields, locale: CronLocale = enUS): string {
  if (fields.minute.startsWith('*/') && fields.second === '0') {
    return formatCronMessage(locale.everyMinutes, { value: fields.minute.slice(2) })
  }
  if (fields.second.startsWith('*/')) {
    return formatCronMessage(locale.everySeconds, { value: fields.second.slice(2) })
  }
  if (/^\d+$/.test(fields.hour) && /^\d+$/.test(fields.minute) && fields.day === '*' && fields.week === '?') {
    return formatCronMessage(locale.everyDayAt, { value: `${fields.hour.padStart(2, '0')}:${fields.minute.padStart(2, '0')}` })
  }
  return locale.customSchedule
}

export function getPreview(expression: string, showYear = false, locale: CronLocale = enUS): CronPreviewResult {
  const validation = validateExpression(expression, showYear, locale)
  if (validation.status !== 'valid' || !validation.expression) {
    return { expression }
  }
  const fields = toFields(validation.expression.split(' '))
  const cron = createCron(validation.expression, showYear)
  return {
    expression: validation.expression,
    description: describeExpression(fields, locale),
    nextRunAt: cron.nextRun() ?? undefined,
    nextRuns: cron.nextRuns(3),
  }
}

export function updateField(fields: CronFields, field: CronFieldName, value: string): CronFields {
  const next = { ...fields, [field]: normalizeValue(value) }
  if (field === 'day' && next.day !== '?' && next.week !== '?') {
    next.week = '?'
  }
  if (field === 'week' && next.week !== '?' && next.day !== '?') {
    next.day = '?'
  }
  if (field === 'day' && next.day === '?' && next.week === '?') {
    next.week = '*'
  }
  if (field === 'week' && next.week === '?' && next.day === '?') {
    next.day = '*'
  }
  return next
}
