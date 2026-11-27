import { mount } from '@vue/test-utils'
import { ConfigProvider, Form, FormItem } from 'antdv-next'
import { describe, expect, it, vi } from 'vitest'
import { createCommentVNode, defineComponent, h, isRef, nextTick, reactive, ref } from 'vue'
import { InputTag, ProConfigProvider } from '../../index'
import enUS from '../../locale/en_US'
import frFR from '../../locale/fr_FR'
import zhCN from '../../locale/zh_CN'

function getInput(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('input')
}

describe('InputTag', () => {
  it('renders tags and supports enter submission', async () => {
    const wrapper = mount(InputTag, { props: { defaultValue: ['one'] } })
    const input = getInput(wrapper)

    await input.setValue('two')
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one', 'two'])
    expect(input.element.value).toBe('')
  })

  it('shows the placeholder only when there is no content', () => {
    const emptyWrapper = mount(InputTag, { props: { placeholder: 'Add a tag' } })
    expect(getInput(emptyWrapper).attributes('placeholder')).toBe('Add a tag')

    const taggedWrapper = mount(InputTag, { props: { defaultValue: ['one'], placeholder: 'Add a tag' } })
    expect(getInput(taggedWrapper).attributes('placeholder')).toBeUndefined()

    const inputWrapper = mount(InputTag, { props: { defaultInputValue: 'draft', placeholder: 'Add a tag' } })
    expect(getInput(inputWrapper).attributes('placeholder')).toBeUndefined()
  })

  it('splits token separators when submitted with Enter', async () => {
    const onChange = vi.fn()
    const wrapper = mount(InputTag, {
      props: { tokenSeparators: [',', '|'], onChange },
    })
    const input = getInput(wrapper)

    await input.setValue('one,two|pending')
    // 输入过程中遇到分隔符立即拆分提交
    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one', 'two'])
    expect(input.element.value).toBe('pending')

    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one', 'two', 'pending'])
    expect(input.element.value).toBe('')
    expect(onChange).toHaveBeenLastCalledWith(['one', 'two', 'pending'], expect.objectContaining({ trigger: 'enter' }))
  })

  it('commits tags immediately when a token separator is typed', async () => {
    const wrapper = mount(InputTag, {
      props: { tokenSeparators: [',', '|'] },
    })
    const input = getInput(wrapper)

    await input.setValue('one')
    expect(wrapper.findAll('.ant-tag')).toHaveLength(0)
    expect(input.element.value).toBe('one')

    await input.setValue('one,')
    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one'])
    expect(input.element.value).toBe('')

    await input.setValue('two')
    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one'])
    expect(input.element.value).toBe('two')

    await input.setValue('two|')
    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one', 'two'])
    expect(input.element.value).toBe('')
    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual(expect.objectContaining({ trigger: 'token-separator' }))
  })

  it('ignores Enter during IME composition and commits normally after compositionend', async () => {
    const wrapper = mount(InputTag, { props: { defaultValue: ['one'] } })
    const input = getInput(wrapper)

    // 输入法组合开始
    await input.trigger('compositionstart')
    await input.setValue('中文')
    expect(wrapper.findAll('.ant-tag')).toHaveLength(1)

    // 组合中按 Enter 不提交
    await input.trigger('keydown', { key: 'Enter', isComposing: true })
    expect(wrapper.findAll('.ant-tag')).toHaveLength(1)
    expect(input.element.value).toBe('中文')

    // 组合结束
    await input.trigger('compositionend')
    await input.trigger('keydown', { key: 'Enter' })
    await input.trigger('keyup', { key: 'Enter' })
    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one', '中文'])
    expect(input.element.value).toBe('')
  })

  it('does not tokenize separators during IME composition', async () => {
    const wrapper = mount(InputTag, { props: { tokenSeparators: [','] } })
    const input = getInput(wrapper)

    // 组合中输入包含分隔符的内容：不应立即拆分
    await input.trigger('compositionstart')
    await input.setValue('中文,')
    expect(wrapper.findAll('.ant-tag')).toHaveLength(0)
    expect(input.element.value).toBe('中文,')

    // 组合结束、继续输入后再提交，才触发拆分
    await input.trigger('compositionend')
    await input.setValue('中文,')
    await input.trigger('keydown', { key: 'Enter' })
    await input.trigger('keyup', { key: 'Enter' })
    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['中文'])
  })

  it('filters duplicates and maxCount', async () => {
    const wrapper = mount(InputTag, {
      props: { tokenSeparators: [','], maxCount: 2, defaultValue: ['one'] },
    })
    const input = getInput(wrapper)

    await input.setValue('one,two,three')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one', 'two'])
  })

  it('disables input when maxCount is reached and re-enables it after removal', async () => {
    const wrapper = mount(InputTag, {
      props: { defaultValue: ['one'], maxCount: 2 },
    })
    const input = getInput(wrapper)

    // 未达上限：可输入
    expect(input.element.readOnly).toBe(false)

    // 添加一个标签后达到上限：输入框变为只读，且无法再提交
    await input.setValue('two')
    await input.trigger('keydown', { key: 'Enter' })
    await input.trigger('keyup', { key: 'Enter' })
    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one', 'two'])
    expect(input.element.readOnly).toBe(true)

    // 只读状态下输入无效
    await input.setValue('three')
    expect(wrapper.findAll('.ant-tag')).toHaveLength(2)

    // 删除一个标签后恢复输入
    await wrapper.find('.ant-tag-close-icon').trigger('click')
    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['two'])
    expect(input.element.readOnly).toBe(false)
  })

  it('filters duplicates by strict string equality (case-sensitive)', async () => {
    const wrapper = mount(InputTag, {
      props: { defaultValue: ['Vue'] },
    })
    const input = getInput(wrapper)

    // 完全相同的字符串会被过滤
    await input.setValue('Vue')
    await input.trigger('keydown', { key: 'Enter' })
    await input.trigger('keyup', { key: 'Enter' })
    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['Vue'])

    // 大小写不同不算重复
    await input.setValue('vue')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['Vue', 'vue'])
  })

  it('supports controlled value and inputValue', async () => {
    const wrapper = mount(InputTag, {
      props: { value: ['one'], inputValue: 'draft' },
    })
    const input = getInput(wrapper)

    expect(input.element.value).toBe('draft')
    await wrapper.find('.ant-tag-close-icon').trigger('click')
    expect(wrapper.emitted('update:value')?.[0]).toEqual([[]])
    expect(wrapper.findAll('.ant-tag')).toHaveLength(1)

    await input.setValue('next')
    const inputEvents = wrapper.emitted('update:inputValue') || []
    expect(inputEvents[inputEvents.length - 1]).toEqual(['next'])
  })

  it('keeps controlled value unchanged on Enter while emitting events', async () => {
    const wrapper = mount(InputTag, { props: { value: ['one'] } })
    const input = getInput(wrapper)

    await input.setValue('two')
    await input.trigger('keydown', { key: 'Enter' })
    await input.trigger('keyup', { key: 'Enter' })

    // 受控：UI 不变，仅发事件
    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one'])
    expect(wrapper.emitted('update:value')?.[0]).toEqual([['one', 'two']])
    expect(wrapper.emitted('change')?.[0]?.[1]).toEqual(expect.objectContaining({ trigger: 'enter' }))
  })

  it('emits clear events on controlled value with allowClear', async () => {
    const wrapper = mount(InputTag, { props: { value: ['one'], allowClear: true } })
    const input = getInput(wrapper)

    await wrapper.find('.ant-input-tag-clear').trigger('click')

    expect(wrapper.findAll('.ant-tag')).toHaveLength(1)
    expect(wrapper.emitted('update:value')?.[0]).toEqual([[]])
    expect(wrapper.emitted('clear')).toHaveLength(1)
    // 受控 inputValue：clear 时也发出 update:inputValue
    expect(wrapper.emitted('update:inputValue')?.[0]).toEqual([''])
    expect(input.element.value).toBe('')
  })

  it('keeps inputValue controlled on Enter submission', async () => {
    const wrapper = mount(InputTag, { props: { inputValue: 'draft' } })
    const input = getInput(wrapper)

    await input.trigger('keydown', { key: 'Enter' })
    await input.trigger('keyup', { key: 'Enter' })

    // 提交后输入框仍保持受控值
    expect(wrapper.emitted('update:value')?.[0]).toEqual([['draft']])
    expect(input.element.value).toBe('draft')
    // 组件尝试清空输入框，但受控值仍为 draft
    const inputEvents = wrapper.emitted('update:inputValue') || []
    expect(inputEvents[inputEvents.length - 1]).toEqual([''])
  })

  it('respects maxCount when value is controlled and emits add events', async () => {
    const wrapper = mount(InputTag, { props: { value: ['one'], maxCount: 2, tokenSeparators: [','] } })
    const input = getInput(wrapper)

    await input.setValue('two,three')
    await input.trigger('keydown', { key: 'Enter' })
    await input.trigger('keyup', { key: 'Enter' })

    // 事件中携带完整候选，UI 不变
    expect(wrapper.emitted('update:value')?.[0]).toEqual([['one', 'two']])
    expect(wrapper.emitted('add')?.[0]).toEqual(['two', expect.objectContaining({ index: 1 })])
    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one'])
  })

  it('supports a custom space trigger', async () => {
    const wrapper = mount(InputTag, { props: { trigger: 'space' } })
    const input = getInput(wrapper)

    await input.setValue('two')
    await input.trigger('keyup', { key: ' ' })

    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['two'])
    expect(input.element.value).toBe('')
  })

  it('saves the input value on blur when enabled', async () => {
    const wrapper = mount(InputTag, { props: { saveOnBlur: true } })
    const input = getInput(wrapper)

    await input.setValue('draft')
    await input.trigger('blur')

    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['draft'])
    expect(input.element.value).toBe('')
  })

  it('keeps the input value on blur when saveOnBlur is disabled', async () => {
    const wrapper = mount(InputTag, { props: { saveOnBlur: false } })
    const input = getInput(wrapper)

    await input.setValue('draft')
    await input.trigger('blur')

    expect(wrapper.findAll('.ant-tag')).toHaveLength(0)
    expect(input.element.value).toBe('draft')
  })

  it('supports dragging tags to reorder them', async () => {
    const onDragTag = vi.fn()
    const wrapper = mount(InputTag, {
      props: { defaultValue: ['one', 'two', 'three'], draggable: true, onDragTag },
    })
    const tags = wrapper.findAll('.ant-tag')

    // 0 -> 2 左半区：one 插入到 three 之前
    tags[2]!.element.getBoundingClientRect = () => ({ left: 100, width: 40, top: 0, right: 140, bottom: 20 } as DOMRect)
    await tags[0]!.trigger('dragstart')
    await tags[2]!.trigger('dragover', { clientX: 105 })
    await tags[2]!.trigger('drop', { clientX: 105 })

    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['two', 'one', 'three'])
    expect(onDragTag).toHaveBeenCalledWith(0, 1, 'one', expect.any(Event))
  })

  it('inserts the dragged tag after the target when dropped on the right half', async () => {
    const wrapper = mount(InputTag, {
      props: { defaultValue: ['one', 'two', 'three'], draggable: true },
    })
    const tags = wrapper.findAll('.ant-tag')

    // 0 -> 2 右半区：one 插入到 three 之后
    tags[2]!.element.getBoundingClientRect = () => ({ left: 100, width: 40, top: 0, right: 140, bottom: 20 } as DOMRect)
    await tags[0]!.trigger('dragstart')
    await tags[2]!.trigger('dragover', { clientX: 130 })
    await tags[2]!.trigger('drop', { clientX: 130 })

    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['two', 'three', 'one'])
  })

  it('handles dragging edge cases between adjacent tags', async () => {
    async function dragCase(values: string[], from: number, to: number, clientX: number) {
      const wrapper = mount(InputTag, { props: { defaultValue: values, draggable: true } })
      const tags = wrapper.findAll('.ant-tag')
      tags[to]!.element.getBoundingClientRect = () => ({ left: 100, width: 40, top: 0, right: 140, bottom: 20 } as DOMRect)
      await tags[from]!.trigger('dragstart')
      await tags[to]!.trigger('dragover', { clientX })
      await tags[to]!.trigger('drop', { clientX })
      return wrapper.findAll('.ant-tag').map(tag => tag.text())
    }

    // 0 -> 1 右半区：one 插到 two 之后 -> 交换
    expect(await dragCase(['one', 'two', 'three'], 0, 1, 130)).toEqual(['two', 'one', 'three'])
    // 0 -> 1 左半区：one 插到 two 之前 -> 不变（one 本就在 two 前）
    expect(await dragCase(['one', 'two', 'three'], 0, 1, 105)).toEqual(['one', 'two', 'three'])
    // 1 -> 2 右半区：two 插到 three 之后 -> 交换
    expect(await dragCase(['one', 'two', 'three'], 1, 2, 130)).toEqual(['one', 'three', 'two'])
    // 2 -> 0 右半区：three 插到 one 之后 -> 交换
    expect(await dragCase(['one', 'two', 'three'], 2, 0, 130)).toEqual(['one', 'three', 'two'])
    // 2 -> 0 左半区：three 插到 one 之前 -> 交换
    expect(await dragCase(['one', 'two', 'three'], 2, 0, 105)).toEqual(['three', 'one', 'two'])
    // 2 -> 1 左半区：three 插到 two 之前 -> 交换
    expect(await dragCase(['one', 'two', 'three'], 2, 1, 105)).toEqual(['one', 'three', 'two'])
    // 2 -> 1 右半区：three 插到 two 之后 -> 不变（three 本就在 two 后）
    expect(await dragCase(['one', 'two', 'three'], 2, 1, 130)).toEqual(['one', 'two', 'three'])
  })

  it('shows the drop indicator on the hovered target half', async () => {
    const wrapper = mount(InputTag, {
      props: { defaultValue: ['one', 'two', 'three'], draggable: true },
    })
    const tags = wrapper.findAll('.ant-tag')

    tags[1]!.element.getBoundingClientRect = () => ({ left: 100, width: 40, top: 0, right: 140, bottom: 20 } as DOMRect)
    await tags[0]!.trigger('dragstart')

    await tags[1]!.trigger('dragover', { clientX: 105 })
    expect(tags[1]!.classes()).toContain('ant-input-tag-tag-drag-before')
    expect(tags[1]!.classes()).not.toContain('ant-input-tag-tag-drag-after')

    await tags[1]!.trigger('dragover', { clientX: 130 })
    expect(tags[1]!.classes()).toContain('ant-input-tag-tag-drag-after')
    expect(tags[1]!.classes()).not.toContain('ant-input-tag-tag-drag-before')

    await tags[1]!.trigger('dragend')
    expect(tags[1]!.classes()).not.toContain('ant-input-tag-tag-drag-before')
    expect(tags[1]!.classes()).not.toContain('ant-input-tag-tag-drag-after')
  })

  it('mirrors drag insert position under rtl', async () => {
    async function dragRtl(from: number, to: number, clientX: number) {
      const wrapper = mount(ConfigProvider, {
        props: { direction: 'rtl' },
        slots: {
          default: () => h(InputTag, { defaultValue: ['one', 'two', 'three'], draggable: true }),
        },
      })
      const tags = wrapper.findAll('.ant-tag')
      expect(wrapper.find('.ant-input-tag-rtl').exists()).toBe(true)
      tags[to]!.element.getBoundingClientRect = () => ({ left: 100, width: 40, top: 0, right: 140, bottom: 20 } as DOMRect)
      await tags[from]!.trigger('dragstart')
      await tags[to]!.trigger('dragover', { clientX })
      await tags[to]!.trigger('drop', { clientX })
      return wrapper.findAll('.ant-tag').map(tag => tag.text())
    }

    // 左半区在 RTL 中是 after：one 插到 three 之后
    expect(await dragRtl(0, 2, 105)).toEqual(['two', 'three', 'one'])
    // 右半区在 RTL 中是 before：one 插到 three 之前
    expect(await dragRtl(0, 2, 130)).toEqual(['two', 'one', 'three'])
  })

  it('shows the rtl drop indicator on the logical start half', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: {
        default: () => h(InputTag, { defaultValue: ['one', 'two', 'three'], draggable: true }),
      },
    })
    const tags = wrapper.findAll('.ant-tag')
    tags[1]!.element.getBoundingClientRect = () => ({ left: 100, width: 40, top: 0, right: 140, bottom: 20 } as DOMRect)
    await tags[0]!.trigger('dragstart')

    await tags[1]!.trigger('dragover', { clientX: 105 })
    expect(tags[1]!.classes()).toContain('ant-input-tag-tag-drag-after')
    expect(tags[1]!.classes()).not.toContain('ant-input-tag-tag-drag-before')

    await tags[1]!.trigger('dragover', { clientX: 130 })
    expect(tags[1]!.classes()).toContain('ant-input-tag-tag-drag-before')
    expect(tags[1]!.classes()).not.toContain('ant-input-tag-tag-drag-after')
  })

  it('collapses tags beyond maxTagCount', () => {
    const wrapper = mount(InputTag, {
      props: { defaultValue: ['one', 'two', 'three', 'four'], maxTagCount: 2 },
    })

    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one', 'two', '+ 2'])
  })

  it('renders non-interactive tags inside the collapse tooltip', async () => {
    const wrapper = mount(InputTag, {
      props: {
        defaultValue: ['one', 'two', 'three', 'four'],
        maxTagCount: 2,
        maxTagTooltip: true,
        draggable: true,
        allowClear: true,
      },
    })

    // Tooltip 未展开时，折叠标签不带关闭按钮（closable 仅作用于主区域 Tag）
    const collapsedTag = wrapper.find('.ant-input-tag-collapse')
    expect(collapsedTag.exists()).toBe(true)
    expect(collapsedTag.find('.ant-tag-close-icon').exists()).toBe(false)
    expect(collapsedTag.attributes('draggable')).toBeUndefined()

    // 展开 Tooltip，校验内部 Tag 为纯展示：无关闭按钮、无拖拽
    await collapsedTag.trigger('mouseenter')
    await new Promise(resolve => setTimeout(resolve, 300))

    const tooltip = document.body.querySelector('.ant-tooltip')
    expect(tooltip).toBeTruthy()
    const tooltipTags = tooltip!.querySelectorAll('.ant-tag')
    expect(tooltipTags.length).toBeGreaterThan(0)
    tooltipTags.forEach((tag) => {
      expect(tag.querySelector('.ant-tag-close-icon')).toBeNull()
      expect(tag.getAttribute('draggable')).toBeNull()
    })

    // 主区域 Tag 的交互不受影响
    wrapper.findAll('.ant-tag:not(.ant-input-tag-collapse)').forEach((tag) => {
      expect(tag.attributes('draggable')).toBe('true')
    })
  })

  it('uses the locale for the clear button aria-label', () => {
    const wrapper = mount(ProConfigProvider, {
      props: { locale: zhCN },
      slots: {
        default: () => h(InputTag, { defaultValue: ['one'], allowClear: true }),
      },
    })

    expect(wrapper.find('.ant-input-tag-clear').attributes('aria-label')).toBe('清空')
  })

  it('uses translated InputTag messages from the current locale', () => {
    const wrapper = mount(ProConfigProvider, {
      props: { locale: frFR },
      slots: {
        default: () => h(InputTag, {
          defaultValue: ['one', 'two', 'three'],
          allowClear: true,
          maxTagCount: 1,
          maxTagTooltip: true,
        }),
      },
    })

    expect(wrapper.find('.ant-input-tag-clear').attributes('aria-label')).toBe('Effacer')
    expect(wrapper.find('.ant-input-tag-collapse').attributes('aria-label')).toBe('Afficher toutes les étiquettes')
  })

  it('falls back to the English InputTag locale when the current locale omits it', () => {
    const locale = { ...zhCN, InputTag: undefined }
    const wrapper = mount(ProConfigProvider, {
      props: { locale },
      slots: {
        default: () => h(InputTag, { defaultValue: ['one'], allowClear: true }),
      },
    })

    expect(wrapper.find('.ant-input-tag-clear').attributes('aria-label')).toBe(enUS.InputTag!.clear)
  })

  it('makes the collapse tag keyboard accessible and shows the tooltip on focus', async () => {
    const wrapper = mount(InputTag, {
      props: {
        defaultValue: ['one', 'two', 'three', 'four'],
        maxTagCount: 2,
        maxTagTooltip: true,
      },
    })

    const collapsedTag = wrapper.find('.ant-input-tag-collapse')
    expect(collapsedTag.attributes('tabindex')).toBe('0')
    expect(collapsedTag.attributes('role')).toBe('button')
    expect(collapsedTag.attributes('aria-label')).toBe('Show all tags')

    await collapsedTag.trigger('focus')
    await new Promise(resolve => setTimeout(resolve, 300))

    const tooltip = document.body.querySelector('.ant-tooltip')
    expect(tooltip).toBeTruthy()
    expect(tooltip!.querySelectorAll('.ant-tag').length).toBeGreaterThan(0)
  })

  it('toggles the collapse tooltip with click, Enter, and Space', async () => {
    const wrapper = mount(InputTag, {
      props: {
        defaultValue: ['one', 'two', 'three', 'four'],
        maxTagCount: 2,
        maxTagTooltip: true,
      },
    })

    // 清理前面测试残留的 tooltip（rc-trigger 关闭后 popup 仍保留在 body）
    document.body.querySelectorAll('.ant-tooltip').forEach(node => node.remove())

    const collapsedTag = wrapper.find('.ant-input-tag-collapse')

    async function tooltipVisible() {
      const tooltip = document.body.querySelector('.ant-tooltip')
      if (!tooltip)
        return false
      const style = (tooltip as HTMLElement).getAttribute('style') ?? ''
      return !style.includes('display: none') && tooltip.querySelectorAll('.ant-tag').length > 0
    }

    // 初始关闭
    expect(await tooltipVisible()).toBe(false)

    // Enter 打开
    await collapsedTag.trigger('keydown', { key: 'Enter' })
    await new Promise(resolve => setTimeout(resolve, 300))
    expect(await tooltipVisible()).toBe(true)

    // Enter 关闭
    await collapsedTag.trigger('keydown', { key: 'Enter' })
    await new Promise(resolve => setTimeout(resolve, 300))
    expect(await tooltipVisible()).toBe(false)

    // Space 打开
    await collapsedTag.trigger('keydown', { key: ' ' })
    await new Promise(resolve => setTimeout(resolve, 300))
    expect(await tooltipVisible()).toBe(true)

    // click 关闭
    await collapsedTag.trigger('click')
    await new Promise(resolve => setTimeout(resolve, 300))
    expect(await tooltipVisible()).toBe(false)
  })

  it('removes the last tag with backspace and clears all values', async () => {
    const onClear = vi.fn()
    const wrapper = mount(InputTag, {
      props: { defaultValue: ['one', 'two'], allowClear: true, onClear },
    })
    const input = getInput(wrapper)

    await input.trigger('keydown', { key: 'Backspace' })
    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one'])
    await wrapper.find('.ant-input-tag-clear').trigger('click')
    expect(wrapper.findAll('.ant-tag')).toHaveLength(0)
    expect(input.element.value).toBe('')
    expect(onClear).toHaveBeenCalled()
  })

  it('does not mutate values when disabled or readonly', async () => {
    for (const mode of ['disabled', 'readonly'] as const) {
      const wrapper = mount(InputTag, { props: { defaultValue: ['one'], ...(mode === 'disabled' ? { disabled: true } : { readonly: true }), allowClear: true } })
      const input = getInput(wrapper)
      await input.trigger('keydown', { key: 'Backspace' })
      expect(wrapper.findAll('.ant-tag')).toHaveLength(1)
      expect(input.element.disabled).toBe(mode === 'disabled')
      expect(input.element.readOnly).toBe(mode === 'readonly')
      expect(wrapper.find('.ant-input-tag-clear').exists()).toBe(false)
    }
  })

  it('inherits disabled state from ConfigProvider', () => {
    const wrapper = mount(ProConfigProvider, {
      props: { componentDisabled: true },
      slots: {
        default: () => h(InputTag, { defaultValue: ['one'], allowClear: true }),
      },
    })
    const input = getInput(wrapper)

    expect(input.element.disabled).toBe(true)
    expect(wrapper.find('.ant-input-tag-clear').exists()).toBe(false)
  })

  it('applies provider defaults and semantic classes/styles', async () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        inputTag: { tokenSeparators: [','], allowClear: true, class: 'provider-input-tag' },
      },
      slots: {
        default: () => h(InputTag, {
          defaultValue: ['one'],
          classes: { root: 'semantic-root', tag: 'semantic-tag' },
          styles: { root: { outline: '1px solid red' } },
        }),
      },
    })
    const input = getInput(wrapper)
    await input.setValue('two,three')
    await input.trigger('keydown', { key: 'Enter' })
    await nextTick()

    expect(wrapper.find('.provider-input-tag').exists()).toBe(true)
    expect(wrapper.find('.semantic-root').attributes('style')).toContain('outline: 1px solid red')
    expect(wrapper.find('.semantic-tag').exists()).toBe(true)
    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one', 'two', 'three'])
  })

  it('supports custom tag and clear slots', async () => {
    const wrapper = mount(InputTag, {
      props: { defaultValue: ['one'], allowClear: true },
      slots: {
        tag: ({ value, onClose }) => h('span', { class: 'custom-tag', onClick: onClose }, value),
        clearIcon: () => h('span', { class: 'custom-clear' }, 'clear'),
      },
    })

    expect(wrapper.find('.custom-tag').text()).toBe('one')
    expect(wrapper.find('.custom-clear').text()).toBe('clear')
    const suffix = wrapper.find('.ant-input-tag-suffix')
    expect(suffix.classes()).toContain('ant-input-suffix')
    expect(wrapper.find('.ant-input-tag-clear').element.parentElement).toBe(suffix.element)
    await wrapper.find('.custom-tag').trigger('click')
    expect(wrapper.findAll('.custom-tag')).toHaveLength(0)
  })

  it('forwards Form.Item field id and label association to the native input', () => {
    const wrapper = mount(Form, {
      props: {
        name: 'profile',
        model: { tags: ['vue'] },
      },
      slots: {
        default: () => h(FormItem, { name: 'tags', label: 'Tags' }, {
          default: () => h(InputTag, { value: ['vue'] }),
        }),
      },
    })

    expect(wrapper.find('input#profile_tags').exists()).toBe(true)
    expect(wrapper.find('.ant-form-item-label > label').attributes('for')).toBe('profile_tags')
  })

  it('keeps Form.Item value as committed tags instead of the input draft', async () => {
    const initialValue = ['vue']
    const model = reactive({ tags: [...initialValue] })
    const formRef = ref<any>()
    const FormDemo = defineComponent(() => () => h(Form, { ref: formRef, model }, {
      default: () => h(FormItem, {
        name: 'tags',
        rules: [{ required: true, type: 'array' as const, min: 1, message: 'Tags are required' }],
      }, {
        default: () => h(InputTag, {
          value: model.tags,
          'onUpdate:value': (value: string[]) => (model.tags = value),
        }),
      }),
    }))
    const wrapper = mount(FormDemo)
    const input = getInput(wrapper)

    await input.setValue('draft')
    expect(model.tags).toEqual(['vue'])
    expect(input.element.value).toBe('draft')
    expect(input.element.value).not.toBe(model.tags.join(','))
    await expect(formRef.value.validateFields()).resolves.toMatchObject({ tags: ['vue'] })

    await input.trigger('keydown', { key: 'Enter' })
    expect(model.tags).toEqual(['vue', 'draft'])
    expect(input.element.value).toBe('')
    await expect(formRef.value.validateFields()).resolves.toMatchObject({ tags: ['vue', 'draft'] })

    formRef.value.resetFields()
    await nextTick()
    expect(model.tags).toEqual(initialValue)
    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(initialValue)
  })

  it('does not treat the input draft as the Form.Item value when tags are empty', async () => {
    const model = reactive({ tags: [] as string[] })
    const formRef = ref<any>()
    const FormDemo = defineComponent(() => () => h(Form, { ref: formRef, model }, {
      default: () => h(FormItem, {
        name: 'tags',
        rules: [{ required: true, type: 'array' as const, min: 1, message: 'Tags are required' }],
      }, {
        default: () => h(InputTag, {
          value: model.tags,
          'onUpdate:value': (value: string[]) => (model.tags = value),
        }),
      }),
    }))
    const wrapper = mount(FormDemo)
    const input = getInput(wrapper)

    await input.setValue('draft')
    expect(model.tags).toEqual([])
    expect(input.element.value).toBe('draft')
    await expect(formRef.value.validateFields()).rejects.toBeDefined()
  })

  it('applies Form.Item validateStatus to the Input', () => {
    const wrapper = mount(Form, {
      props: { model: { tags: ['vue'] } },
      slots: {
        default: () => h(FormItem, { name: 'tags', validateStatus: 'warning' }, {
          default: () => h(InputTag, { value: ['vue'] }),
        }),
      },
    })

    expect(wrapper.find('.ant-input-status-warning').exists()).toBe(true)
  })

  it('exposes writable native input and root element refs', async () => {
    const wrapper = mount(InputTag, {
      props: { defaultValue: ['one'] },
      attachTo: document.body,
    })
    await nextTick()

    const exposed = (wrapper.vm as any).$.exposed
    const inputEl = getInput(wrapper).element as HTMLInputElement

    expect(isRef(exposed.input)).toBe(true)
    expect(isRef(exposed.nativeElement)).toBe(true)
    expect(exposed.input.value).toBe(inputEl)
    expect(exposed.nativeElement.value).toBeInstanceOf(HTMLElement)
    expect(exposed.nativeElement.value?.contains(inputEl)).toBe(true)
    expect((wrapper.vm as any).input).toBe(inputEl)
    expect((wrapper.vm as any).nativeElement).toBe(exposed.nativeElement.value)

    const originalInput = exposed.input.value
    exposed.input.value = originalInput
    expect(exposed.input.value).toBe(originalInput)

    ;(wrapper.vm as any).focus()
    expect(document.activeElement).toBe(inputEl)

    wrapper.unmount()
  })

  describe('maxTagCount / maxTagPlaceholder', () => {
    const values = ['one', 'two', 'three', 'four']

    it('shows every tag when maxTagCount is not set and ignores the removed collapse props', () => {
      const wrapper = mount(InputTag, {
        props: { defaultValue: values },
        attrs: { collapseTags: true, maxCollapseTags: 1 },
      })
      expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(values)
    })

    it('supports maxTagCount 0 and does not collapse when nothing overflows', () => {
      const zero = mount(InputTag, { props: { defaultValue: values, maxTagCount: 0 } })
      expect(zero.findAll('.ant-tag').map(tag => tag.text())).toEqual(['+ 4'])

      const enough = mount(InputTag, { props: { defaultValue: values, maxTagCount: 4 } })
      expect(enough.find('.ant-input-tag-collapse').exists()).toBe(false)
    })

    it('renders maxTagPlaceholder from a node, a function, and lets the slot win', () => {
      const node = mount(InputTag, { props: { defaultValue: values, maxTagCount: 2, maxTagPlaceholder: 'more' } })
      expect(node.find('.ant-input-tag-collapse').text()).toBe('more')

      const fn = mount(InputTag, {
        props: {
          defaultValue: values,
          maxTagCount: 1,
          maxTagPlaceholder: (omitted: string[]) => `+${omitted.length}: ${omitted.join('/')}`,
        },
      })
      expect(fn.find('.ant-input-tag-collapse').text()).toBe('+3: two/three/four')

      const slot = mount(InputTag, {
        props: { defaultValue: values, maxTagCount: 2, maxTagPlaceholder: 'from prop' },
        slots: {
          maxTagPlaceholder: ({ omittedValues }: { omittedValues: string[] }) => h('b', { class: 'slot-placeholder' }, `${omittedValues.length} hidden`),
        },
      })
      expect(slot.find('.ant-input-tag-collapse .slot-placeholder').text()).toBe('2 hidden')

      const emptySlot = mount(InputTag, {
        props: { defaultValue: values, maxTagCount: 2 },
        slots: { maxTagPlaceholder: () => [createCommentVNode('v-if', true)] },
      })
      expect(emptySlot.find('.ant-input-tag-collapse').text()).toBe('+ 2')
    })

    it('keeps the placeholder tag out of the tab order unless maxTagTooltip is enabled', () => {
      const plain = mount(InputTag, { props: { defaultValue: values, maxTagCount: 2 } })
      const plainTag = plain.find('.ant-input-tag-collapse')
      expect(plainTag.attributes('tabindex')).toBeUndefined()
      expect(plainTag.attributes('role')).toBeUndefined()

      const withTooltip = mount(InputTag, { props: { defaultValue: values, maxTagCount: 2, maxTagTooltip: true } })
      const tooltipTag = withTooltip.find('.ant-input-tag-collapse')
      expect(tooltipTag.attributes('tabindex')).toBe('0')
      expect(tooltipTag.attributes('role')).toBe('button')
    })
  })

  describe('prefix / suffix / clearIcon props', () => {
    it('renders prefix and suffix from props and lets slots win', () => {
      const fromProps = mount(InputTag, {
        props: {
          defaultValue: ['one'],
          prefix: h('span', { class: 'prop-prefix' }, 'P'),
          suffix: () => h('span', { class: 'prop-suffix' }, 'S'),
        },
      })
      expect(fromProps.find('.ant-input-tag-content .prop-prefix').text()).toBe('P')
      expect(fromProps.find('.ant-input-tag-suffix .prop-suffix').text()).toBe('S')

      const fromSlots = mount(InputTag, {
        props: {
          defaultValue: ['one'],
          prefix: h('span', { class: 'prop-prefix' }, 'P'),
          suffix: h('span', { class: 'prop-suffix' }, 'S'),
        },
        slots: {
          prefix: () => h('span', { class: 'slot-prefix' }, 'p'),
          suffix: () => h('span', { class: 'slot-suffix' }, 's'),
        },
      })
      expect(fromSlots.find('.slot-prefix').exists()).toBe(true)
      expect(fromSlots.find('.slot-suffix').exists()).toBe(true)
      expect(fromSlots.find('.prop-prefix').exists()).toBe(false)
      expect(fromSlots.find('.prop-suffix').exists()).toBe(false)
    })

    it('does not render a suffix wrapper when neither suffix nor clear button exists', () => {
      const wrapper = mount(InputTag, { props: { defaultValue: ['one'] } })
      expect(wrapper.find('.ant-input-tag-suffix').exists()).toBe(false)
    })

    it('uses the same default clear icon as Input', () => {
      const wrapper = mount(InputTag, { props: { defaultValue: ['one'], allowClear: true } })
      const clear = wrapper.find('.ant-input-tag-clear')
      expect(clear.find('.anticon-close-circle').exists()).toBe(true)
      expect(clear.text()).toBe('')
    })

    it('resolves the clear icon as slot > clearIcon > allowClear.clearIcon', () => {
      const fromAllowClear = mount(InputTag, {
        props: { defaultValue: ['one'], allowClear: { clearIcon: h('i', { class: 'allow-clear-icon' }) } },
      })
      expect(fromAllowClear.find('.ant-input-tag-clear .allow-clear-icon').exists()).toBe(true)

      const fromProp = mount(InputTag, {
        props: {
          defaultValue: ['one'],
          allowClear: { clearIcon: h('i', { class: 'allow-clear-icon' }) },
          clearIcon: h('i', { class: 'prop-clear-icon' }),
        },
      })
      expect(fromProp.find('.ant-input-tag-clear .prop-clear-icon').exists()).toBe(true)
      expect(fromProp.find('.allow-clear-icon').exists()).toBe(false)

      const fromSlot = mount(InputTag, {
        props: { defaultValue: ['one'], allowClear: true, clearIcon: h('i', { class: 'prop-clear-icon' }) },
        slots: { clearIcon: () => h('i', { class: 'slot-clear-icon' }) },
      })
      expect(fromSlot.find('.ant-input-tag-clear .slot-clear-icon').exists()).toBe(true)
      expect(fromSlot.find('.prop-clear-icon').exists()).toBe(false)
    })

    it('still clears when allowClear is an object', async () => {
      const wrapper = mount(InputTag, {
        props: { defaultValue: ['one', 'two'], allowClear: { clearIcon: h('i', { class: 'allow-clear-icon' }) } },
      })
      await wrapper.find('.ant-input-tag-clear').trigger('click')
      expect(wrapper.findAll('.ant-tag')).toHaveLength(0)
      expect(wrapper.emitted('clear')).toHaveLength(1)
    })
  })

  describe('keydown / keyup', () => {
    it('forwards keydown and keyup to user listeners without breaking the built-in handling', async () => {
      const onKeydown = vi.fn()
      const onKeyup = vi.fn()
      const wrapper = mount(InputTag, {
        props: { defaultValue: ['one'], trigger: 'space', onKeydown, onKeyup } as any,
      })
      const input = getInput(wrapper)

      await input.setValue('two')
      await input.trigger('keydown', { key: 'a' })
      await input.trigger('keyup', { key: ' ', code: 'Space' })

      expect(onKeydown).toHaveBeenCalledTimes(1)
      expect(onKeydown.mock.calls[0]![0]).toBeInstanceOf(KeyboardEvent)
      expect(onKeyup).toHaveBeenCalledTimes(1)
      // 内部的 space 提交逻辑仍然生效
      expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one', 'two'])
    })

    it('forwards keydown before removing the last tag on Backspace', async () => {
      const order: string[] = []
      const wrapper = mount(InputTag, {
        props: {
          defaultValue: ['one'],
          onKeydown: () => order.push('keydown'),
          onRemove: () => order.push('remove'),
        } as any,
      })

      await getInput(wrapper).trigger('keydown', { key: 'Backspace' })
      expect(order).toEqual(['keydown', 'remove'])
    })
  })

  it('applies the root semantic class and style exactly once', () => {
    const wrapper = mount(InputTag, {
      props: {
        defaultValue: ['one'],
        classes: { root: 'semantic-root' },
        styles: { root: { marginTop: '3px' } },
      },
    })

    const root = wrapper.find('.ant-input-tag')
    expect(root.classes().filter(name => name === 'semantic-root')).toHaveLength(1)
    expect(root.attributes('class')!.split(/\s+/).filter(name => name === 'semantic-root')).toHaveLength(1)
    expect(root.attributes('style')!.match(/margin-top/g)).toHaveLength(1)
  })

  it('follows the control height of each size', () => {
    mount(InputTag, { props: { defaultValue: ['one'], size: 'small' } })
    const css = Array.from(document.querySelectorAll('style'))
      .map(el => el.textContent ?? '')
      .join('\n')
      .replace(/\s+/g, '')

    expect(css).toContain('.ant-input-tag.ant-input-affix-wrapper-sm{min-height:var(--ant-control-height-sm)')
    expect(css).toContain('.ant-input-tag.ant-input-affix-wrapper-lg{min-height:var(--ant-control-height-lg)')
  })

  describe('keyboard reordering', () => {
    function mountDraggable(props: Record<string, any> = {}, rtl = false) {
      return mount({
        render() {
          return h(ConfigProvider, { direction: rtl ? 'rtl' : 'ltr' }, {
            default: () => h(InputTag, { defaultValue: ['one', 'two', 'three'], draggable: true, ...props }),
          })
        },
      }, { attachTo: document.body })
    }

    function tagTexts(wrapper: ReturnType<typeof mount>) {
      return wrapper.findAll('.ant-tag').map(tag => tag.text())
    }

    it('makes draggable tags focusable and moves them with Alt + arrow keys', async () => {
      const onChange = vi.fn()
      const onDragTag = vi.fn()
      const wrapper = mountDraggable({ onChange, onDragTag })

      const first = wrapper.findAll('.ant-tag')[0]!
      expect(first.attributes('tabindex')).toBe('0')
      expect(first.attributes('aria-keyshortcuts')).toBe('Alt+ArrowLeft Alt+ArrowRight')

      await first.trigger('keydown', { key: 'ArrowRight', altKey: true })
      await nextTick()

      expect(tagTexts(wrapper)).toEqual(['two', 'one', 'three'])
      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange.mock.calls[0]![0]).toEqual(['two', 'one', 'three'])
      expect(onChange.mock.calls[0]![1]).toMatchObject({ trigger: 'drag' })
      expect(onDragTag).toHaveBeenCalledWith(0, 1, 'one', expect.any(KeyboardEvent))
      // 焦点跟着被移动的标签走，可以连续按键
      expect(document.activeElement).toBe(wrapper.findAll('.ant-tag')[1]!.element)

      await wrapper.findAll('.ant-tag')[1]!.trigger('keydown', { key: 'ArrowLeft', altKey: true })
      await nextTick()
      expect(tagTexts(wrapper)).toEqual(['one', 'two', 'three'])

      wrapper.unmount()
    })

    it('ignores plain arrow keys and moves that would leave the list', async () => {
      const onChange = vi.fn()
      const wrapper = mountDraggable({ onChange })
      const tags = wrapper.findAll('.ant-tag')

      await tags[0]!.trigger('keydown', { key: 'ArrowRight' })
      await tags[0]!.trigger('keydown', { key: 'ArrowLeft', altKey: true })
      await tags[2]!.trigger('keydown', { key: 'ArrowRight', altKey: true })

      expect(onChange).not.toHaveBeenCalled()
      expect(tagTexts(wrapper)).toEqual(['one', 'two', 'three'])
      wrapper.unmount()
    })

    it('mirrors the arrow keys in RTL', async () => {
      const wrapper = mountDraggable({}, true)

      await wrapper.findAll('.ant-tag')[0]!.trigger('keydown', { key: 'ArrowLeft', altKey: true })
      await nextTick()

      expect(tagTexts(wrapper)).toEqual(['two', 'one', 'three'])
      wrapper.unmount()
    })

    it('does not make tags focusable when not draggable, disabled, or readonly', () => {
      for (const props of [{ draggable: false }, { disabled: true }, { readonly: true }]) {
        const wrapper = mountDraggable(props)
        expect(wrapper.findAll('.ant-tag')[0]!.attributes('tabindex')).toBeUndefined()
        wrapper.unmount()
      }
    })
  })

  it('reads size, variant, trigger, and saveOnBlur from ProConfigProvider and lets props win', async () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        inputTag: { size: 'small', variant: 'filled', trigger: 'space', saveOnBlur: true },
      },
      slots: {
        default: () => [
          h(InputTag, { class: 'from-config' }),
          h(InputTag, { class: 'from-props', size: 'large', variant: 'outlined', trigger: 'enter', saveOnBlur: false }),
        ],
      },
    })

    const fromConfig = wrapper.find('.from-config')
    expect(fromConfig.classes()).toContain('ant-input-affix-wrapper-sm')
    expect(fromConfig.classes()).toContain('ant-input-filled')

    const configInput = fromConfig.find('input')
    await configInput.setValue('one')
    await configInput.trigger('keyup', { key: ' ', code: 'Space' })
    expect(fromConfig.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one'])
    await configInput.setValue('two')
    await configInput.trigger('blur')
    expect(fromConfig.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one', 'two'])

    const fromProps = wrapper.find('.from-props')
    expect(fromProps.classes()).toContain('ant-input-affix-wrapper-lg')
    expect(fromProps.classes()).toContain('ant-input-outlined')

    const propsInput = fromProps.find('input')
    await propsInput.setValue('one')
    await propsInput.trigger('keyup', { key: ' ', code: 'Space' })
    await propsInput.trigger('blur')
    expect(fromProps.findAll('.ant-tag')).toHaveLength(0)
  })

  it('clears the draft even when every submitted value is rejected as a duplicate', async () => {
    const wrapper = mount(InputTag, { props: { defaultValue: ['one'] } })
    const input = getInput(wrapper)

    await input.setValue('one')
    await input.trigger('keydown', { key: 'Enter' })

    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one'])
    expect(input.element.value).toBe('')
  })

  it('derives the drag indicator from the lineWidthBold token', () => {
    mount(InputTag, { props: { defaultValue: ['one'], draggable: true } })
    const css = Array.from(document.querySelectorAll('style'))
      .map(el => el.textContent ?? '')
      .join('\n')
      .replace(/\s+/g, '')

    expect(css).toContain('.ant-input-tag-tag-drag-after{box-shadow:var(--ant-line-width-bold)000var(--ant-color-primary)')
    expect(css).toContain('.ant-input-tag-tag-drag-before{box-shadow:calc(var(--ant-line-width-bold)*-1)000var(--ant-color-primary)')
    expect(css).not.toContain('box-shadow:-2px000')
  })
})
