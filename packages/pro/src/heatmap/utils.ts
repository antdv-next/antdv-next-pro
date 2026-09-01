import type { HeatmapData, HeatmapDataItem, HeatmapFirstDayOfWeek, HeatmapRange } from './types'

const DAY_MS = 24 * 60 * 60 * 1000

export interface HeatmapCell {
  timestamp?: number
  date?: Date
  value: number | null
  item?: HeatmapDataItem
  level: number
  placeholder: boolean
}

export interface CalendarRange {
  start: number
  end: number
}

function utcDayTimestamp(timestamp: number) {
  const date = new Date(timestamp)
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

function dayOfWeek(timestamp: number) {
  return new Date(timestamp).getUTCDay()
}

function startOfWeek(timestamp: number, firstDayOfWeek: HeatmapFirstDayOfWeek) {
  const offset = (dayOfWeek(timestamp) - firstDayOfWeek + 7) % 7
  return timestamp - offset * DAY_MS
}

function endOfWeek(timestamp: number, firstDayOfWeek: HeatmapFirstDayOfWeek) {
  return startOfWeek(timestamp, firstDayOfWeek) + 6 * DAY_MS
}

function isTimestamp(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && !Number.isNaN(new Date(value).getTime())
}

export function resolveRange(range: 'recent' | number | HeatmapRange | undefined, now = Date.now()): CalendarRange {
  const today = utcDayTimestamp(now)

  if (range === undefined || range === 'recent') {
    return { start: today - 364 * DAY_MS, end: today }
  }

  if (typeof range === 'number' && Number.isInteger(range)) {
    const start = Date.UTC(range, 0, 1)
    const end = Date.UTC(range, 11, 31)
    if (Number.isFinite(start) && Number.isFinite(end)) {
      return { start, end }
    }
  }

  if (typeof range === 'object' && range && isTimestamp(range.start) && isTimestamp(range.end)) {
    const start = utcDayTimestamp(range.start)
    const end = utcDayTimestamp(range.end)
    return start <= end ? { start, end } : { start: end, end: start }
  }

  return { start: today - 364 * DAY_MS, end: today }
}

export function normalizeData(data: HeatmapData | undefined) {
  const result = new Map<number, HeatmapDataItem>()

  for (const item of data ?? []) {
    if (!isTimestamp(item?.timestamp)) {
      continue
    }
    if (item.value !== undefined && item.value !== null && (!Number.isFinite(item.value) || item.value < 0)) {
      continue
    }
    result.set(utcDayTimestamp(item.timestamp), item)
  }

  return result
}

export function getColorLevel(value: number | null, minimum: number, maximum: number, activeColorCount: number) {
  if (value === null) {
    return 0
  }
  if (maximum <= minimum || activeColorCount <= 0) {
    return 1
  }

  const totalColorCount = activeColorCount + 1
  const ratio = Math.min(Math.max((value - minimum) / (maximum - minimum), 0), 1)

  return Math.min(Math.floor(ratio * totalColorCount) + 1, totalColorCount)
}

export function createCalendar(
  range: CalendarRange,
  data: Map<number, HeatmapDataItem>,
  firstDayOfWeek: HeatmapFirstDayOfWeek,
  fillCalendarLeading: boolean,
  activeColorCount: number,
) {
  const dataRangeStart = fillCalendarLeading ? startOfWeek(range.start, firstDayOfWeek) : range.start
  const calendarStart = startOfWeek(range.start, firstDayOfWeek)
  const calendarEnd = endOfWeek(range.end, firstDayOfWeek)
  const values = [...data.entries()]
    .filter(([timestamp, item]) => timestamp >= dataRangeStart && timestamp <= range.end && typeof item.value === 'number')
    .map(([, item]) => item.value as number)
  const minimum = values.length ? Math.min(...values) : 0
  const maximum = values.length ? Math.max(...values) : 0
  const columns = Math.floor((calendarEnd - calendarStart) / (7 * DAY_MS)) + 1

  return Array.from({ length: 7 }, (_, row) => Array.from({ length: columns }, (_, column) => {
    const timestamp = calendarStart + (column * 7 + row) * DAY_MS
    const inRange = timestamp >= dataRangeStart && timestamp <= range.end

    if (!inRange) {
      return { value: null, level: 0, placeholder: true } satisfies HeatmapCell
    }

    const item = data.get(timestamp)
    const value = typeof item?.value === 'number' ? item.value : null
    return {
      timestamp,
      date: new Date(timestamp),
      value,
      item,
      level: getColorLevel(value, minimum, maximum, activeColorCount),
      placeholder: false,
    } satisfies HeatmapCell
  }))
}

export function formatGap(value: number | string | undefined) {
  return typeof value === 'number' ? `${value}px` : value
}
