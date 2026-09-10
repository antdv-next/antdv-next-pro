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
    expect(validateExpression(expression)).toEqual({ status: 'valid', expression })
  })

  it('accepts a year only when showYear is enabled', () => {
    const expression = '0 0 9 ? * MON 2026'

    expect(validateExpression(expression).status).toBe('invalid')
    expect(validateExpression(expression, true)).toEqual({ status: 'valid', expression })
  })

  it('rejects formats and syntax outside the Quartz V1 contract', () => {
    expect(validateExpression('* * * * *').status).toBe('invalid')
    expect(validateExpression('0 0 9 L * ?').status).toBe('invalid')
    expect(validateExpression('0 0 9 15W * ?').status).toBe('invalid')
    expect(validateExpression('0 0 9 ? * MON#2').status).toBe('invalid')
    expect(validateExpression('0 ? 9 * * ?').status).toBe('invalid')
    expect(validateExpression('0 0 9 * * *').status).toBe('invalid')
    expect(validateExpression('0 0 9 ? * ?').status).toBe('invalid')
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

    expect(getPreview('0 0 9 * * ?', false, zhCN).description).toBe('每天 09:00 执行')
    expect(getPreview('0 30 9 ? * MON-FRI', false, zhCN).description).toBe('每周一至周五 09:30 执行')
    expect(getPreview('0 0 9 1 * ?', false, zhCN).description).toBe('每月第 1 日 09:00 执行')
    expect(getPreview('0 */5 * * * ?', false, zhCN).description).toBe('从 0 分钟开始，每 5 分钟执行')
    expect(getPreview('*/5 * * * * ?', false, zhCN).description).toBe('从 0 秒开始，每 5 秒执行')
    expect(getPreview('0 0 */2 * * ?', false, zhCN).description).toBe('从 0 点开始，每 2 小时执行')
    expect(getPreview('0 0 9,18 * * ?', false, zhCN).description).toBe('每天 9、18 点执行')
    expect(getPreview('0 0 9 ? * MON', false, zhCN).description).toBe('每周一 09:00 执行')
    expect(getPreview('0 1/5 * * * ?', false, zhCN).description).toBe('从 1 分钟开始，每 5 分钟执行')
  })

  it('localizes descriptions and validation errors', () => {
    expect(getPreview('0 */5 * * * ?', false, zhCN).description).toBe('从 0 分钟开始，每 5 分钟执行')
    expect(validateExpression('* * * * *', false, zhCN).errors?.[0]?.message).toBe('当前 Quartz 格式需要 6 个字段')
  })
})
