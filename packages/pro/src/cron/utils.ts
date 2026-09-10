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
    return 'specified'
  if (value.includes('-'))
    return 'range'
  if (value.includes('/'))
    return 'interval'
  if (value === '?')
    return 'unspecified'
  if (value === '*')
    return 'every'
  return 'specified'
}

function mergeCronLocale(locale: CronLocale): CronLocale {
  return {
    ...enUS,
    ...locale,
    fieldDescriptions: {
      ...enUS.fieldDescriptions,
      ...locale.fieldDescriptions,
    },
    valueLabels: {
      month: { ...enUS.valueLabels?.month, ...locale.valueLabels?.month },
      week: { ...enUS.valueLabels?.week, ...locale.valueLabels?.week },
    },
  }
}

function isNumericField(value: string) {
  return /^\d+$/.test(value)
}

function isZeroField(value: string) {
  return value === '0' || value === '00'
}

function isEveryOrZero(value: string) {
  return value === '*' || isZeroField(value)
}

function isEveryDay(fields: CronFields) {
  return (fields.day === '*' && fields.week === '?') || (fields.day === '?' && fields.week === '*')
}

function formatFieldToken(field: CronFieldName, token: string, locale: CronLocale) {
  const normalized = token.trim().toUpperCase()
  const aliases = field === 'month' ? MONTHS : field === 'week' ? WEEKS : undefined
  if (aliases) {
    const numeric = aliases[normalized] ?? (Number.isInteger(Number(normalized)) ? Number(normalized) : undefined)
    const name = numeric !== undefined ? Object.keys(aliases)[numeric - 1] : undefined
    if (name)
      return locale.valueLabels?.[field]?.[name] ?? name
  }
  return normalized
}

function getDescriptionValues(field: CronFieldName, value: string, locale: CronLocale) {
  const definition = FIELD_DEFINITIONS[field]
  const separator = locale.valueSeparator ?? ', '
  const mode = getFieldMode(value)
  if (mode === 'interval') {
    const [base, step] = value.split('/')
    const startToken = !base || base === '*' ? String(definition.min) : base.split('-')[0]!
    return {
      start: formatFieldToken(field, startToken, locale),
      end: formatFieldToken(field, String(definition.max), locale),
      step: step && Number(step) > 0 ? step : '1',
      values: formatFieldToken(field, startToken, locale),
    }
  }
  if (mode === 'range') {
    const [start, end] = value.split('-')
    return {
      start: formatFieldToken(field, start ?? String(definition.min), locale),
      end: formatFieldToken(field, end ?? String(definition.max), locale),
      step: '1',
      values: [start, end].filter(Boolean).map(item => formatFieldToken(field, item!, locale)).join(separator),
    }
  }
  const selected = value.split(',').filter(Boolean).map(item => formatFieldToken(field, item, locale)).join(separator)
  return {
    start: formatFieldToken(field, String(definition.min), locale),
    end: formatFieldToken(field, String(definition.max), locale),
    step: '1',
    values: selected || formatFieldToken(field, String(definition.min), locale),
  }
}

function getFieldTemplate(field: CronFieldName, mode: CronFieldMode, type: 'editor' | 'preview', locale: CronLocale) {
  return locale.fieldDescriptions?.[field]?.[mode]?.[type]
    ?? enUS.fieldDescriptions?.[field]?.[mode]?.[type]
    ?? ''
}

function describeField(field: CronFieldName, value: string, locale: CronLocale, type: 'editor' | 'preview' = 'preview') {
  const mode = getFieldMode(value)
  const template = getFieldTemplate(field, mode, type, locale)
  return template ? formatCronMessage(template, getDescriptionValues(field, value, locale)) : ''
}

function getClock(fields: CronFields) {
  if (!isNumericField(fields.hour) || !isNumericField(fields.minute) || !isNumericField(fields.second))
    return undefined
  const time = `${fields.hour.padStart(2, '0')}:${fields.minute.padStart(2, '0')}`
  return fields.second === '0' ? time : `${time}:${fields.second.padStart(2, '0')}`
}

