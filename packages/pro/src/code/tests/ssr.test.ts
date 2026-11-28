import type { CodeHighlighter } from '../types'
import { flushPromises } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Code from '../index'

function createHighlighter() {
  return {
    hasLanguage: vi.fn(() => true),
    loadLanguage: vi.fn(async () => true),
    tokenize: vi.fn((code: string) => code.split('\n').map(line => line ? [{ content: line, color: '#000' }] : [])),
  } satisfies CodeHighlighter
}

const diffContent = ' const a = 1\n-const b = 2\n+const b = 3\n+\n <b>html</b>'

describe('Code SSR', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders plain text on the server, without calling the highlighter or emitting', async () => {
    const highlighter = createHighlighter()
    const onHighlight = vi.fn()
    const onError = vi.fn()
    const html = await renderToString(createSSRApp({
      render: () => h(Code, { content: ' ok\nbroken', diff: true, language: 'ts', highlighter, onHighlight, onError }),
    }))

    expect(html).toContain('broken')
    expect(html).not.toContain('ant-code-token')
    expect(highlighter.hasLanguage).not.toHaveBeenCalled()
    expect(highlighter.tokenize).not.toHaveBeenCalled()
    expect(onHighlight).not.toHaveBeenCalled()
    // Diff 解析错误也不在服务端触发，留到客户端挂载后。
    expect(onError).not.toHaveBeenCalled()
  })

  it('escapes HTML in the source on the server', async () => {
    const html = await renderToString(createSSRApp({
      render: () => h(Code, { content: '<script>alert(1)</script>' }),
    }))
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('hydrates without mismatches and highlights only after mount', async () => {
    const highlighter = createHighlighter()
    const onHighlight = vi.fn()
    const render = () => h(Code, {
      content: diffContent,
      diff: true,
      showLineNumbers: true,
      copyable: true,
      language: 'ts',
      highlighter,
      onHighlight,
    })

    const html = await renderToString(createSSRApp({ render }))
    expect(onHighlight).not.toHaveBeenCalled()

    const container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)
    const serverText = container.querySelector('.ant-code-pre')!.textContent

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const app = createSSRApp({ render })
    app.mount(container)
    await flushPromises()

    const messages = [...warn.mock.calls, ...error.mock.calls].map(call => call.join(' '))
    expect(messages.filter(message => /hydration|mismatch/i.test(message))).toEqual([])
    warn.mockRestore()
    error.mockRestore()

    // 挂载后才高亮；高亮前后展示的文本一致。
    expect(onHighlight).toHaveBeenCalledWith({ language: 'ts', highlighted: true })
    expect(container.querySelectorAll('.ant-code-token').length).toBeGreaterThan(0)
    expect(container.querySelector('.ant-code-pre')!.textContent).toBe(serverText)
    expect(container.querySelector('b')).toBeNull()

    app.unmount()
  })
})
