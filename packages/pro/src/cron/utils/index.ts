import type { CronError, CronErrorCode, CronFieldMode, CronFieldName, CronFields, CronFormat, CronLocale, CronOptions, CronPreviewResult, CronValidateResult } from '../types'
import { Cron } from 'croner'
import cronstrue from 'cronstrue/i18n'
import enUSLocale from '../../locale/en_US'
import {
  getFieldLimits,
  getFieldNames,
  getWeekAliases,
  MONTH_ALIASES,
  MONTH_VALUES,
  resolveCronOptions,
  WEEK_VALUES,
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

function isCompleteLabels(labels: unknown, count: number): labels is string[] {
  return Array.isArray(labels) && labels.length === count && labels.every(label => typeof label === 'string' && label.trim())
}

export function resolveValueLabels(localeCode = 'en', pickerLocale?: { shortMonths?: string[], shortWeekDays?: string[] }, overrides?: CronLocale['valueLabels']) {
  const language = localeCode.replace('_', '-').toLowerCase()
  const formatter = new Intl.DateTimeFormat(language, { month: 'short', timeZone: 'UTC' })
  const weekdayFormatter = new Intl.DateTimeFormat(language, { weekday: 'short', timeZone: 'UTC' })
  const overrideMonths = overrides?.month
  const overrideWeeks = overrides?.week
  const months = isCompleteLabels(overrideMonths && MONTH_VALUES.map(value => overrideMonths[value]), 12)
    ? overrideMonths
    : isCompleteLabels(pickerLocale?.shortMonths, 12)
      ? Object.fromEntries(MONTH_VALUES.map((value, index) => [value, pickerLocale.shortMonths![index]!]))
      : Object.fromEntries(MONTH_VALUES.map((value, index) => [value, formatter.format(new Date(Date.UTC(2020, index, 1)))]))
  const weeks = isCompleteLabels(overrideWeeks && WEEK_VALUES.map(value => overrideWeeks[value]), 7)
    ? overrideWeeks
    : isCompleteLabels(pickerLocale?.shortWeekDays, 7)
      ? Object.fromEntries(WEEK_VALUES.map((value, index) => [value, pickerLocale.shortWeekDays![index]!]))
      : Object.fromEntries(WEEK_VALUES.map((value, index) => [value, weekdayFormatter.format(new Date(Date.UTC(2020, 5, 7 + index)))]))
  return { ...overrides, month: months, week: weeks }
}

function fieldIssue(code: CronErrorCode, message: string): Pick<CronError, 'code' | 'message'> {
  return { code, message }
}

function validateSegment(segment: string, definition: FieldDefinition, locale: CronLocale): Pick<CronError, 'code' | 'message'> | undefined {
  const [base, step] = segment.split('/')
  if (!base || (step !== undefined && segment.split('/').length !== 2))
    return fieldIssue('INVALID_STEP', locale.validation.invalidStep)
  if (step !== undefined) {
    const stepNumber = Number(step)
    if (!Number.isInteger(stepNumber) || stepNumber <= 0 || stepNumber > definition.max - definition.min + 1)
      return fieldIssue('STEP_OUT_OF_RANGE', locale.validation.stepOutOfRange)
  }
  if (base === '*')
    return undefined

  const range = base.split('-')
  if (range.length > 2 || range.some(item => !item))
    return fieldIssue('INVALID_RANGE', locale.validation.invalidRange)
  const start = parseNumber(range[0]!, definition)
  const end = range.length === 2 ? parseNumber(range[1]!, definition) : start
  if (start === undefined || end === undefined)
    return fieldIssue('VALUE_OUT_OF_RANGE', formatCronMessage(locale.validation.valueOutOfRange, { min: definition.min, max: definition.max }))
  if (start > end)
    return fieldIssue('RANGE_ORDER', locale.validation.rangeOrder)
}

function validateField(value: string, name: CronFieldName, format: CronFormat, locale: CronLocale): Pick<CronError, 'code' | 'message'> | undefined {
  const normalized = normalizeValue(value)
  const definition = getFieldDefinition(name, format)
  if (!normalized)
    return fieldIssue('FIELD_REQUIRED', locale.validation.fieldRequired)

  if (normalized === '?') {
    if (format === 'unix')
      return fieldIssue('UNIX_QUESTION_MARK', locale.validation.unixQuestionMark)
    return name === 'day' || name === 'week' ? undefined : fieldIssue('QUESTION_MARK_FIELD', locale.validation.questionMarkField)
  }
  if (normalized.includes('?'))
    return fieldIssue('QUESTION_MARK_ALONE', locale.validation.questionMarkAlone)

  if (format === 'quartz' && isSpecialField(name) && parseSpecial(normalized, name))
    return undefined
  if (looksLikeSpecial(normalized))
    return fieldIssue('UNSUPPORTED_SPECIAL', locale.validation.unsupportedSpecial)

  if (format === 'unix' ? /[^\dA-Z*,/\-]/.test(normalized) : /[^\dA-Z*?,/\-]/.test(normalized))
    return fieldIssue('UNSUPPORTED_CHARACTER', locale.validation.unsupportedCharacter)

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
      errors: [{
        code: format === 'unix' ? 'EXPECTED_UNIX_FIELDS' : 'EXPECTED_FIELDS',
        message,
      }],
    }
  }

  const names = getFieldNames(options)
  const errors: CronError[] = parts.flatMap((value, index) => {
    const field = names[index]
    const issue = field ? validateField(value, field, format, locale) : undefined
    return issue && field ? [{ field, ...issue }] : []
  })

  if (format === 'quartz') {
    const day = parts[3]!
    const week = parts[5]!
    if ((day === '?') === (week === '?')) {
      errors.push({
        code: 'DAY_WEEK_QUESTION_MARK',
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
      errors: [{ code: 'INVALID_EXPRESSION', message: locale.validation.invalidExpression }],
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

export function isStepEveryField(field: CronFieldName) {
  return field === 'second' || field === 'minute' || field === 'hour'
}

export function getFieldTemplate(field: CronFieldName, mode: CronFieldMode, locale: CronLocale) {
  if (mode === 'unspecified')
    return field === 'day' ? locale.unspecifiedDay : locale.unspecifiedWeek
  if (mode === 'every')
    return isStepEveryField(field) ? locale.everyStep : locale.everyField
  if (mode === 'interval')
    return locale.intervalField
  if (mode === 'specified')
    return locale.specifiedField
  if (mode === 'range')
    return locale.rangeField
  return ''
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

export function describeField(field: CronFieldName, value: string, locale: CronLocale, format: CronFormat = 'quartz') {
  if (isSpecialField(field) && parseSpecial(value, field))
    return describeSpecial(field, value, locale)
  const mode = getFieldMode(value, field)
  const normalizedMode = mode === 'interval' && isStepEveryField(field) && value.startsWith('*/') ? 'every' : mode
  const template = getFieldTemplate(field, normalizedMode, locale)
  return template ? formatCronMessage(template, { field: locale.fields[field], ...getDescriptionValues(field, value, locale, format) }) : ''
}

interface CronstrueApi {
  toString: (expression: string, options?: Record<string, unknown>) => string
  locales?: Record<string, unknown>
}

type IntlListFormatConstructor = new (locales?: string | string[], options?: { type?: 'conjunction' | 'disjunction' }) => {
  format: (values: string[]) => string
}

function getCronstrueApi() {
  const imported = cronstrue as unknown as CronstrueApi & { default?: CronstrueApi }
  return imported.locales ? imported : imported.default!
}

function resolveCronstrueLocale(localeCode = 'en') {
  const normalized = localeCode.replace('-', '_').toLowerCase()
  const direct: Record<string, string> = {
    zh_cn: 'zh_CN',
    zh_tw: 'zh_TW',
    zh_hk: 'zh_TW',
    pt_br: 'pt_BR',
    pt_pt: 'pt_PT',
    en_gb: 'en',
    en_us: 'en',
  }
  const [language, region] = normalized.split('_')
  const candidates = [direct[normalized], region ? `${language}_${region.toUpperCase()}` : undefined, language, 'en'].filter(Boolean) as string[]
  const api = getCronstrueApi()
  return candidates.find(candidate => api.locales && candidate in api.locales) ?? 'en'
}

function describeWithCronstrue(expression: string, localeCode: string, options: CronOptions) {
  const { format } = resolveCronOptions(options)
  return getCronstrueApi().toString(expression, {
    locale: resolveCronstrueLocale(localeCode),
    use24HourTimeFormat: true,
    dayOfWeekStartIndexZero: format === 'unix',
    throwExceptionOnParseError: true,
  })
}

function describeSpecifiedMinutes(expression: string, localeCode: string, options: CronOptions) {
  const { format } = resolveCronOptions(options)
  const parts = expression.trim().split(/\s+/)
  const minuteIndex = format === 'unix' ? 0 : 1
  const hourIndex = format === 'unix' ? 1 : 2
  const secondsIndex = format === 'unix' ? -1 : 0
  const minuteExpression = parts[minuteIndex]
  const hourExpression = parts[hourIndex]

  if (!minuteExpression?.includes(',') || !hourExpression || !/^\d+$/.test(hourExpression) || (secondsIndex >= 0 && !/^0+$/.test(parts[secondsIndex] ?? '')))
    return undefined

  const minutes = minuteExpression.split(',')
  if (minutes.length < 2 || minutes.some(value => !/^\d+$/.test(value) || Number(value) < 0 || Number(value) > 59))
    return undefined

  const descriptions = minutes.map((minute) => {
    const singleParts = [...parts]
    singleParts[minuteIndex] = minute
    return describeWithCronstrue(singleParts.join(' '), localeCode, options)
  })
  const timePattern = /\d{1,2}:\d{2}(?::\d{2})?/
  const times = descriptions.map(description => description.match(timePattern)?.[0])
  if (times.some(time => !time))
    return undefined

  let timeList: string
  try {
    const ListFormat = (Intl as typeof Intl & { ListFormat?: IntlListFormatConstructor }).ListFormat
    timeList = ListFormat
      ? new ListFormat(localeCode.replace('_', '-'), { type: 'conjunction' }).format(times as string[])
      : times.join(', ')
  }
  catch {
    timeList = times.join(', ')
  }
  return descriptions[0]!.replace(timePattern, timeList)
}

export function describeExpression(expression: string, localeCode = 'en', options: CronOptions = {}): string {
  const description = describeWithCronstrue(expression, localeCode, options)
  return describeSpecifiedMinutes(expression, localeCode, options) ?? description
}

export function getPreview(expression: string, options: CronOptions = {}, locale: CronLocale = enUS, localeCode = 'en'): CronPreviewResult {
  const validation = validateExpression(expression, options, locale)
  if (validation.status !== 'valid' || !validation.expression)
    return { expression }
  const cron = createCron(validation.expression, options)
  let description: string | undefined
  try {
    description = describeExpression(validation.expression, localeCode, options)
  }
  catch {}
  return {
    expression: validation.expression,
    description,
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