function getDominantIntervalField(fields: CronFields): CronFieldName | undefined {
  const secondMode = getFieldMode(fields.second)
  const minuteMode = getFieldMode(fields.minute)
  const hourMode = getFieldMode(fields.hour)
  if (secondMode === 'interval' && (fields.minute === '*' || isZeroField(fields.minute)) && fields.hour === '*')
    return 'second'
  if (minuteMode === 'interval' && isEveryOrZero(fields.second) && fields.hour === '*')
    return 'minute'
  if (hourMode === 'interval' && isEveryOrZero(fields.second) && isEveryOrZero(fields.minute))
    return 'hour'
}

function describeCalendar(fields: CronFields, locale: CronLocale) {
  const parts: string[] = []
  if (fields.year && getFieldMode(fields.year) !== 'every')
    parts.push(describeField('year', fields.year, locale))
  if (getFieldMode(fields.month) !== 'every')
    parts.push(describeField('month', fields.month, locale))
  const weekMode = getFieldMode(fields.week)
  const dayMode = getFieldMode(fields.day)
  if (weekMode !== 'every' && weekMode !== 'unspecified')
    parts.push(describeField('week', fields.week, locale))
  else if (dayMode !== 'every' && dayMode !== 'unspecified')
    parts.push(describeField('day', fields.day, locale))
  return parts.filter(Boolean).join(locale.valueSeparator ?? ', ')
}

function describeTime(fields: CronFields, locale: CronLocale) {
  const intervalField = getDominantIntervalField(fields)
  if (intervalField)
    return describeField(intervalField, fields[intervalField]!, locale, 'editor')

  const parts: string[] = []
  const hourMode = getFieldMode(fields.hour)
  const minuteMode = getFieldMode(fields.minute)
  const secondMode = getFieldMode(fields.second)
  if (hourMode !== 'every')
    parts.push(describeField('hour', fields.hour, locale))
  if (minuteMode !== 'every' && !(isZeroField(fields.minute) && hourMode !== 'every'))
    parts.push(describeField('minute', fields.minute, locale))
  if (secondMode !== 'every' && !(isZeroField(fields.second) && (minuteMode !== 'every' || hourMode !== 'every')))
    parts.push(describeField('second', fields.second, locale))
  return parts.filter(Boolean).join(locale.valueSeparator ?? ', ')
}

function insertTime(description: string, time: string) {
  const executeTokens = ['执行', '執行', '実行', '실행', 'ausführen']
  for (const token of executeTokens) {
    if (description.endsWith(token))
      return `${description.slice(0, -token.length).trimEnd()} ${time} ${token}`
  }
  if (/^(Execute|Exécuter|Esegui|Executar|Ejecutar|Uitvoeren)\b/i.test(description))
    return `${description} at ${time}`
  return `${description} ${time}`
}

function joinSchedule(calendar: string, time: string) {
  if (!calendar)
    return time
  if (!time)
    return calendar
  const executeTokens = ['执行', '執行', '実行', '실행', 'ausführen']
  for (const token of executeTokens) {
    if (calendar.endsWith(token))
      return `${calendar.slice(0, -token.length).trimEnd()}，${time}`
  }
  return `${calendar} ${time}`
}

export function describeExpression(fields: CronFields, locale: CronLocale = enUS): string {
  const merged = mergeCronLocale(locale)
  const clock = getClock(fields)
  const calendar = describeCalendar(fields, merged)
  if (clock) {
    if (calendar)
      return insertTime(calendar, clock)
    return formatCronMessage(merged.everyDayAt, { value: clock })
  }

  const time = describeTime(fields, merged)
  if (time && calendar && !isEveryDay(fields))
    return joinSchedule(calendar, time)
  if (time)
    return time
  if (calendar)
    return calendar
  return merged.customSchedule
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
