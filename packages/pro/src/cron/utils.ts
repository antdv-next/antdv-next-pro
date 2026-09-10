import type { CronError, CronFieldMode, CronFieldName, CronFields, CronFormat, CronLocale, CronOptions, CronPreviewResult, CronValidateResult } from './types'
import { Cron } from 'croner'
import enUSLocale from '../locale/en_US'
import {
  getFieldLimits,
  getFieldNames,
  getWeekAliases,
  MONTH_ALIASES,
  resolveCronOptions,
  weekNumberToName,
} from './format'
import { isSpecialField, looksLikeSpecial, parseSpecial } from './special'

export { createDefaultFields, getFieldLimits, getFieldNames, resolveCronOptions } from './format'
export { parseSpecial, serializeSpecial } from './special'

const enUS = enUSLocale.Cron!

interface FieldDefinition {
  min: number
  max: number
  aliases?: Record<string, number>
}

function getFieldDefinition(name: CronFieldName, format: CronFormat): FieldDefinition {
  const [min, max] = getFieldLimits(format)[name]
  if (name === 'month')
    return { min, max, aliases: MONTH_ALIASES }
  if (name === 'week')
    return { min, max, aliases: getWeekAliases(format) }
  return { min, max }
}

function normalizeValue(value: string) {
  return value.trim().toUpperCase()
}

function parseNumber(value: string, definition: FieldDefinition): number | undefined {
  const normalized = normalizeValue(value)
  if (definition.aliases && normalized in definition.aliases)
    return definition.aliases[normalized]
  const parsed = Number(normalized)
  if (!Number.isInteger(parsed) || parsed < definition.min || parsed > definition.max)
    return undefined
  return parsed
}

