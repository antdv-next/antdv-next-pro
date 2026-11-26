import type { CategorySearchOption, CategorySearchOptionGroup, CategorySearchRef } from '../types'
import { mount } from '@vue/test-utils'
import { ConfigProvider, Form, FormItem } from 'antdv-next'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { CategorySearch, ProConfigProvider } from '../../index'
import zhCN from '../../locale/zh_CN'

const options: (CategorySearchOption | CategorySearchOptionGroup)[] = [
  {
    label: 'Status',
    value: 'status',
    children: [
      { label: 'Open', value: 'open' },
      { label: 'Closed', value: 'closed' },
      { label: 'Archived', value: 'archived', disabled: true },
    ],
  },
  {
    label: 'Tags',
    value: 'tags',
    multiple: true,
    children: [
      { label: 'Bug', value: 'bug' },
      { label: 'Feature', value: 'feature' },
      { label: 'Docs', value: 'docs' },
    ],
  },
  {
    label: 'Metrics',
    options: [
      { label: 'Price', value: 'price', type: 'numberRange' },
      { label: 'Created', value: 'created', type: 'dateRange' },
    ],
  },
  { label: 'Name', value: 'name', type: 'input' },
  { label: 'Owner', value: 'owner', type: 'custom' },
  { label: 'Locked', value: 'locked', disabled: true },
]

const mounted: { unmount: () => void }[] = []

function mountSearch(props: Record<string, any> = {}, slots: Record<string, any> = {}) {
  const wrapper = mount(CategorySearch as any, {
    props: { options, ...props },
    slots,
    attachTo: document.body,
  })
  mounted.push(wrapper)
  return wrapper
}

async function flush() {
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 30))
  await nextTick()
}

function popup() {
  return document.body.querySelector('.ant-category-search-popup:not(.ant-popover-hidden)') as HTMLElement | null
}

function listItems() {
  return [...(popup()?.querySelectorAll('.ant-category-search-popup-item') ?? [])] as HTMLElement[]
}

function clickItem(text: string) {
  const item = listItems().find(node => node.textContent === text)
  if (!item)
    throw new Error(`item ${text} not found in ${listItems().map(node => node.textContent).join(',')}`)
  item.click()
}

function tagTexts(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('.ant-category-search-tag').map(tag => tag.text())
}

async function openList(wrapper: ReturnType<typeof mount>) {
  await wrapper.find('.ant-category-search').trigger('click')
  await flush()
}

afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

