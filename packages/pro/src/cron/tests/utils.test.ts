import { describe, expect, it } from 'vitest'
import zhCNLocale from '../../locale/zh_CN'
import {
  createDefaultFields,
  describeExpression,
  formatExpression,
  getFieldMode,
  getPreview,
  parseExpression,
  updateField,
  validateExpression,
} from '../utils'

describe('Cron utilities', () => {
  const zhCN = zhCNLocale.Cron!

  it('parses and formats the Quartz six-field format', () => {
    const expression = '0 0/5 * * * ?'

    expect(parseExpression(expression)).toMatchObject({ second: '0', minute: '0/5', week: '?' })
    expect(formatExpression(createDefaultFields())).toBe('0 0 * * * ?')
    expect(formatExpression(createDefaultFields({ format: 'unix' }), { format: 'unix' })).toBe('* * * * *')
    expect(validateExpression(expression)).toEqual({ status: 'valid', expression })
  })

  it('accepts a year only when showYear is enabled', () => {
    const expression = '0 0 9 ? * MON 2026'

    expect(validateExpression(expression).status).toBe('invalid')
    expect(validateExpression(expression, { showYear: true })).toEqual({ status: 'valid', expression })
  })

  it('rejects unix length and mixed day/week values in Quartz', () => {
    expect(validateExpression('* * * * *').status).toBe('invalid')
    expect(validateExpression('0 ? 9 * * ?').status).toBe('invalid')
    expect(validateExpression('0 0 9 * * *').status).toBe('invalid')
    expect(validateExpression('0 0 9 ? * ?').status).toBe('invalid')
  })

  it('accepts quartz special syntax supported by Croner', () => {
    expect(validateExpression('0 0 9 L * ?')).toEqual({ status: 'valid', expression: '0 0 9 L * ?' })
    expect(validateExpression('0 0 9 LW * ?')).toEqual({ status: 'valid', expression: '0 0 9 LW * ?' })
    expect(validateExpression('0 0 9 15W * ?')).toEqual({ status: 'valid', expression: '0 0 9 15W * ?' })
    expect(validateExpression('0 0 9 ? * 6L')).toEqual({ status: 'valid', expression: '0 0 9 ? * 6L' })
    expect(validateExpression('0 0 9 ? * 6#3')).toEqual({ status: 'valid', expression: '0 0 9 ? * 6#3' })
    expect(validateExpression('0 0 9 ? * MON#2')).toEqual({ status: 'valid', expression: '0 0 9 ? * MON#2' })
    expect(validateExpression('0 0 9 ? * FRIL')).toEqual({ status: 'valid', expression: '0 0 9 ? * FRIL' })
  })

  it('rejects unsupported or misplaced special syntax', () => {
    expect(validateExpression('0 0 9 L-3 * ?').status).toBe('invalid')
    expect(validateExpression('0 0 9 0W * ?').status).toBe('invalid')
    expect(validateExpression('0 0 9 32W * ?').status).toBe('invalid')
    expect(validateExpression('0 0 9 ? * 8L').status).toBe('invalid')
    expect(validateExpression('0 0 9 ? * 6#0').status).toBe('invalid')
    expect(validateExpression('0 0 9 ? * 6#6').status).toBe('invalid')
    expect(validateExpression('0 0 9 * L ?').status).toBe('invalid')
    expect(validateExpression('0 0 9 6#3 * ?').status).toBe('invalid')
    expect(validateExpression('0 0 9 ? * 15W').status).toBe('invalid')
  })

  it('validates unix five-field expressions independently from quartz', () => {
    expect(validateExpression('* * * * *', { format: 'unix' })).toEqual({ status: 'valid', expression: '* * * * *' })
    expect(validateExpression('*/5 * * * *', { format: 'unix' })).toEqual({ status: 'valid', expression: '*/5 * * * *' })
    expect(validateExpression('0 9 * * 1-5', { format: 'unix' })).toEqual({ status: 'valid', expression: '0 9 * * 1-5' })
    expect(validateExpression('0 9 1 * 1', { format: 'unix' })).toEqual({ status: 'valid', expression: '0 9 1 * 1' })
    expect(validateExpression('0 9 * * 0', { format: 'unix' })).toEqual({ status: 'valid', expression: '0 9 * * 0' })
    expect(validateExpression('0 9 * * 7', { format: 'unix' })).toEqual({ status: 'valid', expression: '0 9 * * 7' })
    expect(validateExpression('0 9 * * SUN', { format: 'unix' })).toEqual({ status: 'valid', expression: '0 9 * * SUN' })
    expect(parseExpression('0 9 * * 7', { format: 'unix' })).toMatchObject({ week: '7' })
    expect(validateExpression('0 0 9 * * ?', { format: 'unix' }).status).toBe('invalid')
    expect(validateExpression('0 9 * * L', { format: 'unix' }).status).toBe('invalid')
    expect(validateExpression('0 9 * * ?', { format: 'unix' }).status).toBe('invalid')
    expect(validateExpression('* * * * *').status).toBe('invalid')
  })

  it.each([
    '0 */5 9-17 ? JAN-MAR MON-FRI',
    '0 0 9 ? JAN,MAR MON,WED,FRI',
    '0 0/10 9 ? * MON',
  ])('accepts supported range, list, interval, and named fields: %s', (expression) => {
    expect(validateExpression(expression)).toEqual({ status: 'valid', expression })
  })

  it.each([
    '0 */61 9 * * ?',
    '0 0 17-9 * * ?',
    '0 0 9 * 13 ?',
    '0 0 9 * * MONDAY',
  ])('rejects out-of-range and malformed fields: %s', (expression) => {
    expect(validateExpression(expression).status).toBe('invalid')
  })

  it.each([
    ['* * * * *', {}, 'EXPECTED_FIELDS'],
    ['0 0 9 * * ?', { format: 'unix' as const }, 'EXPECTED_UNIX_FIELDS'],
    ['0 /5 * * * ?', {}, 'INVALID_STEP'],
    ['0 */61 9 * * ?', {}, 'STEP_OUT_OF_RANGE'],
    ['0 1-2-3 9 * * ?', {}, 'INVALID_RANGE'],
    ['0 0 9 * 13 ?', {}, 'VALUE_OUT_OF_RANGE'],
    ['0 0 17-9 * * ?', {}, 'RANGE_ORDER'],
    ['0 ? 9 * * ?', {}, 'QUESTION_MARK_FIELD'],
    ['0 0 9 1? * ?', {}, 'QUESTION_MARK_ALONE'],
    ['0 0 9 * * *', {}, 'DAY_WEEK_QUESTION_MARK'],
    ['0 9 * * ?', { format: 'unix' as const }, 'UNIX_QUESTION_MARK'],
    ['0 0 9 L-3 * ?', {}, 'UNSUPPORTED_SPECIAL'],
    ['0 9 * * 1@', { format: 'unix' as const }, 'UNSUPPORTED_CHARACTER'],
  ])('reports a stable error code for %s', (expression, options, code) => {
    expect(validateExpression(expression, options).errors?.[0]?.code).toBe(code)
  })

  it('keeps the day and week fields valid when editing either field', () => {
    const fields = createDefaultFields()
    const day = updateField(fields, 'day', '?')
    const week = updateField(day, 'week', 'MON')

    expect(day.week).toBe('*')
    expect(week.day).toBe('?')
    expect(getFieldMode('?')).toBe('unspecified')
    expect(getFieldMode('*')).toBe('every')
    expect(getFieldMode('1,3,5')).toBe('specified')
  })

  it('uses Croner to calculate a next execution time', () => {
    const preview = getPreview('0 */5 * * * ?')

    expect(preview.description).toBe('Every 5 minutes')
    expect(preview.nextRunAt).toBeInstanceOf(Date)
    expect(preview.nextRuns).toHaveLength(3)
    expect(preview.nextRuns?.every(value => value instanceof Date)).toBe(true)
  })

  it('describes expressions with cronstrue', () => {
    expect(getPreview('0 0 9 * * ?').description).toBe('At 09:00')
    expect(getPreview('0 0,1,2,4 9 * * ?', {}, zhCN, 'zh-cn').description).toBe('在09:00、09:01、09:02和09:04')
    expect(getPreview('0 30 9 ? * MON-FRI').description).toBe('At 09:30, Monday through Friday')
    expect(getPreview('0 0 9 1 * ?').description).toBe('At 09:00, on day 1 of the month')
    expect(getPreview('*/5 * * * * ?').description).toBe('Every 5 seconds')
    expect(getPreview('0 */5 * * * ?', {}, zhCN, 'zh-cn').description).toBe('每隔 5 分钟')
    expect(getPreview('0 0 9 ? * MON,FRI').description).toBe('At 09:00, only on Monday and Friday')
  })

  it('describes quartz special syntax', () => {
    expect(getPreview('0 0 9 L * ?').description).toBe('At 09:00, on the last day of the month')
    expect(getPreview('0 0 9 LW * ?').description).toBe('At 09:00, on the last weekday of the month')
    expect(getPreview('0 0 9 15W * ?').description).toBe('At 09:00, on the weekday nearest day 15 of the month')
    expect(getPreview('0 0 9 ? * 6L').description).toBe('At 09:00, on the last Friday of the month')
    expect(getPreview('0 0 9 ? * 6#3').description).toBe('At 09:00, on the third Friday of the month')
  })

  it('uses Croner last-day semantics after replacing quartz ?', () => {
    const preview = getPreview('0 0 9 L * ?')
    const first = preview.nextRuns?.[0]
    expect(first).toBeInstanceOf(Date)
    const lastDay = new Date(first!.getFullYear(), first!.getMonth() + 1, 0).getDate()
    expect(first!.getDate()).toBe(lastDay)
  })

  it('describes unix five-field expressions', () => {
    expect(getPreview('*/5 * * * *', { format: 'unix' }).description).toBe('Every 5 minutes')
    expect(getPreview('0 9 * * 1-5', { format: 'unix' }).description).toBe('At 09:00, Monday through Friday')
    expect(getPreview('30 9 1 * *', { format: 'unix' }).description).toBe('At 09:30, on day 1 of the month')
  })

  it('describes unix day and week together as OR', () => {
    const options = { format: 'unix' as const }
    const fields = parseExpression('0 9 1 * 1', options)
    expect(fields).toMatchObject({ day: '1', week: '1' })
    expect(describeExpression('0 9 1 * 1', 'zh-cn', options)).toBe('在09:00, 限每月 1 号, 或者为星期一')
    expect(getPreview('0 9 1 * 1', options).description).toBe('At 09:00, on day 1 of the month, and on Monday')
    expect(getPreview('0 9 1 * 1', options, zhCN, 'zh-cn').description).toBe('在09:00, 限每月 1 号, 或者为星期一')
  })

  it('localizes descriptions and validation errors', () => {
    expect(getPreview('0 */5 * * * ?', {}, zhCN, 'zh-cn').description).toBe('每隔 5 分钟')
    expect(validateExpression('* * * * *', {}, zhCN).errors?.[0]).toMatchObject({
      code: 'EXPECTED_FIELDS',
      message: '当前 Quartz 格式需要 6 个字段',
    })
    expect(validateExpression('* * * * *').errors?.[0]?.code).toBe('EXPECTED_FIELDS')
  })
})
