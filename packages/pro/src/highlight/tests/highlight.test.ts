import type { HighlightProps } from '../types'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import rtlTest from '../../../../../tests/shared/rtlTest'
import { ProConfigProvider } from '../../index'
import Highlight from '../index'
import { prepareComponentToken } from '../style/token'

function mountHighlight(props: HighlightProps = {}, slots: Record<string, any> = {}, attrs: Record<string, any> = {}) {
  return mount(Highlight, {
    props: { content: 'Free shipping on orders over $50.', keywords: ['free', '$50'], ...props },
    attrs,
    slots,
  })
}

describe('Highlight', () => {
  it('renders a span root with mark chunks and bare text nodes', () => {
    const wrapper = mountHighlight()
    const root = wrapper.element as HTMLElement

    expect(root.tagName).toBe('SPAN')
    expect(root.classList.contains('ant-highlight')).toBe(true)
    expect(root.textContent).toBe('Free shipping on orders over $50.')

    const marks = wrapper.findAll('mark.ant-highlight-highlight')
    expect(marks.map(mark => mark.text())).toEqual(['Free', '$50'])
    // 未命中部分是裸文本节点，不包裹任何元素。
    expect(Array.from(root.childNodes).map(node => node.nodeType)).toEqual([
      Node.ELEMENT_NODE,
      Node.TEXT_NODE,
      Node.ELEMENT_NODE,
      Node.TEXT_NODE,
    ])
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders nothing inside the root for empty or nullish content', () => {
    expect(mountHighlight({ content: '' }).element.childNodes).toHaveLength(0)
    expect(mountHighlight({ content: null as any }).element.textContent).toBe('')
  })

  it('renders content as text, never as HTML', async () => {
    const wrapper = mountHighlight({ content: '<script>alert(1)</script><b>bold</b>', keywords: 'bold' })
    expect(wrapper.find('script').exists()).toBe(false)
    expect(wrapper.find('b').exists()).toBe(false)
    expect(wrapper.text()).toBe('<script>alert(1)</script><b>bold</b>')

    const app = createSSRApp({ render: () => h(Highlight, { content: '<img src=x onerror=alert(1)>', keywords: 'img' }) })
    const html = await renderToString(app)
    expect(html).not.toContain('<img')
    expect(html).toContain('&lt;')
  })

  it('renders the same markup on the server and on the client', async () => {
    const props = { content: 'ReactVue vue', keywords: ['React', 'Vue'] }
    const html = await renderToString(createSSRApp({ render: () => h(Highlight, props) }))
    const wrapper = mount(Highlight, { props })
    const normalize = (value: string) => value.replace(/<!--[\s\S]*?-->/g, '').replace(/ (class|style)="[^"]*"/g, '')
    expect(normalize(html)).toBe(normalize(wrapper.html({ raw: true })))
  })

  it('passes caseSensitive and RegExp keywords through', () => {
    expect(mountHighlight({ content: 'Vue vue', keywords: 'vue', caseSensitive: true }).findAll('mark').map(m => m.text())).toEqual(['vue'])
    expect(mountHighlight({ content: 'ERROR WARN info', keywords: /ERROR|WARN/g }).findAll('mark').map(m => m.text())).toEqual(['ERROR', 'WARN'])
  })

  it('keeps adjacent hits as separate chunks', () => {
    const wrapper = mountHighlight({ content: 'ReactVue', keywords: ['React', 'Vue'] })
    expect(wrapper.findAll('mark').map(m => m.text())).toEqual(['React', 'Vue'])
  })

  it('supports a custom highlightTag as a string or a component', () => {
    expect(mountHighlight({ highlightTag: 'strong' }).findAll('strong.ant-highlight-highlight')).toHaveLength(2)

    const Badge = defineComponent({
      setup(_, { slots }) {
        return () => h('em', { class: 'badge' }, slots.default?.())
      },
    })
    const wrapper = mountHighlight({ highlightTag: Badge })
    const badges = wrapper.findAll('em.badge.ant-highlight-highlight')
    expect(badges.map(badge => badge.text())).toEqual(['Free', '$50'])
  })

  it('renders highlightRender inside the highlight tag', () => {
    const highlightRender = vi.fn(({ text, index }) => h('span', { class: 'custom' }, `${index}:${text}`))
    const wrapper = mountHighlight({ highlightRender })

    expect(wrapper.findAll('mark > .custom').map(node => node.text())).toEqual(['0:Free', '1:$50'])
    expect(highlightRender.mock.calls[1]![0]).toEqual({ text: '$50', index: 1, start: 29, end: 32, keyword: '$50' })
  })

  it('prefers the #highlight slot over highlightRender', () => {
    const highlightRender = vi.fn(() => 'prop')
    const wrapper = mountHighlight({ highlightRender }, {
      highlight: ({ text }: { text: string }) => h('i', text.toUpperCase()),
    })

    expect(wrapper.findAll('mark > i').map(node => node.text())).toEqual(['FREE', '$50'])
    expect(highlightRender).not.toHaveBeenCalled()
  })

  it('falls back to the matched text when the custom render is empty', () => {
    expect(mountHighlight({}, { highlight: () => null }).findAll('mark').map(m => m.text())).toEqual(['Free', '$50'])
    expect(mountHighlight({ highlightRender: () => [] }).findAll('mark').map(m => m.text())).toEqual(['Free', '$50'])
  })

  it('applies classes and styles as objects or functions', () => {
    const wrapper = mountHighlight({
      classes: { root: 'r', highlight: 'hl' },
      styles: { root: { color: 'red' }, highlight: { fontWeight: 700 } },
    })
    expect(wrapper.classes()).toContain('r')
    expect(wrapper.attributes('style')).toContain('color: red')
    expect(wrapper.findAll('mark.hl')).toHaveLength(2)
    expect(wrapper.find('mark').attributes('style')).toContain('font-weight: 700')

    const fnWrapper = mountHighlight({
      caseSensitive: true,
      classes: ({ props }) => ({ highlight: props.caseSensitive ? 'is-cs' : 'no-cs' }),
      styles: ({ props }) => ({ highlight: { color: props.highlightTag === 'mark' ? 'blue' : 'green' } }),
    })
    expect(fnWrapper.findAll('mark.is-cs')).toHaveLength(1)
    expect(fnWrapper.find('mark').attributes('style')).toContain('color: blue')
  })

  it('merges attrs class and style last and forwards other attrs', async () => {
    const onClick = vi.fn()
    const wrapper = mountHighlight({
      rootClass: 'root-cls',
      styles: { root: { color: 'red' } },
    }, {}, { 'class': 'attr-cls', 'style': { color: 'green' }, 'data-id': 'x', onClick })

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['ant-highlight', 'root-cls', 'attr-cls']))
    expect(wrapper.attributes('style')).toBe('color: green;')
    expect(wrapper.attributes('data-id')).toBe('x')
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('uses ProConfigProvider defaults and lets props override them', () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        highlight: {
          caseSensitive: true,
          highlightTag: 'b',
          class: 'cfg-cls',
          style: { color: 'red' },
          classes: { highlight: 'cfg-hl' },
          styles: { highlight: { color: 'blue' } },
        },
      },
      slots: {
        default: () => [
          h(Highlight, { class: 'a', content: 'Vue vue', keywords: 'vue' }),
          h(Highlight, { class: 'b', content: 'Vue vue', keywords: 'vue', caseSensitive: false, highlightTag: 'u', classes: { highlight: 'own' } }),
        ],
      },
    })

    const first = wrapper.find('.a')
    expect(first.classes()).toContain('cfg-cls')
    expect(first.attributes('style')).toContain('color: red')
    expect(first.findAll('b.cfg-hl').map(node => node.text())).toEqual(['vue'])
    expect(first.find('b').attributes('style')).toContain('color: blue')

    const second = wrapper.find('.b')
    expect(second.findAll('u.cfg-hl.own').map(node => node.text())).toEqual(['Vue', 'vue'])
  })

  it('passes findChunks to the tokenizer', () => {
    const wrapper = mountHighlight({
      content: 'zhong guo',
      keywords: 'zg',
      findChunks: ({ keywords }) => (keywords[0] === 'zg' ? [{ start: 0, end: 1 }, { start: 6, end: 7 }] : []),
    })
    expect(wrapper.findAll('mark').map(m => m.text())).toEqual(['z', 'g'])
  })

  it('does not re-split when a literal keywords array keeps the same content', async () => {
    const content = 'free shipping'
    // 用 findChunks 计数切分次数，它返回与内置扫描一致的区间。
    const findChunks = vi.fn(({ keywords }: { keywords: any[] }) => keywords.map((keyword) => {
      const start = content.indexOf(keyword)
      return { start, end: start + keyword.length, keyword }
    }))
    const tick = ref(0)
    const keywords = ref<string[]>(['free'])
    const wrapper = mount({
      render: () => h('div', { 'data-tick': tick.value }, [
        h(Highlight, { content, keywords: [...keywords.value], findChunks }),
      ]),
    })
    expect(findChunks).toHaveBeenCalledTimes(1)

    tick.value++
    await nextTick()
    expect(wrapper.find('div').attributes('data-tick')).toBe('1')
    expect(findChunks).toHaveBeenCalledTimes(1)

    keywords.value = ['shipping']
    await nextTick()
    expect(findChunks).toHaveBeenCalledTimes(2)
    expect(wrapper.find('mark').text()).toBe('shipping')
  })

  it('updates when content changes', async () => {
    const wrapper = mountHighlight()
    await wrapper.setProps({ content: 'free free' })
    expect(wrapper.findAll('mark')).toHaveLength(2)
  })

  it('exposes nativeElement', () => {
    const wrapper = mountHighlight()
    expect((wrapper.vm as any).nativeElement).toBe(wrapper.element)
  })

  it('adds the rtl class', () => {
    const wrapper = mount(ProConfigProvider, {
      props: { direction: 'rtl' },
      slots: { default: () => h(Highlight, { content: 'abc', keywords: 'b' }) },
    })
    expect(wrapper.find('.ant-highlight').classes()).toContain('ant-highlight-rtl')
  })

  it('defaults to primary-colored text on a transparent background', () => {
    const token = prepareComponentToken({ colorPrimary: '#1677ff', gold3: '#ffe58f', borderRadiusXS: 2 })
    expect(token.highlightColor).toBe('#1677ff')
    expect(token.highlightBg).toBe('transparent')
    expect(token.highlightFontWeight).toBe('inherit')
    expect(token.highlightPaddingInline).toBe(0)
    // 跟随品牌主色
    expect(prepareComponentToken({ colorPrimary: '#00b96b' }).highlightColor).toBe('#00b96b')
  })
})

rtlTest(Highlight)
