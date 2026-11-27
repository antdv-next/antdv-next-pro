import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { formatValue, getDraftValue, isEmptyValue, normalizeNumberRange, normalizeOptions, truncateNodes } from '../utils'

const texts = { rangeSeparator: ' ~ ', valueSeparator: ', ' }

describe('CategorySearch utils', () => {
  it('normalizes groups and de-duplicates dimensions', () => {
    const { entries, options, optionMap } = normalizeOptions([
      { label: 'A', value: 'a' },
      { label: 'Group', options: [{ label: 'B', value: 'b' }, { label: 'A again', value: 'a' }] },
    ])
    expect(entries.map(entry => entry.kind)).toEqual(['option', 'group', 'option'])
    expect(options.map(option => option.value)).toEqual(['a', 'b'])
    expect(optionMap.get('a')?.label).toBe('A')
  })

  it('treats empty values per type', () => {
    expect(isEmptyValue(undefined, 'select')).toBe(true)
    expect(isEmptyValue([], 'select')).toBe(true)
    expect(isEmptyValue('', 'select')).toBe(true)
    expect(isEmptyValue(0, 'select')).toBe(false)
    expect(isEmptyValue('  ', 'input')).toBe(true)
    expect(isEmptyValue([null, null], 'numberRange')).toBe(true)
    expect(isEmptyValue([0, null], 'numberRange')).toBe(false)
    expect(isEmptyValue(null, 'dateRange')).toBe(true)
    expect(isEmptyValue({}, 'custom')).toBe(false)
  })

  it('creates draft values', () => {
    expect(getDraftValue({ value: 'a', multiple: true }, undefined)).toEqual([])
    expect(getDraftValue({ value: 'a', type: 'numberRange' }, [1])).toEqual([1, null])
    expect(getDraftValue({ value: 'a', type: 'input' }, undefined)).toBe('')
    expect(getDraftValue({ value: 'a' }, 'x')).toBe('x')
  })

  it('swaps reversed number ranges', () => {
    expect(normalizeNumberRange([5, 1])).toEqual([1, 5])
    expect(normalizeNumberRange([5, null])).toEqual([5, null])
  })

  it('formats values', () => {
    const select = { value: 's', children: [{ label: 'One', value: 1 }, { label: 'Two', value: 2 }] }
    expect(formatValue(select, 1, texts)).toEqual(['One'])
    expect(formatValue({ ...select, multiple: true }, [1, 2, 3], texts)).toEqual(['One', ', ', 'Two', ', ', '3'])
    expect(formatValue({ value: 'd', type: 'dateRange' }, [dayjs('2026-01-02'), dayjs('2026-02-03')], texts)).toEqual(['2026-01-02 ~ 2026-02-03'])
    expect(formatValue({ value: 'd', type: 'dateRange', componentProps: { format: 'YYYY/MM' } }, [dayjs('2026-01-02'), dayjs('2026-02-03')], texts)).toEqual(['2026/01 ~ 2026/02'])
    expect(formatValue({ value: 'c', type: 'custom' }, ['a', 'b'], texts)).toEqual(['a, b'])
  })

  it('truncates plain text only', () => {
    expect(truncateNodes(['abc', 'def'], 4)).toEqual(['abcd...'])
    expect(truncateNodes(['abc'], 4)).toEqual(['abc'])
    const vnode = { type: 'b' }
    expect(truncateNodes([vnode], 1)).toEqual([vnode])
  })
})
