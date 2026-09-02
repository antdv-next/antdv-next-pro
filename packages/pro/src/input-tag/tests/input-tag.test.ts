import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { InputTag, ProConfigProvider } from '../../index'

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
    expect(wrapper.findAll('.ant-tag')).toHaveLength(0)
    expect(input.element.value).toBe('one,two|pending')

    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one', 'two', 'pending'])
    expect(input.element.value).toBe('')
    expect(onChange).toHaveBeenCalledWith(['one', 'two', 'pending'], expect.objectContaining({ trigger: 'enter' }))
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

    await tags[0]!.trigger('dragstart')
    await tags[2]!.trigger('dragover')
    await tags[2]!.trigger('drop')

    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['two', 'one', 'three'])
    expect(onDragTag).toHaveBeenCalledWith(0, 1, 'one', expect.any(Event))
  })

  it('collapses tags when configured', () => {
    const wrapper = mount(InputTag, {
      props: { defaultValue: ['one', 'two', 'three', 'four'], collapseTags: true, maxCollapseTags: 2 },
    })

    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one', 'two', '+ 2'])
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