export function formatCronMessage(template: string, values: Record<string, number | string> = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`))
}

function validateSegment(segment: string, definition: FieldDefinition, locale: CronLocale): string | undefined {
  const [base, step] = segment.split('/')
  if (!base || (step !== undefined && segment.split('/').length !== 2))
    return locale.validation.invalidStep
  if (step !== undefined) {
    const stepNumber = Number(step)
    if (!Number.isInteger(stepNumber) || stepNumber <= 0 || stepNumber > definition.max - definition.min + 1)
      return locale.validation.stepOutOfRange
  }
  if (base === '*')
    return undefined

  const range = base.split('-')
  if (range.length > 2 || range.some(item => !item))
    return locale.validation.invalidRange
  const start = parseNumber(range[0]!, definition)
  const end = range.length === 2 ? parseNumber(range[1]!, definition) : start
  if (start === undefined || end === undefined)
    return formatCronMessage(locale.validation.valueOutOfRange, { min: definition.min, max: definition.max })
  if (start > end)
    return locale.validation.rangeOrder
}

function validateField(value: string, name: CronFieldName, format: CronFormat, locale: CronLocale): string | undefined {
  const normalized = normalizeValue(value)
  const definition = getFieldDefinition(name, format)
  if (!normalized)
    return locale.validation.fieldRequired

  if (normalized === '?') {
    if (format === 'unix')
      return locale.validation.unixQuestionMark
    return name === 'day' || name === 'week' ? undefined : locale.validation.questionMarkField
  }
  if (normalized.includes('?'))
    return locale.validation.questionMarkAlone

  if (format === 'quartz' && isSpecialField(name) && parseSpecial(normalized, name))
    return undefined
  if (looksLikeSpecial(normalized))
    return locale.validation.unsupportedSpecial

  if (format === 'unix' ? /[^\dA-Z*,/\-]/.test(normalized) : /[^\dA-Z*?,/\-]/.test(normalized))
    return locale.validation.unsupportedCharacter

  return normalized.split(',').map(segment => validateSegment(segment, definition, locale)).find(Boolean)
}

function toFields(parts: string[], format: CronFormat): CronFields {
  if (format === 'unix') {
    return {
      minute: parts[0]!,
      hour: parts[1]!,
      day: parts[2]!,
      month: parts[3]!,
      week: parts[4]!,
    }
  }
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

function toCronerPattern(expression: string, format: CronFormat) {
  return format === 'unix' ? expression : expression.replace(/\?/g, '*')
}

function createCron(expression: string, options: CronOptions = {}) {
  const { format, showYear } = resolveCronOptions(options)
  return new Cron(toCronerPattern(expression, format), {
    paused: true,
    mode: format === 'unix' ? '5-part' : showYear ? '7-part' : '6-part',
    alternativeWeekdays: format === 'quartz',
    sloppyRanges: true,
  })
}

export function formatExpression(fields: CronFields, options: CronOptions = {}) {
  return getFieldNames(options)
    .map((name) => {
      const fallback = name === 'year' ? '*' : name === 'second' ? '0' : ''
      return normalizeValue(fields[name] ?? fallback)
    })
    .join(' ')
}

export function parseExpression(expression: string, options: CronOptions = {}, locale: CronLocale = enUS): CronFields | undefined {
  const result = validateExpression(expression, options, locale)
  if (result.status !== 'valid' || !result.expression)
    return undefined
  return toFields(result.expression.split(' '), resolveCronOptions(options).format)
}

export function validateExpression(expression: string, options: CronOptions = {}, locale: CronLocale = enUS): CronValidateResult {
  const { format } = resolveCronOptions(options)
  const normalized = expression.trim().replace(/\s+/g, ' ').toUpperCase()
  if (!normalized)
    return { status: 'empty' }

  const parts = normalized.split(' ')
  const expectedLength = getFieldNames(options).length
  if (parts.length !== expectedLength) {
    const message = format === 'unix'
      ? locale.validation.expectedUnixFields
      : formatCronMessage(locale.validation.expectedFields, { count: expectedLength })
    return {
      status: 'invalid',
      errors: [{ message }],
    }
  }

  const names = getFieldNames(options)
  const errors: CronError[] = parts.flatMap((value, index) => {
    const field = names[index]
    const message = field ? validateField(value, field, format, locale) : undefined
    return message && field ? [{ field, message }] : []
  })

  if (format === 'quartz') {
    const day = parts[3]!
    const week = parts[5]!
    if ((day === '?') === (week === '?')) {
      errors.push({
        message: locale.validation.dayWeekQuestionMark,
      })
    }
  }

  if (errors.length > 0)
    return { status: 'invalid', errors }

  try {
    createCron(normalized, options)
  }
  catch {
    return {
      status: 'invalid',
      errors: [{ message: locale.validation.invalidExpression }],
    }
  }

  return { status: 'valid', expression: normalized }
}

export function getFieldMode(value: string, field?: CronFieldName): CronFieldMode {
  if (field && isSpecialField(field) && parseSpecial(value, field))
    return 'special'
  if (!field && (parseSpecial(value, 'day') || parseSpecial(value, 'week')))
    return 'special'
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

function isNumericField(value: string | undefined) {
  return Boolean(value && /^\d+$/.test(value))
}

function isZeroField(value: string | undefined) {
  return value === '0' || value === '00' || value === undefined
}

function isEveryOrZero(value: string | undefined) {
  return value === '*' || isZeroField(value)
}

function isEveryDay(fields: CronFields) {
  return (fields.day === '*' && (fields.week === '?' || fields.week === '*'))
    || (fields.day === '?' && fields.week === '*')
}

function formatFieldToken(field: CronFieldName, token: string, locale: CronLocale, format: CronFormat) {
  const normalized = token.trim().toUpperCase()
  if (field === 'month' || field === 'week') {
    const aliases = field === 'month' ? MONTH_ALIASES : getWeekAliases(format)
    const numeric = aliases[normalized] ?? (Number.isInteger(Number(normalized)) ? Number(normalized) : undefined)
    const name = numeric === undefined
      ? undefined
      : field === 'week'
        ? weekNumberToName(numeric, format)
        : Object.keys(MONTH_ALIASES)[numeric - 1]
    if (name)
      return locale.valueLabels?.[field]?.[name] ?? name
  }
  return normalized
}

function getDescriptionValues(field: CronFieldName, value: string, locale: CronLocale, format: CronFormat) {
  const definition = getFieldDefinition(field, format)
  const separator = locale.valueSeparator ?? ', '
  const mode = getFieldMode(value, field)
  if (mode === 'interval') {
    const [base, step] = value.split('/')
    const startToken = !base || base === '*' ? String(definition.min) : base.split('-')[0]!
    return {
      start: formatFieldToken(field, startToken, locale, format),
      end: formatFieldToken(field, String(definition.max), locale, format),
      step: step && Number(step) > 0 ? step : '1',
      values: formatFieldToken(field, startToken, locale, format),
    }
  }
  if (mode === 'range') {
    const [start, end] = value.split('-')
    return {
      start: formatFieldToken(field, start ?? String(definition.min), locale, format),
      end: formatFieldToken(field, end ?? String(definition.max), locale, format),
      step: '1',
      values: [start, end].filter(Boolean).map(item => formatFieldToken(field, item!, locale, format)).join(separator),
    }
  }
  const selected = value.split(',').filter(Boolean).map(item => formatFieldToken(field, item, locale, format)).join(separator)
  return {
    start: formatFieldToken(field, String(definition.min), locale, format),
    end: formatFieldToken(field, String(definition.max), locale, format),
    step: '1',
    values: selected || formatFieldToken(field, String(definition.min), locale, format),
  }
}

function getFieldTemplate(field: CronFieldName, mode: CronFieldMode, type: 'editor' | 'preview', locale: CronLocale) {
  return locale.fieldDescriptions?.[field]?.[mode]?.[type]
    ?? enUS.fieldDescriptions?.[field]?.[mode]?.[type]
    ?? ''
}

function describeSpecial(field: 'day' | 'week', value: string, locale: CronLocale) {
  const special = parseSpecial(value, field)
  if (!special)
    return ''
  const weekLabel = (week: number) => formatFieldToken('week', String(week), locale, 'quartz')
  const nthLabel = (nth: number) => locale.nthLabels[String(nth)] ?? String(nth)
  switch (special.type) {
    case 'last':
      return locale.specialLastDay
    case 'lastWeekday':
      return locale.specialLastWeekday
    case 'nearestWeekday':
      return formatCronMessage(locale.specialNearestWeekday, { day: special.day })
    case 'lastDayOfWeek':
      return formatCronMessage(locale.specialLastDayOfWeek, { week: weekLabel(special.week) })
    case 'nthDayOfWeek':
      return formatCronMessage(locale.specialNthDayOfWeek, {
        week: weekLabel(special.week),
        nth: nthLabel(special.nth),
      })
  }
}

export function describeField(field: CronFieldName, value: string, locale: CronLocale, type: 'editor' | 'preview' = 'preview', format: CronFormat = 'quartz') {
  if (isSpecialField(field) && parseSpecial(value, field))
    return describeSpecial(field, value, locale)
  const mode = getFieldMode(value, field)
  const template = getFieldTemplate(field, mode, type, locale)
  return template ? formatCronMessage(template, getDescriptionValues(field, value, locale, format)) : ''
}

function getClock(fields: CronFields) {
  const second = fields.second ?? '0'
  if (!isNumericField(fields.hour) || !isNumericField(fields.minute) || !isNumericField(second))
    return undefined
  const time = `${fields.hour.padStart(2, '0')}:${fields.minute.padStart(2, '0')}`
  return second === '0' ? time : `${time}:${second.padStart(2, '0')}`
}

function getDominantIntervalField(fields: CronFields): CronFieldName | undefined {
  const secondMode = getFieldMode(fields.second ?? '0')
  const minuteMode = getFieldMode(fields.minute)
  const hourMode = getFieldMode(fields.hour)
  if (fields.second !== undefined && secondMode === 'interval' && (fields.minute === '*' || isZeroField(fields.minute)) && fields.hour === '*')
    return 'second'
  if (minuteMode === 'interval' && isEveryOrZero(fields.second) && fields.hour === '*')
    return 'minute'
  if (hourMode === 'interval' && isEveryOrZero(fields.second) && isEveryOrZero(fields.minute))
    return 'hour'
}

function describeCalendar(fields: CronFields, locale: CronLocale, format: CronFormat) {
  const parts: string[] = []
  if (fields.year && getFieldMode(fields.year) !== 'every')
    parts.push(describeField('year', fields.year, locale, 'preview', format))
  if (getFieldMode(fields.month) !== 'every')
    parts.push(describeField('month', fields.month, locale, 'preview', format))

  const weekMode = getFieldMode(fields.week, 'week')
  const dayMode = getFieldMode(fields.day, 'day')
  const day = dayMode !== 'every' && dayMode !== 'unspecified'
    ? describeField('day', fields.day, locale, 'preview', format)
    : ''
  const week = weekMode !== 'every' && weekMode !== 'unspecified'
    ? describeField('week', fields.week, locale, 'preview', format)
    : ''
  if (format === 'unix' && day && week)
    parts.push(`${day}${locale.or}${week}`)
  else if (week)
    parts.push(week)
  else if (day)
    parts.push(day)

  return parts.filter(Boolean).join(locale.valueSeparator ?? ', ')
}

function describeTime(fields: CronFields, locale: CronLocale, format: CronFormat) {
  const intervalField = getDominantIntervalField(fields)
  if (intervalField)
    return describeField(intervalField, fields[intervalField]!, locale, 'editor', format)

  const parts: string[] = []
  const hourMode = getFieldMode(fields.hour)
  const minuteMode = getFieldMode(fields.minute)
  const second = fields.second ?? '0'
  const secondMode = getFieldMode(second)
  if (hourMode !== 'every')
    parts.push(describeField('hour', fields.hour, locale, 'preview', format))
  if (minuteMode !== 'every' && !(isZeroField(fields.minute) && hourMode !== 'every'))
    parts.push(describeField('minute', fields.minute, locale, 'preview', format))
  if (fields.second !== undefined && secondMode !== 'every' && !(isZeroField(second) && (minuteMode !== 'every' || hourMode !== 'every')))
    parts.push(describeField('second', second, locale, 'preview', format))
  return parts.filter(Boolean).join(locale.valueSeparator ?? ', ')
}

function insertTime(description: string, time: string) {
  const executeTokens = ['执行', '執行', '実行', '실행', 'ausführen']
  for (const token of executeTokens) {
    if (description.endsWith(token))
      return `${description.slice(0, -token.length).trimEnd()} ${time} ${token}`
  }
  if (/^(Execute|Exécuter|Esegui|Executar|Ejecutar|Uitvoeren|the)\b/i.test(description))
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

export function describeExpression(fields: CronFields, locale: CronLocale = enUS, options: CronOptions = {}): string {
  const format = resolveCronOptions(options).format
  const clock = getClock(fields)
  const calendar = describeCalendar(fields, locale, format)
  if (clock) {
    if (calendar)
      return insertTime(calendar, clock)
    return formatCronMessage(locale.everyDayAt, { value: clock })
  }

  const time = describeTime(fields, locale, format)
  if (time && calendar && !isEveryDay(fields))
    return joinSchedule(calendar, time)
  if (time)
    return time
  if (calendar)
    return calendar
  return locale.customSchedule
}

export function getPreview(expression: string, options: CronOptions = {}, locale: CronLocale = enUS): CronPreviewResult {
  const validation = validateExpression(expression, options, locale)
  if (validation.status !== 'valid' || !validation.expression)
    return { expression }
  const format = resolveCronOptions(options).format
  const fields = toFields(validation.expression.split(' '), format)
  const cron = createCron(validation.expression, options)
  return {
    expression: validation.expression,
    description: describeExpression(fields, locale, options),
    nextRunAt: cron.nextRun() ?? undefined,
    nextRuns: cron.nextRuns(3),
  }
}

export function updateField(fields: CronFields, field: CronFieldName, value: string, options: CronOptions = {}): CronFields {
  const next = { ...fields, [field]: normalizeValue(value) }
  if (resolveCronOptions(options).format !== 'quartz')
    return next
  if (field === 'day' && next.day !== '?' && next.week !== '?')
    next.week = '?'
  if (field === 'week' && next.week !== '?' && next.day !== '?')
    next.day = '?'
  if (field === 'day' && next.day === '?' && next.week === '?')
    next.week = '*'
  if (field === 'week' && next.week === '?' && next.day === '?')
    next.day = '*'
  return next
}
