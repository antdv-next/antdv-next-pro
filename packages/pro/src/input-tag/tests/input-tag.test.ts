import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { InputTag, ProConfigProvider } from '../../index'
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

  it('collapses tags when configured', () => {
    const wrapper = mount(InputTag, {
      props: { defaultValue: ['one', 'two', 'three', 'four'], collapseTags: true, maxCollapseTags: 2 },
    })

    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one', 'two', '+ 2'])
  })

  it('renders non-interactive tags inside the collapse tooltip', async () => {
    const wrapper = mount(InputTag, {
      props: {
        defaultValue: ['one', 'two', 'three', 'four'],
        collapseTags: true,
        collapseTagsTooltip: true,
        maxCollapseTags: 2,
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

  it('makes the collapse tag keyboard accessible and shows the tooltip on focus', async () => {
    const wrapper = mount(InputTag, {
      props: {
        defaultValue: ['one', 'two', 'three', 'four'],
        collapseTags: true,
        collapseTagsTooltip: true,
        maxCollapseTags: 2,
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
})
