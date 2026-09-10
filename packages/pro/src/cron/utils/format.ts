import type { CronFieldName, CronFields, CronFormat, CronOptions } from '../types'

export const MONTH_VALUES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] as const
export const WEEK_VALUES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const

export const MONTH_ALIASES: Record<string, number> = {
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

export const QUARTZ_WEEK_ALIASES: Record<string, number> = {
  SUN: 1,
  MON: 2,
  TUE: 3,
  WED: 4,
  THU: 5,
  FRI: 6,
  SAT: 7,
}

export const UNIX_WEEK_ALIASES: Record<string, number> = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
}

export interface CronResolvedOptions {
  format: CronFormat
  showYear: boolean
}

export function resolveCronOptions(options: CronOptions = {}): CronResolvedOptions {
  const format = options.format ?? 'quartz'
  return {
    format,
    showYear: format === 'unix' ? false : Boolean(options.showYear),
  }
}

export function getFieldNames(options: CronOptions = {}): CronFieldName[] {
  const { format, showYear } = resolveCronOptions(options)
  if (format === 'unix')
    return ['minute', 'hour', 'day', 'month', 'week']
  return showYear
    ? ['second', 'minute', 'hour', 'day', 'month', 'week', 'year']
    : ['second', 'minute', 'hour', 'day', 'month', 'week']
}

export function getFieldLimits(format: CronFormat = 'quartz'): Record<CronFieldName, readonly [number, number]> {
  return {
    second: [0, 59],
    minute: [0, 59],
    hour: [0, 23],
    day: [1, 31],
    month: [1, 12],
    week: format === 'unix' ? [0, 7] : [1, 7],
    year: [1, 9999],
  }
}

export function getWeekAliases(format: CronFormat): Record<string, number> {
  return format === 'unix' ? UNIX_WEEK_ALIASES : QUARTZ_WEEK_ALIASES
}

export function createDefaultFields(options: CronOptions = {}): CronFields {
  const { format, showYear } = resolveCronOptions(options)
  if (format === 'unix') {
    return {
      minute: '*',
      hour: '*',
      day: '*',
      month: '*',
      week: '*',
    }
  }
  return {
    second: '0',
    minute: '0',
    hour: '*',
    day: '*',
    month: '*',
    week: '?',
    ...(showYear ? { year: '*' } : {}),
  }
}

export function weekNumberToName(value: number, format: CronFormat): string | undefined {
  if (format === 'unix') {
    if (value === 0 || value === 7)
      return 'SUN'
    return WEEK_VALUES[value]
  }
  return WEEK_VALUES[value - 1]
}
