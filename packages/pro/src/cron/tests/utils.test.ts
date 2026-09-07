import { describe, expect, it } from 'vitest'
import zhCN from '../locale/zh_CN'
import {
  createDefaultFields,
  formatExpression,
  getPreview,
  parseExpression,
  updateField,
  validateExpression,
} from '../utils'

describe('Cron utilities', () => {
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
    expect(validateExpression('0 ? 9 * * ?').status).toBe('invalid')
    expect(validateExpression('0 0 9 * * *').status).toBe('invalid')
    expect(validateExpression('0 0 9 ? * ?').status).toBe('invalid')
  })

  it('keeps the day and week fields valid when editing either field', () => {
    const fields = createDefaultFields()
    const day = updateField(fields, 'day', '?')
    const week = updateField(day, 'week', 'MON')

    expect(day.week).toBe('*')
    expect(week.day).toBe('?')
  })

  it('uses Croner to calculate a next execution time', () => {
    const preview = getPreview('0 */5 * * * ?')

    expect(preview.description).toBe('Every 5 minutes')
    expect(preview.nextRunAt).toBeInstanceOf(Date)
  })

  it('localizes descriptions and validation errors', () => {
    expect(getPreview('0 */5 * * * ?', false, zhCN).description).toBe('每 5 分钟')
    expect(validateExpression('* * * * *', false, zhCN).errors?.[0]?.message).toBe('当前 Quartz 格式需要 6 个字段')
  })
})
