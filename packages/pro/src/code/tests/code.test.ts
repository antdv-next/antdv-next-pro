import type { CodeProps, CodeRef } from '../types'
import { flushPromises, mount } from '@vue/test-utils'
import { ConfigProvider, theme } from 'antdv-next'
import zhCN from 'antdv-next/locale/zh_CN'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import rtlTest from '../../../../../tests/shared/rtlTest'
import { ProConfigProvider } from '../../index'
import proZhCN from '../../locale/zh_CN'
import Code from '../index'

const diffContent = ` {
-  "timeout": 3000,
+  "timeout": 5000,
   "retries": 1
 }`

function mountCode(props: CodeProps & Record<string, any> = {}, slots: Record<string, any> = {}, attrs: Record<string, any> = {}) {
  return mount(Code, {
    props: { content: 'const a = 1\nconst b = 2', ...props },
    attrs,
    slots,
    attachTo: document.body,
  })
}

function lineContents(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('.ant-code-line-content').map(line => line.element.textContent)
}

describe('Code', () => {
  let writeText: ReturnType<typeof vi.fn>

  beforeEach(() => {
    writeText = vi.fn(async () => {})
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  rtlTest(() => h(Code, { content: 'const a = 1', copyable: true, showLineNumbers: true }))

  describe('rendering', () => {
    it('renders a div root with pre > code and one line per logical line', () => {
      const wrapper = mountCode()

      expect(wrapper.element.tagName).toBe('DIV')
      expect(wrapper.classes()).toContain('ant-code')
      expect(wrapper.find('pre.ant-code-pre > code.ant-code-code').exists()).toBe(true)
      expect(wrapper.find('pre').attributes('dir')).toBe('ltr')
      expect(wrapper.find('pre').attributes('tabindex')).toBe('0')
      expect(lineContents(wrapper)).toEqual(['const a = 1', 'const b = 2'])
      // 默认没有头部、行号和 Diff 结构。
      expect(wrapper.find('.ant-code-header').exists()).toBe(false)
      expect(wrapper.find('.ant-code-line-number').exists()).toBe(false)
      expect(wrapper.find('.ant-code-marker').exists()).toBe(false)
    })

    it('keeps indentation, blank lines and surrounding whitespace', () => {
      const wrapper = mountCode({ content: '  indented  \n\n\tend ' })
      expect(lineContents(wrapper)).toEqual(['  indented  ', '', '\tend '])
    })

    it('renders nothing inside code for empty or nullish content', () => {
      expect(mountCode({ content: '' }).find('code').element.childNodes).toHaveLength(0)
      expect(mountCode({ content: undefined }).findAll('.ant-code-line')).toHaveLength(0)
    })

    it('renders HTML and script tags as text', () => {
      const wrapper = mountCode({ content: '<script>window.__xss = 1</script>\n<img src=x onerror="window.__xss = 1">' })

      expect(wrapper.find('script').exists()).toBe(false)
      expect(wrapper.find('img').exists()).toBe(false)
      expect(lineContents(wrapper)[0]).toBe('<script>window.__xss = 1</script>')
      expect((window as any).__xss).toBeUndefined()
    })

    it('does not process +/- when diff is off', () => {
      const wrapper = mountCode({ content: '+a\n-b' })
      expect(lineContents(wrapper)).toEqual(['+a', '-b'])
      expect(wrapper.find('.ant-code-line-added').exists()).toBe(false)
      expect(wrapper.classes()).not.toContain('ant-code-diff')
    })

    it('shows one line number column in plain mode, hidden from assistive tech', () => {
      const wrapper = mountCode({ showLineNumbers: true })
      const numbers = wrapper.findAll('.ant-code-line-number')
      expect(numbers.map(node => node.text())).toEqual(['1', '2'])
      expect(numbers.every(node => node.attributes('aria-hidden') === 'true')).toBe(true)
    })

    it('adds the word-wrap class and keeps one line number per logical line', () => {
      const wrapper = mountCode({ content: 'a'.repeat(500), wordWrap: true, showLineNumbers: true })
      expect(wrapper.classes()).toContain('ant-code-word-wrap')
      expect(wrapper.findAll('.ant-code-line-number')).toHaveLength(1)
    })
  })

  describe('diff', () => {
    it('renders markers, state classes and two line number columns', () => {
      const wrapper = mountCode({ content: diffContent, diff: true, showLineNumbers: true })
      const lines = wrapper.findAll('.ant-code-line')

      expect(wrapper.classes()).toContain('ant-code-diff')
      expect(lines.map(line => line.classes().filter(cls => /added|removed/.test(cls)))).toEqual([
        [],
        ['ant-code-line-removed'],
        ['ant-code-line-added'],
        [],
        [],
      ])
      expect(lines.map(line => line.find('.ant-code-marker').element.textContent)).toEqual([' ', '-', '+', ' ', ' '])
      expect(lines.map(line => line.findAll('.ant-code-line-number').map(node => node.text()))).toEqual([
        ['1', '1'],
        ['2', ''],
        ['', '2'],
        ['3', '3'],
        ['4', '4'],
      ])
      expect(lineContents(wrapper)).toEqual(['{', '  "timeout": 3000,', '  "timeout": 5000,', '  "retries": 1', '}'])
      expect(wrapper.findAll('.ant-code-marker').every(node => node.attributes('aria-hidden') === 'true')).toBe(true)
    })

    it('still shows the diff state for plain text', () => {
      const wrapper = mountCode({ content: '+a\n-b', diff: true, language: 'text' })
      expect(wrapper.find('.ant-code-line-added').exists()).toBe(true)
      expect(wrapper.find('.ant-code-line-removed').exists()).toBe(true)
    })

    it('exposes the diff state to screen readers through locale text', () => {
      const wrapper = mountCode({ content: '+a\n-b\n c', diff: true })
      expect(wrapper.findAll('.ant-code-sr-only').map(node => node.text())).toEqual(['Added', 'Removed'])

      const localized = mount(() => h(ProConfigProvider, { locale: proZhCN }, {
        default: () => h(Code, { content: '+a\n-b', diff: true }),
      }))
      expect(localized.findAll('.ant-code-sr-only').map(node => node.text())).toEqual(['新增', '删除'])
    })

    it('falls back to the raw text and emits a parse error for an invalid prefix', async () => {
      const onError = vi.fn()
      const wrapper = mountCode({ content: ' ok\nbroken', diff: true, showLineNumbers: true, onError })
      await flushPromises()

      expect(lineContents(wrapper)).toEqual([' ok', 'broken'])
      expect(wrapper.find('.ant-code-marker').exists()).toBe(false)
      // 回退后按普通模式显示，只有一列行号。
      expect(wrapper.findAll('.ant-code-line-number').map(node => node.text())).toEqual(['1', '2'])
      expect(onError).toHaveBeenCalledTimes(1)
      expect(onError.mock.calls[0]![0]).toMatchObject({ stage: 'parse' })
    })

    it('treats an empty diff as valid', async () => {
      const onError = vi.fn()
      const wrapper = mountCode({ content: '', diff: true, onError })
      await flushPromises()
      expect(wrapper.findAll('.ant-code-line')).toHaveLength(0)
      expect(wrapper.classes()).toContain('ant-code-diff')
      expect(onError).not.toHaveBeenCalled()
    })
  })

  describe('copy', () => {
    it('renders an accessible copy button only when copyable', () => {
      expect(mountCode().find('.ant-code-copy').exists()).toBe(false)

      const wrapper = mountCode({ copyable: true })
      const button = wrapper.find('button.ant-code-copy')
      expect(wrapper.find('.ant-code-header').exists()).toBe(true)
      expect(button.attributes('aria-label')).toBe('Copy')
      expect(button.attributes('type')).toBe('button')
    })

    it('copies the content as is, emits copy and shows the copied state for 3 seconds', async () => {
      vi.useFakeTimers()
      const onCopy = vi.fn()
      const wrapper = mountCode({ copyable: true, content: '+a\n-b\n', onCopy })

      await wrapper.find('.ant-code-copy').trigger('click')
      await vi.waitFor(() => expect(onCopy).toHaveBeenCalled())
      await nextTick()

      expect(writeText).toHaveBeenCalledWith('+a\n-b\n')
      expect(onCopy).toHaveBeenCalledWith({ text: '+a\n-b\n' })
      expect(wrapper.find('.ant-code-copy').classes()).toContain('ant-code-copy-success')
      expect(wrapper.find('.ant-code-copy').attributes('aria-label')).toBe('Copied')

      vi.advanceTimersByTime(3000)
      await nextTick()
      expect(wrapper.find('.ant-code-copy').classes()).not.toContain('ant-code-copy-success')
      expect(wrapper.find('.ant-code-copy').attributes('aria-label')).toBe('Copy')
    })

    it('copies unchanged and added lines only in diff mode', async () => {
      const onCopy = vi.fn()
      const wrapper = mountCode({ copyable: true, content: diffContent, diff: true, showLineNumbers: true, onCopy })

      await wrapper.find('.ant-code-copy').trigger('click')
      await flushPromises()

      expect(writeText).toHaveBeenCalledWith('{\n  "timeout": 5000,\n  "retries": 1\n}')
    })

    it('copies the raw text when the diff is invalid', async () => {
      const wrapper = mountCode({ copyable: true, content: ' ok\nbroken', diff: true })
      await wrapper.find('.ant-code-copy').trigger('click')
      await flushPromises()
      expect(writeText).toHaveBeenCalledWith(' ok\nbroken')
    })

    it('supports CodeCopyConfig text, icon, tooltips and tabIndex', async () => {
      const onCopy = vi.fn()
      const wrapper = mountCode({
        copyable: {
          text: async () => 'custom',
          icon: [h('i', { class: 'icon-copy' }), h('i', { class: 'icon-copied' })],
          tooltips: ['Copy code', 'Done'],
          tabIndex: -1,
        },
        onCopy,
      })
      const button = wrapper.find('.ant-code-copy')

      expect(button.find('.icon-copy').exists()).toBe(true)
      expect(button.attributes('aria-label')).toBe('Copy code')
      expect(button.attributes('tabindex')).toBe('-1')

      await button.trigger('click')
      await flushPromises()

      expect(writeText).toHaveBeenCalledWith('custom')
      expect(onCopy).toHaveBeenCalledWith({ text: 'custom' })
      expect(wrapper.find('.ant-code-copy .icon-copied').exists()).toBe(true)
      expect(wrapper.find('.ant-code-copy').attributes('aria-label')).toBe('Done')

      const plain = mountCode({ copyable: { text: 'static', tooltips: false } })
      // 不显示 Tooltip 时，aria-label 仍然取 locale 文案。
      expect(plain.find('.ant-code-copy').attributes('aria-label')).toBe('Copy')
      await plain.find('.ant-code-copy').trigger('click')
      await flushPromises()
      expect(writeText).toHaveBeenLastCalledWith('static')
      expect(plain.find('.ant-code-copy').attributes('aria-label')).toBe('Copied')
    })

    it('uses the antdv-next Text locale for the copy label', () => {
      const wrapper = mount(() => h(ConfigProvider, { locale: zhCN }, {
        default: () => h(Code, { content: 'a', copyable: true }),
      }))
      expect(wrapper.find('.ant-code-copy').attributes('aria-label')).toBe('复制')
    })

    it('emits error with stage copy when the clipboard is unavailable', async () => {
      writeText.mockRejectedValue(new Error('denied'))
      const execCommand = vi.fn(() => false)
      ;(document as any).execCommand = execCommand
      const onCopy = vi.fn()
      const onError = vi.fn()
      const wrapper = mountCode({ copyable: true, onCopy, onError })

      await wrapper.find('.ant-code-copy').trigger('click')
      await flushPromises()

      expect(onCopy).not.toHaveBeenCalled()
      expect(onError).toHaveBeenCalledTimes(1)
      expect(onError.mock.calls[0]![0]).toMatchObject({ stage: 'copy' })
      expect(onError.mock.calls[0]![0].error).toBeInstanceOf(Error)
      expect(wrapper.find('.ant-code-copy').classes()).not.toContain('ant-code-copy-success')
      delete (document as any).execCommand
    })

    it('emits error with stage copy when the custom text getter throws', async () => {
      const onError = vi.fn()
      const wrapper = mountCode({
        copyable: {
          text: () => {
            throw new Error('no text')
          },
        },
        onError,
      })
      await wrapper.find('.ant-code-copy').trigger('click')
      await flushPromises()
      expect(onError).toHaveBeenCalledWith({ stage: 'copy', error: expect.objectContaining({ message: 'no text' }) })
      expect(writeText).not.toHaveBeenCalled()
    })

    it('exposes copy and nativeElement through the ref', async () => {
      const onCopy = vi.fn()
      const wrapper = mountCode({ content: 'by ref', onCopy })
      const instance = wrapper.vm as unknown as CodeRef

      expect(instance.nativeElement).toBe(wrapper.element)
      await expect(instance.copy()).resolves.toBeUndefined()
      expect(writeText).toHaveBeenCalledWith('by ref')
      expect(onCopy).toHaveBeenCalledWith({ text: 'by ref' })
    })

    it('clears the copied timer on unmount', async () => {
      vi.useFakeTimers()
      const onCopy = vi.fn()
      const wrapper = mountCode({ copyable: true, onCopy })
      await wrapper.find('.ant-code-copy').trigger('click')
      await vi.waitFor(() => expect(onCopy).toHaveBeenCalled())
      const clear = vi.spyOn(globalThis, 'clearTimeout')
      wrapper.unmount()
      expect(clear).toHaveBeenCalled()
      clear.mockRestore()
    })

    it('does not update state or emit when the copy resolves after unmount', async () => {
      let resolveWrite!: () => void
      writeText.mockImplementation(() => new Promise<void>((resolve) => {
        resolveWrite = resolve
      }))
      const onCopy = vi.fn()
      const onError = vi.fn()
      const wrapper = mountCode({ copyable: true, onCopy, onError })
      await wrapper.find('.ant-code-copy').trigger('click')
      await vi.waitFor(() => expect(writeText).toHaveBeenCalled())

      wrapper.unmount()
      resolveWrite()
      await flushPromises()

      expect(onCopy).not.toHaveBeenCalled()
      expect(onError).not.toHaveBeenCalled()
    })
  })

  describe('extra', () => {
    it('does not render an empty header', () => {
      expect(mountCode({ extra: null }).find('.ant-code-header').exists()).toBe(false)
      expect(mountCode({ extra: () => null }).find('.ant-code-header').exists()).toBe(false)
      expect(mountCode({}, { extra: () => [] }).find('.ant-code-header').exists()).toBe(false)
    })

    it('renders the extra prop as a node or a render function with info', () => {
      const node = mountCode({ extra: h('span', { class: 'from-prop' }, 'TS') })
      expect(node.find('.ant-code-header .ant-code-extra .from-prop').text()).toBe('TS')

      const extra = vi.fn(info => h('span', { class: 'from-fn' }, info.language))
      const fn = mountCode({ extra, language: 'ts' })
      expect(fn.find('.from-fn').text()).toBe('ts')
      expect(extra.mock.calls[0]![0]).toMatchObject({ copied: false, language: 'ts', copy: expect.any(Function) })
    })

    it('prefers the #extra slot over the prop and passes copy to it', async () => {
      const onCopy = vi.fn()
      const wrapper = mountCode(
        { extra: h('span', { class: 'from-prop' }), content: 'slot copy', onCopy },
        { extra: (info: any) => h('button', { class: 'from-slot', onClick: info.copy }, info.copied ? 'done' : 'copy') },
      )

      expect(wrapper.find('.from-prop').exists()).toBe(false)
      expect(wrapper.find('.from-slot').text()).toBe('copy')

      await wrapper.find('.from-slot').trigger('click')
      await flushPromises()

      expect(writeText).toHaveBeenCalledWith('slot copy')
      expect(wrapper.find('.from-slot').text()).toBe('done')
    })

    it('renders extra before the copy button', () => {
      const wrapper = mountCode({ copyable: true, extra: h('span', { class: 'from-prop' }) })
      const children = Array.from(wrapper.find('.ant-code-header').element.children)
      expect(children[0]!.className).toContain('ant-code-extra')
      expect(children[1]!.className).toContain('ant-code-copy')
    })
  })

  describe('class, style and semantic', () => {
    it('merges attrs class and style last and passes other attrs to the root', () => {
      const wrapper = mountCode(
        { rootClass: 'root-cls', styles: { root: { color: 'rgb(255, 0, 0)', marginTop: '1px' } } },
        {},
        { 'class': 'attr-cls', 'style': { color: 'rgb(0, 0, 255)' }, 'data-testid': 'code', 'id': 'my-code' },
      )
      const root = wrapper.element as HTMLElement

      expect(wrapper.classes()).toEqual(expect.arrayContaining(['ant-code', 'root-cls', 'attr-cls']))
      expect(wrapper.classes().pop()).toBe('attr-cls')
      expect(root.style.color).toBe('rgb(0, 0, 255)')
      expect(root.style.marginTop).toBe('1px')
      expect(root.dataset.testid).toBe('code')
      expect(root.id).toBe('my-code')
    })

    it('supports object and function classes / styles for every semantic node', () => {
      const classes = {
        root: 's-root',
        header: 's-header',
        pre: 's-pre',
        line: 's-line',
        lineNumber: 's-line-number',
        marker: 's-marker',
        copy: 's-copy',
      }
      const wrapper = mountCode({
        content: '+a\n b',
        diff: true,
        showLineNumbers: true,
        copyable: true,
        classes,
        styles: info => ({
          root: { paddingTop: info.props.diff ? '4px' : '0px' },
          header: { paddingTop: '1px' },
          pre: { paddingTop: '2px' },
          line: { paddingTop: '3px' },
          lineNumber: { opacity: info.props.showLineNumbers ? '0.5' : '1' },
          marker: { opacity: '0.6' },
          copy: { opacity: '0.7' },
        }),
      })

      expect(wrapper.classes()).toContain('s-root')
      expect(wrapper.find('.ant-code-header').classes()).toContain('s-header')
      expect(wrapper.find('.ant-code-pre').classes()).toContain('s-pre')
      expect(wrapper.findAll('.ant-code-line').every(node => node.classes().includes('s-line'))).toBe(true)
      expect(wrapper.findAll('.ant-code-line-number').every(node => node.classes().includes('s-line-number'))).toBe(true)
      expect(wrapper.find('.ant-code-marker').classes()).toContain('s-marker')
      expect(wrapper.find('.ant-code-copy').classes()).toContain('s-copy')

      expect((wrapper.element as HTMLElement).style.paddingTop).toBe('4px')
      expect((wrapper.find('.ant-code-header').element as HTMLElement).style.paddingTop).toBe('1px')
      expect((wrapper.find('.ant-code-pre').element as HTMLElement).style.paddingTop).toBe('2px')
      expect((wrapper.find('.ant-code-line').element as HTMLElement).style.paddingTop).toBe('3px')
      expect((wrapper.find('.ant-code-line-number').element as HTMLElement).style.opacity).toBe('0.5')
      expect((wrapper.find('.ant-code-marker').element as HTMLElement).style.opacity).toBe('0.6')
      expect((wrapper.find('.ant-code-copy').element as HTMLElement).style.opacity).toBe('0.7')
    })

    it('passes merged defaults to semantic functions', () => {
      const classes = vi.fn(() => ({}))
      mountCode({ classes })
      expect(classes).toHaveBeenCalledWith({
        props: expect.objectContaining({
          language: 'text',
          showLineNumbers: false,
          wordWrap: false,
          copyable: false,
          theme: 'auto',
        }),
      })
    })

    it('supports a custom prefixCls', () => {
      const wrapper = mountCode({ prefixCls: 'my-code', showLineNumbers: true })
      expect(wrapper.classes()).toContain('my-code')
      expect(wrapper.find('.my-code-pre .my-code-line .my-code-line-number').exists()).toBe(true)
    })
  })

  describe('ProConfigProvider', () => {
    it('applies defaults from ProConfigProvider', () => {
      const wrapper = mount(() => h(ProConfigProvider, {
        code: {
          showLineNumbers: true,
          wordWrap: true,
          copyable: true,
          theme: 'dark',
          class: 'config-cls',
          style: { marginTop: '2px' },
          classes: { pre: 'config-pre' },
          styles: { pre: { paddingTop: '5px' } },
        },
      }, { default: () => h(Code, { content: 'a' }) }))
      const root = wrapper.find('.ant-code')

      expect(root.classes()).toEqual(expect.arrayContaining(['config-cls', 'ant-code-word-wrap', 'ant-code-dark']))
      expect((root.element as HTMLElement).style.marginTop).toBe('2px')
      expect(wrapper.find('.ant-code-line-number').exists()).toBe(true)
      expect(wrapper.find('.ant-code-copy').exists()).toBe(true)
      expect(wrapper.find('.ant-code-pre').classes()).toContain('config-pre')
      expect((wrapper.find('.ant-code-pre').element as HTMLElement).style.paddingTop).toBe('5px')
    })

    it('lets props win over ProConfigProvider', () => {
      const wrapper = mount(() => h(ProConfigProvider, {
        code: { showLineNumbers: true, wordWrap: true, copyable: true, theme: 'dark', classes: { pre: 'config-pre' } },
      }, {
        default: () => h(Code, {
          content: 'a',
          showLineNumbers: false,
          wordWrap: false,
          copyable: false,
          theme: 'light',
          classes: { pre: 'prop-pre' },
        }),
      }))
      const root = wrapper.find('.ant-code')

      expect(root.classes()).not.toContain('ant-code-word-wrap')
      expect(root.classes()).not.toContain('ant-code-dark')
      expect(wrapper.find('.ant-code-line-number').exists()).toBe(false)
      expect(wrapper.find('.ant-code-copy').exists()).toBe(false)
      // 语义化 class 是合并而不是替换。
      expect(wrapper.find('.ant-code-pre').classes()).toEqual(expect.arrayContaining(['config-pre', 'prop-pre']))
    })
  })

  describe('theme and direction', () => {
    it('follows the antd theme when theme is auto', () => {
      const light = mount(() => h(ConfigProvider, null, { default: () => h(Code, { content: 'a' }) }))
      expect(light.find('.ant-code').classes()).not.toContain('ant-code-dark')

      const dark = mount(() => h(ConfigProvider, { theme: { algorithm: theme.darkAlgorithm } }, {
        default: () => h(Code, { content: 'a' }),
      }))
      expect(dark.find('.ant-code').classes()).toContain('ant-code-dark')
    })

    it('lets theme light / dark override the antd theme', () => {
      const forcedLight = mount(() => h(ConfigProvider, { theme: { algorithm: theme.darkAlgorithm } }, {
        default: () => h(Code, { content: 'a', theme: 'light' }),
      }))
      expect(forcedLight.find('.ant-code').classes()).not.toContain('ant-code-dark')
      expect(mountCode({ theme: 'dark' }).classes()).toContain('ant-code-dark')
    })

    it('adds the rtl class but keeps the code itself ltr', () => {
      const wrapper = mount(() => h(ConfigProvider, { direction: 'rtl' }, {
        default: () => h(Code, { content: 'a', copyable: true }),
      }))
      expect(wrapper.find('.ant-code').classes()).toContain('ant-code-rtl')
      expect(wrapper.find('.ant-code-pre').attributes('dir')).toBe('ltr')
    })
  })
})
