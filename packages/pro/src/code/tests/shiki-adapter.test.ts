// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { isReactive, reactive } from 'vue'
import { createShikiCodeHighlighter } from '../shiki'
import { validateTokens } from '../utils/validate-tokens'

// 用真实的 Shiki，只加载 json / yaml 这样的小语言。
describe('createShikiCodeHighlighter', () => {
  it('reports languages as unavailable until they are loaded', async () => {
    const highlighter = createShikiCodeHighlighter()

    expect(highlighter.hasLanguage('json')).toBe(false)
    expect(() => highlighter.tokenize('{}', 'json')).toThrow(/not loaded/)

    await expect(highlighter.loadLanguage('json')).resolves.toBe(true)
    expect(highlighter.hasLanguage('json')).toBe(true)
    expect(highlighter.hasLanguage('JSON')).toBe(true)
    expect(highlighter.hasLanguage('yaml')).toBe(false)
  }, 60000)

  it('resolves false for a language outside the whitelist without initializing anything', async () => {
    const highlighter = createShikiCodeHighlighter()
    await expect(highlighter.loadLanguage('brainfuck')).resolves.toBe(false)
    await expect(highlighter.loadLanguage('constructor')).resolves.toBe(false)
    expect(highlighter.hasLanguage('brainfuck')).toBe(false)
  })

  it('converts dual-theme tokens and keeps the source text intact', async () => {
    const highlighter = createShikiCodeHighlighter()
    await highlighter.loadLanguage('json')

    const code = '{\n  "timeout": 5000,\n\n  "name": "a\\tb"\n}'
    const tokens = highlighter.tokenize(code, 'json')

    expect(validateTokens(tokens, code.split('\n'))).toBe(true)
    expect(tokens[2]).toEqual([])

    const colored = tokens.flat().filter(token => token.color && token.darkColor)
    expect(colored.length).toBeGreaterThan(0)
    expect(colored.every(token => /^#[\da-f]{3,8}$/i.test(token.color!) && /^#[\da-f]{3,8}$/i.test(token.darkColor!))).toBe(true)
    // github-light 和 github-dark 的配色不同。
    expect(colored.some(token => token.color !== token.darkColor)).toBe(true)
    // 只保留组件需要的字段。
    expect(Object.keys(tokens[0]![0]!).every(key => ['content', 'color', 'darkColor', 'italic', 'bold', 'underline'].includes(key))).toBe(true)
  }, 60000)

  it('maps font styles to italic / bold', async () => {
    const highlighter = createShikiCodeHighlighter()
    await highlighter.loadLanguage('md')

    const tokens = highlighter.tokenize('*em* and **strong**', 'markdown').flat()
    expect(tokens.some(token => token.italic)).toBe(true)
    expect(tokens.some(token => token.bold)).toBe(true)
  }, 60000)

  it('resolves built-in and custom aliases', async () => {
    const highlighter = createShikiCodeHighlighter({ aliases: { conf: 'yaml' } })

    await expect(highlighter.loadLanguage('yml')).resolves.toBe(true)
    expect(highlighter.hasLanguage('yaml')).toBe(true)
    expect(highlighter.hasLanguage('conf')).toBe(true)
    expect(highlighter.tokenize('a: 1', 'conf')).toEqual(highlighter.tokenize('a: 1', 'yaml'))
  }, 60000)

  it('loads a language once for concurrent requests', async () => {
    const loader = vi.fn(() => import('shiki/langs/json.mjs'))
    const highlighter = createShikiCodeHighlighter({ langs: { json: loader } })

    const results = await Promise.all([
      highlighter.loadLanguage('json'),
      highlighter.loadLanguage('json'),
      highlighter.loadLanguage('JSON'),
    ])
    expect(results).toEqual([true, true, true])
    expect(loader).toHaveBeenCalledTimes(1)

    await highlighter.loadLanguage('json')
    expect(loader).toHaveBeenCalledTimes(1)
  }, 60000)

  it('does not keep a rejected task, so a failed load can be retried', async () => {
    const loader = vi.fn()
      .mockImplementationOnce(() => Promise.reject(new Error('network')))
      .mockImplementationOnce(() => import('shiki/langs/json.mjs'))
    const highlighter = createShikiCodeHighlighter({ langs: { json: loader } })

    await expect(highlighter.loadLanguage('json')).rejects.toThrow('network')
    expect(highlighter.hasLanguage('json')).toBe(false)

    await expect(highlighter.loadLanguage('json')).resolves.toBe(true)
    expect(loader).toHaveBeenCalledTimes(2)
    expect(highlighter.hasLanguage('json')).toBe(true)
  }, 60000)

  it('rejects when a loader returns nothing', async () => {
    const highlighter = createShikiCodeHighlighter({ langs: { empty: async () => ({ default: [] }) } })
    await expect(highlighter.loadLanguage('empty')).rejects.toThrow(/did not return/)
  }, 60000)

  it('adds languages through options.langs, even when the key differs from the grammar name', async () => {
    const highlighter = createShikiCodeHighlighter({
      langs: { config: () => import('shiki/langs/toml.mjs') },
    })

    await expect(highlighter.loadLanguage('toml')).resolves.toBe(false)
    await expect(highlighter.loadLanguage('config')).resolves.toBe(true)

    const tokens = highlighter.tokenize('name = "pro"', 'config')
    expect(tokens[0]!.map(token => token.content).join('')).toBe('name = "pro"')
    expect(tokens[0]!.some(token => token.color)).toBe(true)
  }, 60000)

  it('keeps instances independent', async () => {
    const first = createShikiCodeHighlighter()
    const second = createShikiCodeHighlighter()
    await first.loadLanguage('json')
    expect(first.hasLanguage('json')).toBe(true)
    expect(second.hasLanguage('json')).toBe(false)
  }, 60000)

  it('is marked raw so it is never deeply proxied', () => {
    const highlighter = createShikiCodeHighlighter()
    const state = reactive({ highlighter })
    expect(isReactive(state.highlighter)).toBe(false)
    expect(state.highlighter).toBe(highlighter)
  })
})