describe('CategorySearch', () => {
  it('renders the default value as dimension tags', () => {
    const wrapper = mountSearch({
      defaultValue: [
        { key: 'status', value: 'open' },
        { key: 'tags', value: ['bug', 'docs'] },
        { key: 'price', value: [10, 20] },
        { key: 'name', value: 'Ada' },
        { key: 'created', value: ['2026-01-01', '2026-01-31'] },
      ],
    })

    expect(tagTexts(wrapper)).toEqual([
      'Status: Open',
      'Tags: Bug, Docs',
      'Price: 10 ~ 20',
      'Name: Ada',
      'Created: 2026-01-01 ~ 2026-01-31',
    ])
  })

  it('formats half-open number ranges', () => {
    const wrapper = mountSearch({
      defaultValue: [{ key: 'price', value: [10, null] }],
    })
    expect(tagTexts(wrapper)).toEqual(['Price: ≥ 10'])

    const upper = mountSearch({ defaultValue: [{ key: 'price', value: [null, 5] }] })
    expect(tagTexts(upper)).toEqual(['Price: ≤ 5'])
  })

  it('opens the dimension list with groups and adds a single select condition', async () => {
    const onChange = vi.fn()
    const onUpdate = vi.fn()
    const onOpenChange = vi.fn()
    const wrapper = mountSearch({ onChange, 'onUpdate:value': onUpdate, onOpenChange })

    await openList(wrapper)
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    expect(popup()?.querySelector('[role="listbox"]')).toBeTruthy()
    expect(popup()?.querySelector('.ant-category-search-popup-group')?.textContent).toBe('Metrics')
    expect(listItems().map(item => item.textContent)).toEqual(['Status', 'Tags', 'Price', 'Created', 'Name', 'Owner', 'Locked'])
    expect(listItems()[6]!.getAttribute('aria-disabled')).toBe('true')

    clickItem('Status')
    await flush()
    expect(listItems().map(item => item.textContent)).toEqual(['Open', 'Closed', 'Archived'])

    clickItem('Archived')
    await flush()
    expect(onChange).not.toHaveBeenCalled()

    clickItem('Open')
    await flush()
    expect(onUpdate).toHaveBeenLastCalledWith([{ key: 'status', value: 'open' }])
    expect(onChange).toHaveBeenLastCalledWith(
      [{ key: 'status', value: 'open' }],
      expect.objectContaining({ type: 'add', item: { key: 'status', value: 'open' } }),
    )
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    expect(tagTexts(wrapper)).toEqual(['Status: Open'])
  })

  it('edits the existing tag when the same dimension is chosen again', async () => {
    const onChange = vi.fn()
    const wrapper = mountSearch({ defaultValue: [{ key: 'status', value: 'open' }], onChange })

    await wrapper.find('.ant-category-search-tag').trigger('click')
    await flush()
    expect(popup()?.querySelector('[aria-selected="true"]')?.textContent).toBe('Open')

    clickItem('Closed')
    await flush()
    expect(onChange).toHaveBeenLastCalledWith(
      [{ key: 'status', value: 'closed' }],
      expect.objectContaining({ type: 'update', prevItem: { key: 'status', value: 'open' } }),
    )
    expect(tagTexts(wrapper)).toEqual(['Status: Closed'])
  })

  it('selects multiple values with select all and confirms them', async () => {
    const onChange = vi.fn()
    const wrapper = mountSearch({ onChange })

    await openList(wrapper)
    clickItem('Tags')
    await flush()

    const panel = popup()!.querySelector('.ant-category-search-popup-panel')!
    expect(panel.getAttribute('role')).toBe('dialog')
    const selectAll = panel.querySelector('.ant-category-search-popup-select-all input') as HTMLInputElement
    selectAll.click()
    await flush()
    const boxes = [...panel.querySelectorAll('.ant-category-search-popup-checkbox-group input')] as HTMLInputElement[]
    expect(boxes.every(box => box.checked)).toBe(true)
    boxes[1]!.click()
    await flush()

    const confirm = [...panel.querySelectorAll('button')].find(button => button.textContent?.includes('OK'))!
    confirm.click()
    await flush()
    expect(onChange).toHaveBeenLastCalledWith([{ key: 'tags', value: ['bug', 'docs'] }], expect.objectContaining({ type: 'add' }))
    expect(tagTexts(wrapper)).toEqual(['Tags: Bug, Docs'])
  })

  it('swaps a reversed number range and removes the condition when emptied', async () => {
    const onChange = vi.fn()
    const wrapper = mountSearch({ onChange })
    const api = wrapper.vm as unknown as CategorySearchRef

    api.open('price')
    await flush()
    const inputs = [...popup()!.querySelectorAll('.ant-category-search-popup-range input')] as HTMLInputElement[]
    expect(inputs.map(input => input.getAttribute('aria-label'))).toEqual(['Min', 'Max'])
    inputs[0]!.value = '30'
    inputs[0]!.dispatchEvent(new Event('input', { bubbles: true }))
    inputs[1]!.value = '10'
    inputs[1]!.dispatchEvent(new Event('input', { bubbles: true }))
    await flush()
    ;[...popup()!.querySelectorAll('button')].find(button => button.textContent?.includes('OK'))!.click()
    await flush()
    expect(onChange).toHaveBeenLastCalledWith([{ key: 'price', value: [10, 30] }], expect.objectContaining({ type: 'add' }))

    api.open('price')
    await flush()
    const nextInputs = [...popup()!.querySelectorAll('.ant-category-search-popup-range input')] as HTMLInputElement[]
    nextInputs.forEach((input) => {
      input.value = ''
      input.dispatchEvent(new Event('input', { bubbles: true }))
    })
    await flush()
    ;[...popup()!.querySelectorAll('button')].find(button => button.textContent?.includes('OK'))!.click()
    await flush()
    expect(onChange).toHaveBeenLastCalledWith([], expect.objectContaining({ type: 'remove' }))
    expect(tagTexts(wrapper)).toEqual([])
  })

  it('commits the input type with Enter', async () => {
    const onChange = vi.fn()
    const wrapper = mountSearch({ onChange })

    ;(wrapper.vm as unknown as CategorySearchRef).open('name')
    await flush()
    const input = popup()!.querySelector('.ant-category-search-popup-panel input') as HTMLInputElement
    input.value = 'Grace'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await flush()
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }))
    await flush()
    expect(onChange).toHaveBeenLastCalledWith([{ key: 'name', value: 'Grace' }], expect.objectContaining({ type: 'add' }))
  })

  it('renders the custom panel slot', async () => {
    const onChange = vi.fn()
    const panel = vi.fn(({ value, setValue, confirm }: any) => h('div', { class: 'custom-panel' }, [
      h('span', { class: 'custom-value' }, String(value ?? 'empty')),
      h('button', { class: 'custom-set', onClick: () => setValue('Linus') }, 'set'),
      h('button', { class: 'custom-confirm', onClick: () => confirm() }, 'confirm'),
    ]))
    const wrapper = mountSearch({ onChange }, { panel })

    ;(wrapper.vm as unknown as CategorySearchRef).open('owner')
    await flush()
    expect(popup()!.querySelector('.custom-value')!.textContent).toBe('empty')
    ;(popup()!.querySelector('.custom-set') as HTMLElement).click()
    await flush()
    expect(popup()!.querySelector('.custom-value')!.textContent).toBe('Linus')
    ;(popup()!.querySelector('.custom-confirm') as HTMLElement).click()
    await flush()
    expect(onChange).toHaveBeenLastCalledWith([{ key: 'owner', value: 'Linus' }], expect.anything())
    expect(panel.mock.calls[0]![0].option.value).toBe('owner')
    expect(tagTexts(wrapper)).toEqual(['Owner: Linus'])
  })

  it('removes tags by the close icon and by Backspace, but keeps closable false tags', async () => {
    const onChange = vi.fn()
    const wrapper = mountSearch({
      options: [
        { label: 'Project', value: 'project', closable: false, children: [{ label: 'Pro', value: 'pro' }] },
        { label: 'Name', value: 'name', type: 'input' },
        { label: 'Owner', value: 'owner', type: 'input' },
      ],
      defaultValue: [
        { key: 'project', value: 'pro' },
        { key: 'name', value: 'a' },
        { key: 'owner', value: 'b' },
      ],
      onChange,
    })

    const tags = wrapper.findAll('.ant-category-search-tag')
    expect(tags[0]!.find('.ant-tag-close-icon').exists()).toBe(false)
    await tags[2]!.find('.ant-tag-close-icon').trigger('click')
    await flush()
    expect(onChange).toHaveBeenLastCalledWith(
      [{ key: 'project', value: 'pro' }, { key: 'name', value: 'a' }],
      expect.objectContaining({ type: 'remove', prevItem: { key: 'owner', value: 'b' } }),
    )

    const input = wrapper.find('input')
    await input.trigger('keydown', { key: 'Backspace' })
    await flush()
    expect(tagTexts(wrapper)).toEqual(['Project: Pro'])
    await input.trigger('keydown', { key: 'Backspace' })
    await flush()
    expect(tagTexts(wrapper)).toEqual(['Project: Pro'])
  })

  it('clears removable conditions and the keyword', async () => {
    const onChange = vi.fn()
    const onClear = vi.fn()
    const onSearchUpdate = vi.fn()
    const wrapper = mountSearch({
      options: [
        { label: 'Project', value: 'project', closable: false, children: [{ label: 'Pro', value: 'pro' }] },
        { label: 'Name', value: 'name', type: 'input' },
      ],
      defaultValue: [{ key: 'project', value: 'pro' }, { key: 'name', value: 'a' }],
      defaultSearchValue: 'keyword',
      allowClear: true,
      onChange,
      onClear,
      'onUpdate:searchValue': onSearchUpdate,
    })

    const clear = wrapper.find('.ant-category-search-clear')
    expect(clear.attributes('aria-label')).toBe('Clear')
    await clear.trigger('click')
    await flush()
    expect(onChange).toHaveBeenLastCalledWith([{ key: 'project', value: 'pro' }], { type: 'clear' })
    expect(onSearchUpdate).toHaveBeenLastCalledWith('')
    expect(onClear).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.ant-category-search-clear').exists()).toBe(false)
  })

  it('supports a custom clear icon from allowClear and from the slot', () => {
    const fromProp = mountSearch({ allowClear: { clearIcon: h('i', { class: 'prop-icon' }) }, defaultSearchValue: 'x' })
    expect(fromProp.find('.ant-category-search-clear .prop-icon').exists()).toBe(true)

    const fromSlot = mountSearch(
      { allowClear: { clearIcon: h('i', { class: 'prop-icon' }) }, defaultSearchValue: 'x' },
      { clearIcon: () => h('i', { class: 'slot-icon' }) },
    )
    expect(fromSlot.find('.ant-category-search-clear .slot-icon').exists()).toBe(true)
    expect(fromSlot.find('.ant-category-search-clear .prop-icon').exists()).toBe(false)
  })

  it('cancels the change when beforeChange returns false or rejects', async () => {
    const onChange = vi.fn()
    const beforeChange = vi.fn()
      .mockReturnValueOnce(false)
      .mockRejectedValueOnce(new Error('nope'))
      .mockResolvedValueOnce(true)
    const wrapper = mountSearch({ beforeChange, onChange })
    const api = wrapper.vm as unknown as CategorySearchRef

    for (let i = 0; i < 2; i++) {
      api.open('status')
      await flush()
      clickItem('Open')
      await flush()
    }
    expect(onChange).not.toHaveBeenCalled()
    expect(tagTexts(wrapper)).toEqual([])

    api.open('status')
    await flush()
    clickItem('Open')
    await flush()
    expect(beforeChange).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'add', item: { key: 'status', value: 'open' } }))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(tagTexts(wrapper)).toEqual(['Status: Open'])
  })

  it('updates the keyword and emits search on Enter', async () => {
    const onSearch = vi.fn()
    const onSearchUpdate = vi.fn()
    const wrapper = mountSearch({
      defaultValue: [{ key: 'status', value: 'open' }],
      onSearch,
      'onUpdate:searchValue': onSearchUpdate,
    })
    const input = wrapper.find('input')

    await input.setValue('vue')
    expect(onSearchUpdate).toHaveBeenLastCalledWith('vue')
    await input.trigger('keydown', { key: 'Enter' })
    expect(onSearch).toHaveBeenLastCalledWith('vue', [{ key: 'status', value: 'open' }])
  })

  it('makes the keyword input read-only when showSearch is false', async () => {
    const onSearchUpdate = vi.fn()
    const wrapper = mountSearch({ showSearch: false, 'onUpdate:searchValue': onSearchUpdate })
    const input = wrapper.find('input')

    expect(input.attributes('readonly')).toBeDefined()
    expect(wrapper.find('.ant-category-search').classes()).toContain('ant-category-search-readonly-input')
    await input.setValue('ignored')
    expect(onSearchUpdate).not.toHaveBeenCalled()
  })

  it('supports keyboard navigation', async () => {
    const onChange = vi.fn()
    const wrapper = mountSearch({ onChange })
    const input = wrapper.find('input')

    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-expanded')).toBe('false')

    await input.trigger('keydown', { key: 'ArrowDown' })
    await flush()
    expect(input.attributes('aria-expanded')).toBe('true')
    expect(input.attributes('aria-controls')).toBeTruthy()

    await input.trigger('keydown', { key: 'ArrowDown' })
    await flush()
    const activeId = input.attributes('aria-activedescendant')!
    expect(document.getElementById(activeId)?.textContent).toBe('Status')

    // 末尾回到开头；禁用项被跳过
    await input.trigger('keydown', { key: 'ArrowUp' })
    await flush()
    expect(document.getElementById(input.attributes('aria-activedescendant')!)?.textContent).toBe('Owner')
    await input.trigger('keydown', { key: 'ArrowDown' })
    await flush()

    await input.trigger('keydown', { key: 'Enter' })
    await flush()
    expect(listItems().map(item => item.textContent)).toEqual(['Open', 'Closed', 'Archived'])

    await input.trigger('keydown', { key: 'Escape' })
    await flush()
    expect(listItems()[0]!.textContent).toBe('Status')
    await input.trigger('keydown', { key: 'Enter' })
    await flush()

    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'ArrowDown' })
    await flush()
    expect(document.getElementById(input.attributes('aria-activedescendant')!)?.textContent).toBe('Closed')
    await input.trigger('keydown', { key: 'Enter' })
    await flush()
    expect(onChange).toHaveBeenLastCalledWith([{ key: 'status', value: 'closed' }], expect.anything())

    await input.trigger('keydown', { key: 'ArrowDown' })
    await flush()
    expect(input.attributes('aria-expanded')).toBe('true')
    await input.trigger('keydown', { key: 'Escape' })
    await flush()
    expect(input.attributes('aria-expanded')).toBe('false')
  })

  it('maps custom field names', () => {
    const wrapper = mountSearch({
      options: [
        { name: 'Status', id: 'status', items: [{ name: 'Open', id: 'open' }] },
        { name: 'Group', list: [{ name: 'Name', id: 'name', type: 'input' }] },
      ],
      fieldNames: { label: 'name', value: 'id', children: 'items', options: 'list' },
      defaultValue: [{ key: 'status', value: 'open' }, { key: 'name', value: 'Ada' }],
    })

    expect(tagTexts(wrapper)).toEqual(['Status: Open', 'Name: Ada'])
  })

  it('keeps the controlled value until the parent updates it', async () => {
    const onUpdate = vi.fn()
    const wrapper = mountSearch({ value: [], 'onUpdate:value': onUpdate })

    ;(wrapper.vm as unknown as CategorySearchRef).open('status')
    await flush()
    clickItem('Open')
    await flush()
    expect(onUpdate).toHaveBeenCalledWith([{ key: 'status', value: 'open' }])
    expect(tagTexts(wrapper)).toEqual([])

    await wrapper.setProps({ value: [{ key: 'status', value: 'closed' }] })
    expect(tagTexts(wrapper)).toEqual(['Status: Closed'])
  })

  it('works with v-model in a parent component', async () => {
    const Demo = defineComponent(() => {
      const value = ref([{ key: 'status', value: 'open' }])
      return () => h('div', [
        h(CategorySearch, { options, 'value': value.value, 'onUpdate:value': (next: any) => { value.value = next } }),
        h('span', { class: 'count' }, String(value.value.length)),
      ])
    })
    const wrapper = mount(Demo, { attachTo: document.body })
    mounted.push(wrapper)

    await wrapper.find('.ant-tag-close-icon').trigger('click')
    await flush()
    expect(wrapper.find('.count').text()).toBe('0')
  })

  it('does not open or change anything when disabled', async () => {
    const onChange = vi.fn()
    const onOpenChange = vi.fn()
    const wrapper = mountSearch({
      disabled: true,
      allowClear: true,
      defaultValue: [{ key: 'status', value: 'open' }],
      onChange,
      onOpenChange,
    })

    expect(wrapper.find('.ant-category-search').classes()).toContain('ant-category-search-disabled')
    expect(wrapper.find('.ant-tag-close-icon').exists()).toBe(false)
    expect(wrapper.find('.ant-category-search-clear').exists()).toBe(false)
    await openList(wrapper)
    await wrapper.find('input').trigger('keydown', { key: 'Backspace' })
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(onChange).not.toHaveBeenCalled()
    expect(popup()).toBeNull()
  })

  it('reads disabled from ConfigProvider', () => {
    const wrapper = mount(ConfigProvider, {
      props: { componentDisabled: true },
      slots: { default: () => h(CategorySearch, { options }) },
    })
    mounted.push(wrapper)
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('collapses tags with maxTagCount and maxTagPlaceholder', () => {
    const value = [
      { key: 'status', value: 'open' },
      { key: 'name', value: 'Ada' },
      { key: 'owner', value: 'Linus' },
    ]
    const wrapper = mountSearch({ defaultValue: value, maxTagCount: 1 })
    expect(tagTexts(wrapper)).toEqual(['Status: Open', '+ 2 ...'])

    const fromProp = mountSearch({ defaultValue: value, maxTagCount: 1, maxTagPlaceholder: (omitted: any[]) => `${omitted.length} more` })
    expect(tagTexts(fromProp)).toEqual(['Status: Open', '2 more'])

    const fromSlot = mountSearch(
      { defaultValue: value, maxTagCount: 2, maxTagPlaceholder: 'prop' },
      { maxTagPlaceholder: ({ omittedValues }: any) => `slot ${omittedValues[0].key}` },
    )
    expect(tagTexts(fromSlot)).toEqual(['Status: Open', 'Name: Ada', 'slot owner'])
  })

  it('truncates long tag values with maxTagTextLength', () => {
    const wrapper = mountSearch({ defaultValue: [{ key: 'name', value: 'abcdefghij' }], maxTagTextLength: 4 })
    expect(tagTexts(wrapper)).toEqual(['Name: abcd...'])
  })

  it('prefers the labelRender slot over the prop and supports the tag slot', () => {
    const labelRender = ({ item }: any) => `prop-${item.value}`
    const fromProp = mountSearch({ defaultValue: [{ key: 'name', value: 'Ada' }], labelRender })
    expect(tagTexts(fromProp)).toEqual(['Name: prop-Ada'])

    const fromSlot = mountSearch(
      { defaultValue: [{ key: 'name', value: 'Ada' }], labelRender },
      { labelRender: ({ item }: any) => `slot-${item.value}` },
    )
    expect(tagTexts(fromSlot)).toEqual(['Name: slot-Ada'])

    const customTag = mountSearch(
      { defaultValue: [{ key: 'name', value: 'Ada' }] },
      { tag: ({ option, closable }: any) => h('b', { class: 'custom-tag' }, `${option.label}:${closable}`) },
    )
    expect(customTag.find('.custom-tag').text()).toBe('Name:true')
    expect(customTag.find('.ant-tag').exists()).toBe(false)
  })

  it('renders prefix, suffix and optionRender slots', async () => {
    const wrapper = mountSearch({}, {
      prefix: () => h('i', { class: 'my-prefix' }),
      suffix: () => h('i', { class: 'my-suffix' }),
      optionRender: ({ option }: any) => `#${option.label}`,
    })
    expect(wrapper.find('.ant-category-search-prefix .my-prefix').exists()).toBe(true)
    expect(wrapper.find('.ant-category-search-suffix .my-suffix').exists()).toBe(true)

    await openList(wrapper)
    expect(listItems()[0]!.textContent).toBe('#Status')
  })

  it('renders notFoundContent when there are no options', async () => {
    const wrapper = mountSearch({ options: [] }, { notFoundContent: () => h('span', { class: 'nothing' }, 'Nothing') })
    await openList(wrapper)
    expect(popup()?.querySelector('.nothing')?.textContent).toBe('Nothing')
  })

  it('applies semantic classes and styles, including popup nodes', async () => {
    const wrapper = mountSearch({
      defaultValue: [{ key: 'name', value: 'Ada' }],
      allowClear: true,
      rootClass: 'my-root-class',
      class: 'attr-class',
      style: { color: 'red' },
      classes: {
        root: 'c-root',
        content: 'c-content',
        tag: 'c-tag',
        input: 'c-input',
        suffix: 'c-suffix',
        clear: 'c-clear',
        popup: { root: 'c-popup', list: 'c-list' },
      },
      styles: ({ props }: any) => ({
        root: { margin: '1px' },
        tag: { padding: props.disabled ? '0px' : '2px' },
        popup: { list: { padding: '3px' } },
      }),
    })

    const root = wrapper.find('.ant-category-search')
    expect(root.classes()).toEqual(expect.arrayContaining(['c-root', 'my-root-class', 'attr-class']))
    expect(root.classes()[root.classes().length - 1]).toBe('attr-class')
    expect(root.attributes('style')).toContain('margin: 1px')
    expect(root.attributes('style')).toContain('color: red')
    expect(wrapper.find('.ant-category-search-content').classes()).toContain('c-content')
    expect(wrapper.find('.ant-category-search-tag').classes()).toContain('c-tag')
    expect(wrapper.find('.ant-category-search-tag').attributes('style')).toContain('padding: 2px')
    expect(wrapper.find('input').classes()).toContain('c-input')
    expect(wrapper.find('.c-suffix').exists()).toBe(true)
    expect(wrapper.find('.ant-category-search-clear').classes()).toContain('c-clear')

    await openList(wrapper)
    expect(popup()?.classList.contains('c-popup')).toBe(true)
    const list = popup()!.querySelector('.ant-category-search-popup-list') as HTMLElement
    expect(list.classList.contains('c-list')).toBe(true)
    expect(list.style.padding).toBe('3px')
  })

  it('reads defaults from ProConfigProvider with props taking priority', () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        categorySearch: {
          allowClear: true,
          showSearch: false,
          maxTagCount: 1,
          variant: 'filled',
          class: 'config-class',
          classes: { root: 'config-root', tag: 'config-tag' },
        },
      },
      slots: {
        default: () => [
          h(CategorySearch, { class: 'a', options, defaultValue: [{ key: 'name', value: 'Ada' }, { key: 'owner', value: 'L' }] }),
          h(CategorySearch, { class: 'b', options, showSearch: true, allowClear: false, maxTagCount: 5, classes: { tag: 'own-tag' }, defaultValue: [{ key: 'name', value: 'Ada' }] }),
        ],
      },
    })
    mounted.push(wrapper)

    const first = wrapper.find('.a')
    expect(first.classes()).toEqual(expect.arrayContaining(['config-class', 'config-root']))
    expect(first.find('input').attributes('readonly')).toBeDefined()
    expect(first.find('.ant-category-search-clear').exists()).toBe(true)
    expect(first.find('.ant-input-filled').exists() || first.find('.ant-input-affix-wrapper-filled').exists()).toBe(true)
    expect(first.findAll('.ant-category-search-tag').map(tag => tag.text())).toEqual(['Name: Ada', '+ 1 ...'])
    expect(first.find('.ant-category-search-tag').classes()).toContain('config-tag')

    const second = wrapper.find('.b')
    expect(second.find('input').attributes('readonly')).toBeUndefined()
    expect(second.find('.ant-category-search-clear').exists()).toBe(false)
    expect(second.find('.ant-category-search-tag').classes()).toEqual(expect.arrayContaining(['config-tag', 'own-tag']))
  })

  it('supports RTL', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { direction: 'rtl' },
      slots: { default: () => h(CategorySearch, { options }) },
      attachTo: document.body,
    })
    mounted.push(wrapper)

    expect(wrapper.find('.ant-category-search').classes()).toContain('ant-category-search-rtl')
    await wrapper.find('.ant-category-search').trigger('click')
    await flush()
    expect(popup()?.classList.contains('ant-category-search-popup-rtl')).toBe(true)
  })

  it('uses locale texts', async () => {
    const wrapper = mount(ProConfigProvider, {
      props: { locale: zhCN },
      slots: { default: () => h(CategorySearch, { options, allowClear: true, defaultSearchValue: '' }) },
      attachTo: document.body,
    })
    mounted.push(wrapper)

    expect(wrapper.find('input').attributes('placeholder')).toBe('选择分类或输入关键字搜索')
    await wrapper.find('input').setValue('x')
    expect(wrapper.find('.ant-category-search-clear').attributes('aria-label')).toBe('清空')
  })

  it('hides the placeholder once there is a tag or keyword, and prefers the placeholder prop', () => {
    expect(mountSearch({ placeholder: 'Filter' }).find('input').attributes('placeholder')).toBe('Filter')
    expect(mountSearch({ defaultValue: [{ key: 'name', value: 'a' }] }).find('input').attributes('placeholder')).toBeUndefined()
    expect(mountSearch({ defaultSearchValue: 'a' }).find('input').attributes('placeholder')).toBeUndefined()
  })

  it('follows the Form.Item status without leaking it into the popup', async () => {
    const wrapper = mount(Form, {
      slots: {
        default: () => h(FormItem, { validateStatus: 'error' }, {
          default: () => h(CategorySearch, { options, defaultOpen: true }),
        }),
      },
      attachTo: document.body,
    })
    mounted.push(wrapper)
    await flush()

    expect(wrapper.find('.ant-category-search-selector.ant-input-status-error').exists()).toBe(true)
    clickItem('Name')
    await flush()
    const panel = popup()!.querySelector('.ant-category-search-popup-panel')!
    expect(panel.querySelector('input')).toBeTruthy()
    expect(panel.querySelector('[class*=status-error]')).toBeNull()
  })

  it('applies the status prop', () => {
    const wrapper = mountSearch({ status: 'warning' })
    expect(wrapper.find('.ant-category-search-selector.ant-input-status-warning').exists()).toBe(true)
  })

  it('exposes focus, blur, open and nativeElement', async () => {
    const onFocus = vi.fn()
    const wrapper = mountSearch({ onFocus })
    const api = wrapper.vm as unknown as CategorySearchRef

    expect(api.nativeElement).toBe(wrapper.find('.ant-category-search').element)
    api.focus()
    expect(document.activeElement).toBe(wrapper.find('input').element)
    expect(onFocus).toHaveBeenCalled()
    api.blur()
    expect(document.activeElement).not.toBe(wrapper.find('input').element)

    api.open()
    await flush()
    expect(listItems()[0]!.textContent).toBe('Status')
    api.open('tags')
    await flush()
    expect(popup()!.querySelector('.ant-category-search-popup-panel-title')!.textContent).toBe('Tags')
  })

  it('supports controlled open', async () => {
    const onUpdateOpen = vi.fn()
    const wrapper = mountSearch({ 'open': false, 'onUpdate:open': onUpdateOpen })

    await openList(wrapper)
    expect(onUpdateOpen).toHaveBeenLastCalledWith(true)
    expect(popup()).toBeNull()

    await wrapper.setProps({ open: true })
    await flush()
    expect(popup()).toBeTruthy()
  })

  it('sets a fixed popup width when popupMatchSelectWidth is a number', async () => {
    const wrapper = mountSearch({ popupMatchSelectWidth: 320 })
    await openList(wrapper)
    expect(popup()!.style.width).toBe('320px')
  })
})
