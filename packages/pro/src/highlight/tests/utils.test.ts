import type { HighlightChunk, HighlightFindChunks, HighlightKeyword } from '../types'
import { describe, expect, it, vi } from 'vitest'
import { getHighlightChunks } from '../utils'

function joined(chunks: HighlightChunk[]) {
  return chunks.map(chunk => chunk.text).join('')
}

function hits(chunks: HighlightChunk[]) {
  return chunks.filter(chunk => chunk.highlight).map(chunk => chunk.text)
}

function run(content: string, keywords?: HighlightKeyword | HighlightKeyword[], options?: Parameters<typeof getHighlightChunks>[2]) {
  const chunks = getHighlightChunks(content, keywords, options)
  // 拼接不变量：所有片段拼起来严格等于原文。
  expect(joined(chunks)).toBe(content)
  return chunks
}

describe('getHighlightChunks', () => {
  it('returns an empty list for empty content', () => {
    expect(getHighlightChunks('', 'a')).toEqual([])
    expect(getHighlightChunks(null as any, 'a')).toEqual([])
    expect(getHighlightChunks(undefined as any, 'a')).toEqual([])
  })

  it('returns a single plain chunk without usable keywords', () => {
    const expected = [{ text: 'hello', start: 0, end: 5, highlight: false }]
    expect(run('hello')).toEqual(expected)
    expect(run('hello', '')).toEqual(expected)
    expect(run('hello', [])).toEqual(expected)
    expect(run('hello', ['', null as any, 1 as any])).toEqual(expected)
    expect(run('hello', 'xyz')).toEqual(expected)
  })

  it('splits content into highlighted and plain chunks', () => {
    expect(run('Free shipping on orders over $50.', ['free', '$50'])).toEqual([
      { text: 'Free', start: 0, end: 4, highlight: true, index: 0, keyword: 'free' },
      { text: ' shipping on orders over ', start: 4, end: 29, highlight: false },
      { text: '$50', start: 29, end: 32, highlight: true, index: 1, keyword: '$50' },
      { text: '.', start: 32, end: 33, highlight: false },
    ])
  })

  it('matches string keywords literally', () => {
    expect(hits(run('a.b axb (c) $d', ['.', '(c)', '$d']))).toEqual(['.', '(c)', '$d'])
    expect(hits(run('a+b aab', 'a+'))).toEqual(['a+'])
    expect(hits(run('path\\to', '\\'))).toEqual(['\\'])
  })

  it('applies caseSensitive only to string keywords', () => {
    expect(hits(run('Vue vue VUE', 'vue'))).toEqual(['Vue', 'vue', 'VUE'])
    expect(hits(run('Vue vue VUE', 'vue', { caseSensitive: true }))).toEqual(['vue'])
    // RegExp 按自身 flags，不受 caseSensitive 影响。
    expect(hits(run('ABC abc', /[A-Z]+/))).toEqual(['ABC'])
    expect(hits(run('ABC abc', /abc/i, { caseSensitive: true }))).toEqual(['ABC', 'abc'])
  })

  it('keeps RegExp flags and does not mutate the given RegExp', () => {
    const regexp = /^err/gim
    regexp.lastIndex = 3
    const chunks = run('ERR one\nerr two\nok', regexp)
    expect(hits(chunks)).toEqual(['ERR', 'err'])
    expect(chunks.find(chunk => chunk.highlight)!.keyword).toBe(regexp)
    expect(regexp.lastIndex).toBe(3)

    const sticky = /a/y
    expect(hits(run('bab', sticky))).toEqual(['a'])
    expect(sticky.lastIndex).toBe(0)
  })

  it('prefers the longer keyword at the same start', () => {
    const chunks = run('antdv-next-pro', ['antdv', 'antdv-next'])
    expect(hits(chunks)).toEqual(['antdv-next'])
    expect(chunks[0]!.keyword).toBe('antdv-next')
  })

  it('merges overlapping ranges into one chunk', () => {
    const chunks = run('abcdef', ['abc', 'bcde'])
    expect(chunks).toEqual([
      { text: 'abcde', start: 0, end: 5, highlight: true, index: 0, keyword: 'abc' },
      { text: 'f', start: 5, end: 6, highlight: false },
    ])
  })

  it('keeps the keyword order as the tie breaker for identical ranges', () => {
    const regexp = /vue/i
    const chunks = run('Vue', [regexp, 'vue'])
    expect(chunks[0]!.keyword).toBe(regexp)
  })

  it('does not merge adjacent ranges', () => {
    const chunks = run('ReactVue', ['React', 'Vue'])
    expect(chunks).toEqual([
      { text: 'React', start: 0, end: 5, highlight: true, index: 0, keyword: 'React' },
      { text: 'Vue', start: 5, end: 8, highlight: true, index: 1, keyword: 'Vue' },
    ])
  })

  it('de-duplicates keywords before scanning', () => {
    const findChunks = vi.fn<HighlightFindChunks>(() => [])
    getHighlightChunks('Vue', ['Vue', 'vue', 'Vue', /a/g, /a/g], { findChunks })
    expect(findChunks.mock.calls[0]![0]).toMatchObject({ keywords: ['Vue', /a/g], caseSensitive: false })

    getHighlightChunks('Vue', ['Vue', 'vue'], { caseSensitive: true, findChunks })
    expect(findChunks.mock.calls[1]![0]).toMatchObject({ keywords: ['Vue', 'vue'], caseSensitive: true })
  })

  it('handles unicode and emoji', () => {
    expect(hits(run('我爱 Vue 和 🍉 西瓜', ['🍉', '西瓜']))).toEqual(['🍉', '西瓜'])
    expect(hits(run('ÄPFEL äpfel', 'äpfel'))).toEqual(['ÄPFEL', 'äpfel'])
  })

  it('does not loop forever or split surrogate pairs on zero-width matches', () => {
    expect(hits(run('banana', /(?=a)/g))).toEqual([])
    expect(hits(run('a\nb', /^/gm))).toEqual([])
    // 不带 u 的正则在 emoji 处零宽匹配时按码点前进，之后的命中不受影响。
    expect(hits(run('🍉x🍉', /x|(?=\uD83C)/))).toEqual(['x'])
    expect(hits(run('🍉🍉', /\b|🍉/u))).toEqual(['🍉', '🍉'])
  })

  it('sanitizes ranges returned by findChunks', () => {
    const chunks = run('abcdefghij', 'ignored', {
      findChunks: () => [
        { start: Number.NaN, end: 3 },
        { start: 8, end: 100 },
        { start: 5, end: 2 },
        { start: -4, end: 1.9 },
        { start: 1, end: 3, keyword: 'x' },
        { start: 2, end: 4 },
        { start: 6, end: 6 },
        null as any,
      ],
    })
    expect(chunks).toEqual([
      { text: 'a', start: 0, end: 1, highlight: true, index: 0 },
      { text: 'bcd', start: 1, end: 4, highlight: true, index: 1, keyword: 'x' },
      { text: 'efgh', start: 4, end: 8, highlight: false },
      { text: 'ij', start: 8, end: 10, highlight: true, index: 2 },
    ])
  })

  it('calls findChunks even without keywords and ignores non-array results', () => {
    expect(hits(run('hello', undefined, { findChunks: () => [{ start: 0, end: 2 }] }))).toEqual(['he'])
    expect(run('hello', 'h', { findChunks: () => undefined as any })).toEqual([
      { text: 'hello', start: 0, end: 5, highlight: false },
    ])
  })

  it('numbers highlighted chunks from zero', () => {
    const chunks = run('a b a b', ['a', 'b'])
    expect(chunks.filter(chunk => chunk.highlight).map(chunk => chunk.index)).toEqual([0, 1, 2, 3])
    expect(chunks.filter(chunk => !chunk.highlight).every(chunk => !('index' in chunk) && !('keyword' in chunk))).toBe(true)
  })
})
