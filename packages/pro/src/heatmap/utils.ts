import type { HeatmapData, HeatmapDataItem, HeatmapFirstDayOfWeek, HeatmapRange, HeatmapTimeZone } from './types'
import { HEATMAP_ACTIVE_COLOR_COUNT } from './types'

const DAY_MS = 24 * 60 * 60 * 1000
const MIN_CALENDAR_YEAR = 1970
const MAX_CALENDAR_YEAR = 2100
const warnedInvalidRangeYears = new Set<number>()

export interface HeatmapCell {
  /**
   * 该日期在 `timeZone` 下零点的时间戳（`UTC` 为 UTC 零点，`local` 为本地零点）。
   */
  timestamp?: number
  /** 与 `timestamp` 对应的 Date。 */
  date?: Date
  /**
   * 日历日的内部键：该日历日（年 / 月 / 日）的 UTC 零点时间戳。
   * 日历运算与格式化都基于它，因此不受夏令时影响。
   */
  dayKey?: number
  value: number | null
  item?: HeatmapDataItem
  level: number
  placeholder: boolean
}

export interface CalendarRange {
  start: number
  end: number
}

/**
 * 把任意时间戳归一成「日历日键」：该时间戳在 `timeZone` 下所属日历日的 UTC 零点。
 */
export function toDayKey(timestamp: number, timeZone: HeatmapTimeZone = 'UTC') {
  const date = new Date(timestamp)
  return timeZone === 'local'
    ? Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    : Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

/**
 * 把日历日键还原成 `timeZone` 下该日零点的 Date。
 */
export function fromDayKey(dayKey: number, timeZone: HeatmapTimeZone = 'UTC') {
  const date = new Date(dayKey)
  return timeZone === 'local'
    ? new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    : date
}

function dayOfWeek(dayKey: number) {
  return new Date(dayKey).getUTCDay()
}

function startOfWeek(dayKey: number, firstDayOfWeek: HeatmapFirstDayOfWeek) {
  const offset = (dayOfWeek(dayKey) - firstDayOfWeek + 7) % 7
  return dayKey - offset * DAY_MS
}

function endOfWeek(dayKey: number, firstDayOfWeek: HeatmapFirstDayOfWeek) {
  return startOfWeek(dayKey, firstDayOfWeek) + 6 * DAY_MS
}

function isTimestamp(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && !Number.isNaN(new Date(value).getTime())
}

function warnInvalidRangeYear(year: number) {
  if (!import.meta.env?.DEV || warnedInvalidRangeYears.has(year)) {
    return
  }

  warnedInvalidRangeYears.add(year)
  console.warn(
    `[Heatmap] \`range\` year must be an integer between ${MIN_CALENDAR_YEAR} and ${MAX_CALENDAR_YEAR}; received ${year}. Falling back to \`recent\`.`,
  )
}

/**
 * 返回的 `start` / `end` 是日历日键（见 `toDayKey`）。
 */
export function resolveRange(
  range: 'recent' | number | HeatmapRange | undefined,
  now = Date.now(),
  timeZone: HeatmapTimeZone = 'UTC',
): CalendarRange {
  const today = toDayKey(now, timeZone)

  if (range === undefined || range === 'recent') {
    return { start: today - 364 * DAY_MS, end: today }
  }

  if (typeof range === 'number') {
    if (Number.isInteger(range) && range >= MIN_CALENDAR_YEAR && range <= MAX_CALENDAR_YEAR) {
      return {
        start: Date.UTC(range, 0, 1),
        end: Date.UTC(range, 11, 31),
      }
    }

    warnInvalidRangeYear(range)
  }

  if (typeof range === 'object' && range && isTimestamp(range.start) && isTimestamp(range.end)) {
    const start = toDayKey(range.start, timeZone)
    const end = toDayKey(range.end, timeZone)
    return start <= end ? { start, end } : { start: end, end: start }
  }

  return { start: today - 364 * DAY_MS, end: today }
}

/**
 * 返回以日历日键为 key 的数据表。
 */
export function normalizeData(data: HeatmapData | undefined, timeZone: HeatmapTimeZone = 'UTC') {
  const result = new Map<number, HeatmapDataItem>()

  for (const item of data ?? []) {
    if (!isTimestamp(item?.timestamp)) {
      continue
    }
    if (item.value !== undefined && item.value !== null && (!Number.isFinite(item.value) || item.value < 0)) {
      continue
    }
    result.set(toDayKey(item.timestamp, timeZone), item)
  }

  return result
}

export function getColorLevel(value: number | null, minimum: number, maximum: number) {
  if (value === null) {
    return 0
  }
  if (maximum <= minimum) {
    return 1
  }

  const totalColorCount = HEATMAP_ACTIVE_COLOR_COUNT + 1
  const ratio = Math.min(Math.max((value - minimum) / (maximum - minimum), 0), 1)

  return Math.min(Math.floor(ratio * totalColorCount) + 1, totalColorCount)
}

export function createCalendar(
  range: CalendarRange,
  data: Map<number, HeatmapDataItem>,
  firstDayOfWeek: HeatmapFirstDayOfWeek,
  fillCalendarLeading: boolean,
  timeZone: HeatmapTimeZone = 'UTC',
) {
  const calendarStart = startOfWeek(range.start, firstDayOfWeek)
  const calendarDataStart = fillCalendarLeading ? calendarStart : range.start
  const calendarEnd = endOfWeek(range.end, firstDayOfWeek)
  const values = [...data.entries()]
    .filter(([dayKey, item]) => dayKey >= range.start && dayKey <= range.end && typeof item.value === 'number')
    .map(([, item]) => item.value as number)
  const minimum = values.length ? Math.min(...values) : 0
  const maximum = values.length ? Math.max(...values) : 0
  const columns = Math.floor((calendarEnd - calendarStart) / (7 * DAY_MS)) + 1

  return Array.from({ length: 7 }, (_, row) => Array.from({ length: columns }, (_, column) => {
    const dayKey = calendarStart + (column * 7 + row) * DAY_MS
    const inRange = dayKey >= calendarDataStart && dayKey <= range.end

    if (!inRange) {
      return { value: null, level: 0, placeholder: true } satisfies HeatmapCell
    }

    const item = data.get(dayKey)
    const value = typeof item?.value === 'number' ? item.value : null
    const date = fromDayKey(dayKey, timeZone)
    return {
      timestamp: date.getTime(),
      date,
      dayKey,
      value,
      item,
      level: getColorLevel(value, minimum, maximum),
      placeholder: false,
    } satisfies HeatmapCell
  }))
}

export function formatGap(value: number | string | undefined) {
  return typeof value === 'number' ? `${value}px` : value
}
