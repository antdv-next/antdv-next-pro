import { mount } from '@vue/test-utils'
import { Tooltip } from 'antdv-next'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { ProConfigProvider } from '../../index'
import Heatmap from '../index'
import { createCalendar, getColorLevel, normalizeData, resolveRange } from '../utils'

const jan1 = Date.UTC(2024, 0, 1)
const jan2 = Date.UTC(2024, 0, 2)
const jan3 = Date.UTC(2024, 0, 3)

describe('Heatmap utilities', () => {
  it('normalizes timestamps in UTC, retains null values, and keeps the last valid item', () => {
    const data = normalizeData([
      { timestamp: jan1 + 12 * 60 * 60 * 1000, value: 1 },
      { timestamp: jan1 + 18 * 60 * 60 * 1000, value: 3 },
      { timestamp: jan2, value: null },
      { timestamp: jan3, value: -1 },
      { timestamp: Number.NaN, value: 5 },
    ])

    expect(data.size).toBe(2)
    expect(data.get(jan1)?.value).toBe(3)
    expect(data.get(jan2)?.value).toBeNull()
  })

  it('resolves recent and reverse object ranges using UTC dates', () => {
    expect(resolveRange('recent', jan3 + 17 * 60 * 60 * 1000)).toEqual({
      start: jan3 - 364 * 24 * 60 * 60 * 1000,
      end: jan3,
    })
    expect(resolveRange({ start: jan3, end: jan1 })).toEqual({ start: jan1, end: jan3 })
  })

  it('keeps missing days empty and only fills calendar-leading days when enabled', () => {
    const data = normalizeData([
      { timestamp: jan1, value: 0 },
      { timestamp: jan2, value: 8 },
      { timestamp: Date.UTC(2023, 11, 31), value: 4 },
    ])
    const range = { start: jan1, end: jan3 }

    const withoutLeading = createCalendar(range, data, 0, false, 4)
    const withLeading = createCalendar(range, data, 0, true, 4)

    expect(withoutLeading[0]![0]).toMatchObject({ placeholder: true, value: null })
    expect(withoutLeading[3]![0]).toMatchObject({ placeholder: false, value: null, level: 0 })
    expect(withLeading[0]![0]).toMatchObject({ placeholder: false, value: 4 })
    expect(withLeading[1]![0]).toMatchObject({ placeholder: false, value: 0, level: 1 })
  })

  it('assigns equal-width color levels with a lowest valid-value range', () => {
    expect(getColorLevel(null, 0, 100, 4)).toBe(0)
    expect(getColorLevel(0, 0, 100, 4)).toBe(1)
    expect(getColorLevel(19.99, 0, 100, 4)).toBe(1)
    expect(getColorLevel(20, 0, 100, 4)).toBe(2)
    expect(getColorLevel(40, 0, 100, 4)).toBe(3)
    expect(getColorLevel(60, 0, 100, 4)).toBe(4)
    expect(getColorLevel(80, 0, 100, 4)).toBe(5)
    expect(getColorLevel(100, 0, 100, 4)).toBe(5)
    expect(getColorLevel(8, 8, 8, 4)).toBe(1)
  })
})

