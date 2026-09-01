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

  it('splits token separators from input and paste', async () => {
    const onChange = vi.fn()
    const wrapper = mount(InputTag, {
      props: { tokenSeparators: [',', '|'], onChange },
    })
    const input = getInput(wrapper)

    await input.setValue('one,two|pending')
    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one', 'two'])
    expect(input.element.value).toBe('pending')
    expect(onChange).toHaveBeenCalledWith(['one', 'two'], expect.objectContaining({ trigger: 'token-separator' }))
  })

  it('filters duplicates and maxCount', async () => {
    const wrapper = mount(InputTag, {
      props: { tokenSeparators: [','], maxCount: 2, defaultValue: ['one'] },
    })
    const input = getInput(wrapper)

    await input.setValue('one,two,three')
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
      expect(wrapper.find('.ant-input-clear-icon').exists()).toBe(false)
    }
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
    await nextTick()

    expect(wrapper.find('.provider-input-tag').exists()).toBe(true)
    expect(wrapper.find('.semantic-root').attributes('style')).toContain('outline: 1px solid red')
    expect(wrapper.find('.semantic-tag').exists()).toBe(true)
    expect(wrapper.findAll('.ant-tag').map(tag => tag.text())).toEqual(['one', 'two'])
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
    await wrapper.find('.custom-tag').trigger('click')
    expect(wrapper.findAll('.custom-tag')).toHaveLength(0)
  })
})
