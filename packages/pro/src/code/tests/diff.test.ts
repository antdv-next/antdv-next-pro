import { describe, expect, it } from 'vitest'
import { getCopyText } from '../utils/copy'
import { parseDiff, parsePlain } from '../utils/diff'
import { getLuminance, isDarkColor } from '../utils/luminance'
import { validateTokens } from '../utils/validate-tokens'

function parseOk(content: string) {
  const result = parseDiff(content)
  if (!result.ok)
    throw result.error
  return result
}

describe('parsePlain', () => {
  it('splits logical lines and numbers them', () => {
    expect(parsePlain('a\nb\n\nc')).toEqual({
      lines: [
        { type: 'normal', content: 'a', newNumber: 1 },
        { type: 'normal', content: 'b', newNumber: 2 },
        { type: 'normal', content: '', newNumber: 3 },
        { type: 'normal', content: 'c', newNumber: 4 },
      ],
      trailingNewline: false,
    })
  })

  it('does not treat +/- as markers and keeps indentation and blanks', () => {
    const { lines } = parsePlain('+ added\n-  removed\n   keep  ')
    expect(lines.map(line => [line.type, line.content])).toEqual([
      ['normal', '+ added'],
      ['normal', '-  removed'],
      ['normal', '   keep  '],
    ])
  })

  it('does not produce an extra record for a trailing line break', () => {
    expect(parsePlain('a\n').lines).toHaveLength(1)
    expect(parsePlain('a\n').trailingNewline).toBe(true)
    expect(parsePlain('a\n\n').lines).toHaveLength(2)
    expect(parsePlain('').lines).toEqual([])
    expect(parsePlain('\n').lines).toEqual([{ type: 'normal', content: '', newNumber: 1 }])
  })

  it('supports \\r\\n and lone \\r line breaks', () => {
    expect(parsePlain('a\r\nb\rc').lines.map(line => line.content)).toEqual(['a', 'b', 'c'])
  })
})

describe('parseDiff', () => {
  it('parses the three prefixes and removes exactly one character', () => {
    const { lines } = parseOk(' {\n-  "timeout": 3000,\n+  "timeout": 5000,\n   "retries": 1\n }')
    expect(lines).toEqual([
      { type: 'normal', content: '{', oldNumber: 1, newNumber: 1 },
      { type: 'removed', content: '  "timeout": 3000,', oldNumber: 2 },
      { type: 'added', content: '  "timeout": 5000,', newNumber: 2 },
      { type: 'normal', content: '  "retries": 1', oldNumber: 3, newNumber: 3 },
      { type: 'normal', content: '}', oldNumber: 4, newNumber: 4 },
    ])
  })

  it('tells markers from source code that starts with + or -', () => {
    const { lines } = parseOk(' +value\n++value\n--value\n -value')
    expect(lines.map(line => [line.type, line.content])).toEqual([
      ['normal', '+value'],
      ['added', '+value'],
      ['removed', '-value'],
      ['normal', '-value'],
    ])
  })

  it('supports the three kinds of blank lines', () => {
    const { lines } = parseOk('+\n-\n ')
    expect(lines).toEqual([
      { type: 'added', content: '', newNumber: 1 },
      { type: 'removed', content: '', oldNumber: 1 },
      { type: 'normal', content: '', oldNumber: 2, newNumber: 2 },
    ])
  })

  it('numbers the old and the new columns independently', () => {
    const { lines } = parseOk(' a\n-b\n-c\n+d\n e\n+f')
    expect(lines.map(line => [line.oldNumber, line.newNumber])).toEqual([
      [1, 1],
      [2, undefined],
      [3, undefined],
      [undefined, 2],
      [4, 3],
      [undefined, 4],
    ])
  })

  it('accepts an empty string as "no content"', () => {
    expect(parseDiff('')).toEqual({ ok: true, lines: [], trailingNewline: false })
  })

  it('does not produce an extra record for a trailing line break', () => {
    const result = parseOk(' a\n+b\n')
    expect(result.lines).toHaveLength(2)
    expect(result.trailingNewline).toBe(true)
  })

  it('supports \\r\\n line breaks', () => {
    const result = parseOk(' a\r\n+b\r\n')
    expect(result.lines.map(line => line.content)).toEqual(['a', 'b'])
    expect(result.trailingNewline).toBe(true)
  })

  it('fails as a whole on an invalid prefix', () => {
    const result = parseDiff(' a\nb\n+c')
    expect(result.ok).toBe(false)
    expect(!result.ok && result.error.message).toContain('line 2')
    expect(!result.ok && result.error.message).toContain('"b"')
  })

  it('fails as a whole on a bare empty line', () => {
    const result = parseDiff(' a\n\n+c')
    expect(result.ok).toBe(false)
    expect(!result.ok && result.error.message).toContain('line 2 is empty')
    // 只有一个换行符：切出来是一条裸空行，同样不合法。
    expect(parseDiff('\n').ok).toBe(false)
  })
})

