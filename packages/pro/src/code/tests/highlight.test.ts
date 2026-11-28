import type { CodeHighlighter, CodeToken } from '../types'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { ProConfigProvider } from '../../index'
import { highlightLines } from '../hooks/useHighlight'
import Code from '../index'
import { parseDiff } from '../utils/diff'

interface Deferred<T> {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (error: unknown) => void
}

function defer<T>(): Deferred<T> {
  let resolve!: (value: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

/** 每个单词一个 token，颜色里带上语言名，方便断言结果属于哪次任务。 */
function wordTokens(code: string, language: string): CodeToken[][] {
  return code.split('\n').map(line => (line.match(/\s+|\S+/g) ?? []).map(content => ({
    content,
    color: `light-${language}`,
    darkColor: `dark-${language}`,
  })))
}

function createHighlighter(overrides: Partial<CodeHighlighter> = {}, loadedLanguages: string[] = []) {
  const loaded = new Set(loadedLanguages)
  const highlighter = {
    hasLanguage: vi.fn((language: string) => loaded.has(language)),
    loadLanguage: vi.fn(async (language: string) => {
      loaded.add(language)
      return true
    }),
    tokenize: vi.fn(wordTokens),
    ...overrides,
  }
  return { highlighter: highlighter satisfies CodeHighlighter, loaded }
}

function tokenTexts(wrapper: ReturnType<typeof mount>) {
  // 空白也是一个 token，这里只看有内容的。
  return wrapper.findAll('.ant-code-token').map(token => token.element.textContent ?? '').filter(text => text.trim())
}

describe('Code highlight task', () => {
  it('does not touch the highlighter for plain text', async () => {
    const { highlighter } = createHighlighter()
    const onHighlight = vi.fn()
    const wrapper = mount(Code, { props: { content: 'const a = 1', highlighter, onHighlight } })
    await flushPromises()

    expect(highlighter.hasLanguage).not.toHaveBeenCalled()
    expect(highlighter.loadLanguage).not.toHaveBeenCalled()
    expect(highlighter.tokenize).not.toHaveBeenCalled()
    expect(wrapper.find('.ant-code-token').exists()).toBe(false)
    expect(onHighlight).toHaveBeenCalledTimes(1)
    expect(onHighlight).toHaveBeenCalledWith({ language: 'text', highlighted: false })
  })

  it('falls back to plain text without an error when there is no highlighter', async () => {
    const warn = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onHighlight = vi.fn()
    const onError = vi.fn()
    const wrapper = mount(Code, { props: { content: 'const a = 1', language: 'ts', onHighlight, onError } })
    await flushPromises()

    expect(wrapper.find('.ant-code-line-content').text()).toBe('const a = 1')
    expect(wrapper.find('.ant-code-token').exists()).toBe(false)
    expect(onHighlight).toHaveBeenCalledWith({ language: 'ts', highlighted: false })
    expect(onError).not.toHaveBeenCalled()
    warn.mockRestore()
  })

  it('commits synchronously when the language is already available', async () => {
    const { highlighter } = createHighlighter({}, ['ts'])
    const onHighlight = vi.fn()
    const wrapper = mount(Code, { props: { content: 'const a', language: 'ts', highlighter, onHighlight } })
    // 挂载后同步提交，只需要等一次渲染，不需要等任何 Promise。
    await nextTick()

    expect(highlighter.loadLanguage).not.toHaveBeenCalled()
    expect(tokenTexts(wrapper)).toEqual(['const', 'a'])
    expect(onHighlight).toHaveBeenCalledWith({ language: 'ts', highlighted: true })

    const token = wrapper.find('.ant-code-token')
    expect(token.attributes('style')).toContain('--ant-code-c: light-ts')
    expect(token.attributes('style')).toContain('--ant-code-c-dark: dark-ts')
  })

  it('loads the language first and keeps plain text while loading', async () => {
    const loading = defer<boolean>()
    const { highlighter, loaded } = createHighlighter({ loadLanguage: vi.fn(() => loading.promise) })
    const onHighlight = vi.fn()
    const wrapper = mount(Code, { props: { content: 'const a', language: 'ts', highlighter, onHighlight } })
    await flushPromises()

    expect(wrapper.find('.ant-code-line-content').text()).toBe('const a')
    expect(wrapper.find('.ant-code-token').exists()).toBe(false)
    expect(onHighlight).not.toHaveBeenCalled()

    loaded.add('ts')
    loading.resolve(true)
    await flushPromises()

    expect(tokenTexts(wrapper)).toEqual(['const', 'a'])
    expect(onHighlight).toHaveBeenCalledTimes(1)
    expect(onHighlight).toHaveBeenCalledWith({ language: 'ts', highlighted: true })
  })

  it('only commits the latest task when content and language change quickly', async () => {
    const tasks: Record<string, Deferred<boolean>> = { ts: defer(), json: defer() }
    const { highlighter, loaded } = createHighlighter({ loadLanguage: vi.fn((language: string) => tasks[language]!.promise) })
    const onHighlight = vi.fn()
    const wrapper = mount(Code, { props: { content: 'first', language: 'ts', highlighter, onHighlight } })
    await flushPromises()

    await wrapper.setProps({ content: 'second', language: 'json' })
    await flushPromises()

    // 旧任务后返回：不提交、不触发事件。
    loaded.add('json')
    tasks.json!.resolve(true)
    await flushPromises()
    loaded.add('ts')
    tasks.ts!.resolve(true)
    await flushPromises()

    expect(tokenTexts(wrapper)).toEqual(['second'])
    expect(wrapper.find('.ant-code-token').attributes('style')).toContain('light-json')
    expect(onHighlight).toHaveBeenCalledTimes(1)
    expect(onHighlight).toHaveBeenCalledWith({ language: 'json', highlighted: true })
    expect(highlighter.tokenize).toHaveBeenCalledTimes(1)
  })

  it('never shows stale content: changed lines fall back to plain text until the new result arrives', async () => {
    const loading = defer<boolean>()
    const { highlighter, loaded } = createHighlighter({
      loadLanguage: vi.fn((language: string) => language === 'json' ? loading.promise : Promise.resolve(true)),
    }, ['ts'])
    const wrapper = mount(Code, { props: { content: 'keep me\nold line', language: 'ts', highlighter } })
    await nextTick()
    expect(tokenTexts(wrapper)).toEqual(['keep', 'me', 'old', 'line'])

    await wrapper.setProps({ content: 'keep me\nnew line', language: 'json' })
    await flushPromises()

    const lines = wrapper.findAll('.ant-code-line-content')
    // 没变的行沿用旧高亮，变了的行先显示新的纯文本。
    expect(lines[0]!.findAll('.ant-code-token')).toHaveLength(3)
    expect(lines[1]!.findAll('.ant-code-token')).toHaveLength(0)
    expect(lines[1]!.text()).toBe('new line')

    loaded.add('json')
    loading.resolve(true)
    await flushPromises()
    expect(tokenTexts(wrapper)).toEqual(['keep', 'me', 'new', 'line'])
  })

  it('does not commit or emit after unmount', async () => {
    const loading = defer<boolean>()
    const { highlighter } = createHighlighter({ loadLanguage: vi.fn(() => loading.promise) })
    const onHighlight = vi.fn()
    const onError = vi.fn()
    const wrapper = mount(Code, { props: { content: 'a', language: 'ts', highlighter, onHighlight, onError } })
    await flushPromises()
    wrapper.unmount()

    loading.resolve(true)
    await flushPromises()

    expect(highlighter.tokenize).not.toHaveBeenCalled()
    expect(onHighlight).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  it('treats resolve(false) as an unsupported language, not as an error', async () => {
    const { highlighter } = createHighlighter({ loadLanguage: vi.fn(async () => false) })
    const onHighlight = vi.fn()
    const onError = vi.fn()
    const wrapper = mount(Code, { props: { content: 'a b', language: 'brainfuck', highlighter, onHighlight, onError } })
    await flushPromises()

    expect(wrapper.find('.ant-code-token').exists()).toBe(false)
    expect(wrapper.find('.ant-code-line-content').text()).toBe('a b')
    expect(onHighlight).toHaveBeenCalledWith({ language: 'brainfuck', highlighted: false })
    expect(onError).not.toHaveBeenCalled()
  })

  it('emits a load error on rejection and can retry afterwards', async () => {
    const { highlighter, loaded } = createHighlighter()
    vi.mocked(highlighter.loadLanguage)
      .mockImplementationOnce(() => Promise.reject(new Error('network')))
      .mockImplementationOnce(async (language: string) => {
        loaded.add(language)
        return true
      })
    const onHighlight = vi.fn()
    const onError = vi.fn()
    const wrapper = mount(Code, { props: { content: 'a b', language: 'ts', highlighter, onHighlight, onError } })
    await flushPromises()

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError.mock.calls[0]![0]).toMatchObject({ stage: 'load' })
    expect(onError.mock.calls[0]![0].error.message).toBe('network')
    expect(onHighlight).toHaveBeenLastCalledWith({ language: 'ts', highlighted: false })
    expect(wrapper.find('.ant-code-line-content').text()).toBe('a b')

    await wrapper.setProps({ content: 'a b c' })
    await flushPromises()

    expect(highlighter.loadLanguage).toHaveBeenCalledTimes(2)
    expect(tokenTexts(wrapper)).toEqual(['a', 'b', 'c'])
    expect(onHighlight).toHaveBeenLastCalledWith({ language: 'ts', highlighted: true })
  })

  it('wraps non-Error rejections', async () => {
    const { highlighter } = createHighlighter({ loadLanguage: vi.fn(() => Promise.reject('boom')) }) // eslint-disable-line prefer-promise-reject-errors
    const onError = vi.fn()
    mount(Code, { props: { content: 'a', language: 'ts', highlighter, onError } })
    await flushPromises()

    expect(onError.mock.calls[0]![0].error).toBeInstanceOf(Error)
    expect(onError.mock.calls[0]![0].error.message).toBe('boom')
  })

  it('falls back with a highlight error when tokenize throws', async () => {
    const { highlighter } = createHighlighter({
      tokenize: vi.fn(() => {
        throw new Error('bad grammar')
      }),
    }, ['ts'])
    const onHighlight = vi.fn()
    const onError = vi.fn()
    const wrapper = mount(Code, { props: { content: 'a b', language: 'ts', highlighter, onHighlight, onError } })
    await flushPromises()

    expect(wrapper.find('.ant-code-token').exists()).toBe(false)
    expect(wrapper.find('.ant-code-line-content').text()).toBe('a b')
    expect(onError).toHaveBeenCalledWith({ stage: 'highlight', error: expect.objectContaining({ message: 'bad grammar' }) })
    expect(onHighlight).toHaveBeenCalledWith({ language: 'ts', highlighted: false })
  })

  it.each([
    ['a different line count', () => [[{ content: 'a b' }]]],
    ['different content', () => [[{ content: 'a b' }], [{ content: 'X' }]]],
    ['a non-array result', () => 'a b\nc' as any],
  ])('falls back when the tokens have %s', async (_name, tokenize) => {
    const { highlighter } = createHighlighter({ tokenize: vi.fn(tokenize) }, ['ts'])
    const onError = vi.fn()
    const wrapper = mount(Code, { props: { content: 'a b\nc', language: 'ts', highlighter, onError } })
    await flushPromises()

    expect(wrapper.find('.ant-code-token').exists()).toBe(false)
    expect(wrapper.findAll('.ant-code-line-content').map(line => line.text())).toEqual(['a b', 'c'])
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError.mock.calls[0]![0].stage).toBe('highlight')
  })

  it('highlights again when the highlighter reference changes', async () => {
    const first = createHighlighter({}, ['ts']).highlighter
    const second = createHighlighter({
      tokenize: vi.fn((code: string) => code.split('\n').map(line => [{ content: line, color: 'second' }])),
    }, ['ts']).highlighter
    const wrapper = mount(Code, { props: { content: 'a b', language: 'ts', highlighter: first } })
    await nextTick()
    expect(tokenTexts(wrapper)).toEqual(['a', 'b'])

    await wrapper.setProps({ highlighter: second })
    await nextTick()
    expect(tokenTexts(wrapper)).toEqual(['a b'])
    expect(second.tokenize).toHaveBeenCalledTimes(1)
  })

  it('goes back to plain text when the language becomes text', async () => {
    const { highlighter } = createHighlighter({}, ['ts'])
    const wrapper = mount(Code, { props: { content: 'a b', language: 'ts', highlighter } })
    await nextTick()
    expect(wrapper.find('.ant-code-token').exists()).toBe(true)

    await wrapper.setProps({ language: 'text' })
    await nextTick()
    expect(wrapper.find('.ant-code-token').exists()).toBe(false)
    expect(wrapper.find('.ant-code-line-content').text()).toBe('a b')
  })

  it('prefers the highlighter prop over ProConfigProvider', async () => {
    const fromConfig = createHighlighter({}, ['ts']).highlighter
    const fromProps = createHighlighter({}, ['ts']).highlighter

    const configured = mount(() => h(ProConfigProvider, { code: { highlighter: fromConfig } }, {
      default: () => h(Code, { content: 'a b', language: 'ts' }),
    }))
    await nextTick()
    expect(fromConfig.tokenize).toHaveBeenCalledTimes(1)
    expect(configured.findAll('.ant-code-token')).toHaveLength(3)

    mount(() => h(ProConfigProvider, { code: { highlighter: fromConfig } }, {
      default: () => h(Code, { content: 'a b', language: 'ts', highlighter: fromProps }),
    }))
    await nextTick()
    expect(fromProps.tokenize).toHaveBeenCalledTimes(1)
    expect(fromConfig.tokenize).toHaveBeenCalledTimes(1)
  })

  it('does not highlight an invalid diff and reports a parse error', async () => {
    const { highlighter } = createHighlighter({}, ['ts'])
    const onHighlight = vi.fn()
    const onError = vi.fn()
    const wrapper = mount(Code, { props: { content: ' a\nb', language: 'ts', diff: true, highlighter, onHighlight, onError } })
    await flushPromises()

    expect(highlighter.tokenize).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError.mock.calls[0]![0].stage).toBe('parse')
    expect(onHighlight).toHaveBeenCalledWith({ language: 'ts', highlighted: false })
    // 回退为原始纯文本：前缀原样保留，不带 Diff 结构。
    expect(wrapper.findAll('.ant-code-line-content').map(line => line.element.textContent)).toEqual([' a', 'b'])
    expect(wrapper.classes()).not.toContain('ant-code-diff')
    expect(wrapper.find('.ant-code-marker').exists()).toBe(false)
  })
})

describe('highlightLines', () => {
  /** 记住“是否在块注释里”的最小分词器，用来验证跨行语法状态。 */
  function commentAwareTokenize(code: string): CodeToken[][] {
    let inComment = false
    return code.split('\n').map((line) => {
      const startsInComment = inComment
      if (line.includes('/*'))
        inComment = true
      const color = startsInComment || inComment ? 'comment' : 'code'
      if (line.includes('*/'))
        inComment = false
      return line ? [{ content: line, color }] : []
    })
  }

  function lines(content: string) {
    const result = parseDiff(content)
    if (!result.ok)
      throw result.error
    return result.lines
  }

  it('tokenizes the old and the new text as a whole and maps tokens back by line', () => {
    const tokenize = vi.fn(commentAwareTokenize)
    const highlighter: CodeHighlighter = { hasLanguage: () => true, loadLanguage: async () => true, tokenize }

    // 旧文本里 `const a` 在块注释内；新文本删掉了注释的开头，所以它变成了代码。
    const result = highlightLines(highlighter, lines('-/* start\n-still comment\n+const b = 2\n const a = 1\n-end */'), 'ts')

    expect(tokenize).toHaveBeenCalledTimes(2)
    expect(tokenize.mock.calls.map(call => call[0])).toEqual([
      'const b = 2\nconst a = 1',
      '/* start\nstill comment\nconst a = 1\nend */',
    ])
    expect(result.map(line => [line.content, line.tokens[0]?.color])).toEqual([
      ['/* start', 'comment'],
      ['still comment', 'comment'],
      ['const b = 2', 'code'],
      // 未变化行取新文本的 token。
      ['const a = 1', 'code'],
      ['end */', 'comment'],
    ])
  })

  it('keeps the multi-line state of added lines', () => {
    const highlighter: CodeHighlighter = { hasLanguage: () => true, loadLanguage: async () => true, tokenize: commentAwareTokenize }
    const result = highlightLines(highlighter, lines('+/* start\n inside\n+end */\n after'), 'ts')
    expect(result.map(line => line.tokens[0]?.color)).toEqual(['comment', 'comment', 'comment', 'code'])
  })

  it('tokenizes once when there is no removed line and handles empty lines', () => {
    const tokenize = vi.fn(commentAwareTokenize)
    const highlighter: CodeHighlighter = { hasLanguage: () => true, loadLanguage: async () => true, tokenize }
    const result = highlightLines(highlighter, lines(' a\n+\n b'), 'ts')
    expect(tokenize).toHaveBeenCalledTimes(1)
    expect(result.map(line => line.tokens.length)).toEqual([1, 0, 1])
  })

  it('does not call tokenize for an all-removed diff\'s empty new text', () => {
    const tokenize = vi.fn(commentAwareTokenize)
    const highlighter: CodeHighlighter = { hasLanguage: () => true, loadLanguage: async () => true, tokenize }
    const result = highlightLines(highlighter, lines('-a\n-b'), 'ts')
    expect(tokenize).toHaveBeenCalledTimes(1)
    expect(result.map(line => line.content)).toEqual(['a', 'b'])
  })
})