describe('Heatmap', () => {
  it('renders data cells, semantic styles, tooltip, and clickable data cells', async () => {
    const wrapper = mount(Heatmap, {
      props: {
        range: { start: jan1, end: jan3 },
        data: [
          { timestamp: jan1, value: 0 },
          { timestamp: jan2, value: 6 },
        ],
        tooltip: true,
        classes: { root: 'heatmap-root', cell: 'heatmap-cell' },
        styles: { root: { padding: '4px' } },
      },
    })

    const root = wrapper.find('.ant-heatmap')
    expect(root.classes()).toContain('heatmap-root')
    expect(root.attributes('style')).toContain('padding: 4px')
    expect(wrapper.findAll('.heatmap-cell')).toHaveLength(7)
    expect(wrapper.findComponent(Tooltip).exists()).toBe(true)

    const firstDataCell = wrapper.find('[data-level="1"]')
    expect(firstDataCell.element.tagName).toBe('BUTTON')
    expect(firstDataCell.attributes('type')).toBe('button')
    await firstDataCell.trigger('click')
    expect(wrapper.emitted('cell-click')?.[0]?.[0]).toMatchObject({ timestamp: jan1, value: 0 })
  })

  it('emits cell-click for explicit no-data items but not missing or placeholder cells', async () => {
    const wrapper = mount(Heatmap, {
      props: {
        range: { start: jan1, end: jan3 },
        data: [{ timestamp: jan2, value: null }],
        classes: { cell: 'heatmap-cell' },
      },
    })

    const cells = wrapper.findAll('.heatmap-cell')
    const explicitNoDataCell = cells[2]!
    expect(explicitNoDataCell.element.tagName).toBe('BUTTON')
    expect(explicitNoDataCell.attributes('type')).toBe('button')
    await explicitNoDataCell.trigger('click')

    const cellClicks = wrapper.emitted('cell-click')!
    expect(cellClicks).toHaveLength(1)
    expect(cellClicks[0]?.[0]).toMatchObject({ timestamp: jan2, value: null })

    await cells[3]!.trigger('click')
    await cells[0]!.trigger('click')
    expect(wrapper.emitted('cell-click')).toHaveLength(1)
  })

  it('labels the calendar and limits button semantics to supplied data items', () => {
    const wrapper = mount(Heatmap, {
      props: {
        range: { start: jan1, end: jan3 },
        data: [{ timestamp: jan1, value: 0 }],
        classes: { cell: 'heatmap-cell' },
      },
    })

    expect(wrapper.find('table').attributes('aria-label')).toBe('Heatmap')
    expect(wrapper.find('th.ant-heatmap-week-label[scope="row"]').exists()).toBe(true)
    expect(wrapper.findAll('td.ant-heatmap-week-label')).toHaveLength(4)
    expect(wrapper.find('.ant-heatmap-indicator-color').attributes('role')).toBe('img')
    expect(wrapper.find('.ant-heatmap-indicator-color').attributes('aria-label')).toBe('Level 1')

    const cells = wrapper.findAll('.heatmap-cell')
    expect(cells[1]!.element.tagName).toBe('BUTTON')
    expect(cells[1]!.attributes('type')).toBe('button')
    expect(cells[1]!.attributes('aria-label')).toContain('Level')

    expect(cells[3]!.element.tagName).toBe('DIV')
    expect(cells[3]!.attributes('aria-label')).toBeUndefined()
    expect(cells[3]!.element.parentElement?.getAttribute('aria-label')).toContain('No data')
  })

  it('uses Heatmap defaults from ProConfigProvider and merges semantic configuration', async () => {
    const wrapper = mount(ProConfigProvider, {
      props: {
        heatmap: {
          size: 'small',
          showColorIndicator: false,
          classes: { root: 'provider-root' },
        },
      },
      slots: {
        default: () => h(Heatmap, {
          range: { start: jan1, end: jan1 },
          classes: { root: 'props-root' },
        }),
      },
    })

    await nextTick()
    const root = wrapper.find('.ant-heatmap')
    expect(root.attributes('data-size')).toBe('small')
    expect(root.classes()).toContain('provider-root')
    expect(root.classes()).toContain('props-root')
    expect(wrapper.find('.ant-heatmap-indicator').exists()).toBe(false)
  })

  it('falls back to the default colors for an invalid runtime theme', () => {
    const wrapper = mount(Heatmap, {
      props: {
        range: { start: jan1, end: jan1 },
        colorTheme: 'invalid-theme' as any,
      },
    })

    expect(wrapper.findAll('.ant-heatmap-indicator-color')).toHaveLength(5)
  })

  it('renders custom footer and indicator slots', () => {
    const wrapper = mount(Heatmap, {
      props: {
        range: { start: jan1, end: jan2 },
        showColorIndicator: false,
      },
      slots: {
        footer: () => h('span', { class: 'heatmap-footer-slot' }, 'Total: 3'),
        indicator: () => h('span', { class: 'heatmap-indicator-slot' }, 'Custom scale'),
      },
    })

    expect(wrapper.find('.heatmap-footer-slot').text()).toBe('Total: 3')
    expect(wrapper.find('.heatmap-indicator-slot').text()).toBe('Custom scale')
  })
})
