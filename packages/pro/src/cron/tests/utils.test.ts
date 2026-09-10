import { describe, expect, it } from 'vitest'
import zhCNLocale from '../../locale/zh_CN'
import {
  createDefaultFields,
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

    expect(preview.description).toBe('Start at minute 0, then execute every 5 minutes')
    expect(preview.nextRunAt).toBeInstanceOf(Date)
    expect(preview.nextRuns).toHaveLength(3)
    expect(preview.nextRuns?.every(value => value instanceof Date)).toBe(true)
  })

  it('describes common schedules in human language', () => {
    expect(getPreview('0 0 9 * * ?').description).toBe('Every day at 09:00')
    expect(getPreview('0 30 9 ? * MON-FRI').description).toBe('Execute from Mon to Fri every week at 09:30')
    expect(getPreview('0 0 9 1 * ?').description).toBe('Execute on days 1 of each month at 09:00')
    expect(getPreview('*/5 * * * * ?').description).toBe('Start at second 0, then execute every 5 seconds')

    expect(getPreview('0 0 9 * * ?', {}, zhCN).description).toBe('每天 09:00 执行')
    expect(getPreview('0 30 9 ? * MON-FRI', {}, zhCN).description).toBe('每周一至周五 09:30 执行')
    expect(getPreview('0 0 9 1 * ?', {}, zhCN).description).toBe('每月第 1 日 09:00 执行')
    expect(getPreview('0 */5 * * * ?', {}, zhCN).description).toBe('从 0 分钟开始，每 5 分钟执行')
    expect(getPreview('*/5 * * * * ?', {}, zhCN).description).toBe('从 0 秒开始，每 5 秒执行')
    expect(getPreview('0 0 */2 * * ?', {}, zhCN).description).toBe('从 0 点开始，每 2 小时执行')
    expect(getPreview('0 0 9,18 * * ?', {}, zhCN).description).toBe('每天 9、18 点执行')
    expect(getPreview('0 0 9 ? * MON', {}, zhCN).description).toBe('每周一 09:00 执行')
    expect(getPreview('0 1/5 * * * ?', {}, zhCN).description).toBe('从 1 分钟开始，每 5 分钟执行')
  })

  it('describes quartz special syntax', () => {
    expect(getPreview('0 0 9 L * ?').description).toBe('the last day of each month at 09:00')
    expect(getPreview('0 0 9 LW * ?').description).toBe('the last weekday of each month at 09:00')
    expect(getPreview('0 0 9 15W * ?').description).toBe('the nearest weekday to day 15 of each month at 09:00')
    expect(getPreview('0 0 9 ? * 6L').description).toBe('the last Fri of each month at 09:00')
    expect(getPreview('0 0 9 ? * 6#3').description).toBe('the 3rd Fri of each month at 09:00')
  })

  it('uses Croner last-day semantics after replacing quartz ?', () => {
    const preview = getPreview('0 0 9 L * ?')
    const first = preview.nextRuns?.[0]
    expect(first).toBeInstanceOf(Date)
    const lastDay = new Date(first!.getFullYear(), first!.getMonth() + 1, 0).getDate()
    expect(first!.getDate()).toBe(lastDay)
  })

  it('describes unix five-field expressions', () => {
    expect(getPreview('*/5 * * * *', { format: 'unix' }).description).toBe('Start at minute 0, then execute every 5 minutes')
    expect(getPreview('0 9 * * 1-5', { format: 'unix' }).description).toBe('Execute from Mon to Fri every week at 09:00')
    expect(getPreview('30 9 1 * *', { format: 'unix' }).description).toBe('Execute on days 1 of each month at 09:30')
  })

  it('localizes descriptions and validation errors', () => {
    expect(getPreview('0 */5 * * * ?', {}, zhCN).description).toBe('从 0 分钟开始，每 5 分钟执行')
    expect(validateExpression('* * * * *', {}, zhCN).errors?.[0]?.message).toBe('当前 Quartz 格式需要 6 个字段')
  })
})
