import type { CronFieldName } from '../types'
import { QUARTZ_WEEK_ALIASES } from './format'

export type CronSpecial
  = | { type: 'last' }
    | { type: 'lastWeekday' }
    | { type: 'nearestWeekday', day: number }
    | { type: 'lastDayOfWeek', week: number }
    | { type: 'nthDayOfWeek', week: number, nth: number }

function parseQuartzWeek(token: string): number | undefined {
  const alias = QUARTZ_WEEK_ALIASES[token]
  if (alias)
    return alias
  const value = Number(token)
  return Number.isInteger(value) && value >= 1 && value <= 7 ? value : undefined
}

export function isSpecialField(field: CronFieldName): field is 'day' | 'week' {
  return field === 'day' || field === 'week'
}

export function parseSpecial(value: string, field: 'day' | 'week'): CronSpecial | undefined {
  const normalized = value.trim().toUpperCase()
  if (!normalized)
    return undefined

  if (field === 'day') {
    if (normalized === 'L')
      return { type: 'last' }
    if (normalized === 'LW')
      return { type: 'lastWeekday' }
    const nearest = /^([1-9]|[12]\d|3[01])W$/.exec(normalized)
    if (!nearest)
      return undefined
    const day = Number(nearest[1])
    return day >= 1 && day <= 31 ? { type: 'nearestWeekday', day } : undefined
  }

  const last = /^([1-7]|SUN|MON|TUE|WED|THU|FRI|SAT)L$/.exec(normalized)
  if (last) {
    const week = parseQuartzWeek(last[1]!)
    return week ? { type: 'lastDayOfWeek', week } : undefined
  }

  const nth = /^([1-7]|SUN|MON|TUE|WED|THU|FRI|SAT)#([1-5])$/.exec(normalized)
  if (!nth)
    return undefined
  const week = parseQuartzWeek(nth[1]!)
  const occurrence = Number(nth[2])
  return week ? { type: 'nthDayOfWeek', week, nth: occurrence } : undefined
}

export function serializeSpecial(special: CronSpecial): string {
  switch (special.type) {
    case 'last':
      return 'L'
    case 'lastWeekday':
      return 'LW'
    case 'nearestWeekday':
      return `${special.day}W`
    case 'lastDayOfWeek':
      return `${special.week}L`
    case 'nthDayOfWeek':
      return `${special.week}#${special.nth}`
  }
}

export function looksLikeSpecial(value: string): boolean {
  return value.trim().toUpperCase().split(',').some((segment) => {
    return segment === 'L'
      || segment === 'LW'
      || /^L-\d+$/.test(segment)
      || /^\d+W$/.test(segment)
      || segment.includes('#')
      || /^\d+L$/.test(segment)
      || /^(SUN|MON|TUE|WED|THU|FRI|SAT)L$/.test(segment)
  })
}