describe('getCopyText', () => {
  it('returns the input as is in plain mode', () => {
    expect(getCopyText({ content: '+a\r\n-b\n' })).toBe('+a\r\n-b\n')
    expect(getCopyText({ content: '' })).toBe('')
  })

  it('keeps unchanged and added lines only in diff mode', () => {
    const result = parseOk(' {\n-  "timeout": 3000,\n+  "timeout": 5000,\n   "retries": 1\n }')
    expect(getCopyText({ content: 'ignored', diffLines: result.lines, trailingNewline: result.trailingNewline }))
      .toBe('{\n  "timeout": 5000,\n  "retries": 1\n}')
  })

  it('keeps the trailing line break of the diff input', () => {
    const result = parseOk(' a\n+b\n-c\n')
    expect(getCopyText({ content: '', diffLines: result.lines, trailingNewline: result.trailingNewline })).toBe('a\nb\n')
  })

  it('returns an empty string when every line is removed', () => {
    const result = parseOk('-a\n-b\n')
    expect(getCopyText({ content: '', diffLines: result.lines, trailingNewline: result.trailingNewline })).toBe('')
    expect(getCopyText({ content: '', diffLines: [] })).toBe('')
  })
})

describe('validateTokens', () => {
  it('accepts tokens that concatenate to the source lines', () => {
    expect(validateTokens([[{ content: 'const' }, { content: ' a' }], []], ['const a', ''])).toBe(true)
    expect(validateTokens([], [])).toBe(true)
  })

  it('rejects a different line count, different content or malformed tokens', () => {
    expect(validateTokens([[{ content: 'a' }]], ['a', 'b'])).toBe(false)
    expect(validateTokens([[{ content: 'a' }], [{ content: 'B' }]], ['a', 'b'])).toBe(false)
    expect(validateTokens([[{ content: 1 }]], ['1'])).toBe(false)
    expect(validateTokens([null], ['a'])).toBe(false)
    expect(validateTokens(undefined, [])).toBe(false)
  })
})

describe('luminance', () => {
  it('parses hex and rgb colors', () => {
    expect(getLuminance('#ffffff')).toBeCloseTo(1)
    expect(getLuminance('#fff')).toBeCloseTo(1)
    expect(getLuminance('#000000ff')).toBeCloseTo(0)
    expect(getLuminance('rgb(255, 255, 255)')).toBeCloseTo(1)
    expect(getLuminance('rgba(0 0 0 / 50%)')).toBeCloseTo(0)
    expect(getLuminance('var(--ant-color-bg-container)')).toBeNull()
    expect(getLuminance('#xyz')).toBeNull()
    expect(getLuminance(undefined)).toBeNull()
  })

  it('treats the antd dark container background as dark and unknown colors as light', () => {
    expect(isDarkColor('#141414')).toBe(true)
    expect(isDarkColor('#1f1f1f')).toBe(true)
    expect(isDarkColor('#ffffff')).toBe(false)
    expect(isDarkColor('#f5f5f5')).toBe(false)
    expect(isDarkColor('transparent')).toBe(false)
  })
})
