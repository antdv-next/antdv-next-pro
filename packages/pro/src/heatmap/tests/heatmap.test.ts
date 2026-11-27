import { mount } from '@vue/test-utils'
import { ConfigProvider, Tooltip } from 'antdv-next'
import { describe, expect, it, vi } from 'vitest'
import { createCommentVNode, h, nextTick } from 'vue'
import { ProConfigProvider } from '../../index'
import zhCN from '../../locale/zh_CN'
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

  it('accepts valid calendar years and warns once before falling back for invalid years', () => {
    const now = jan3
    const recent = { start: now - 364 * 24 * 60 * 60 * 1000, end: now }
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    expect(resolveRange(1970, now)).toEqual({ start: Date.UTC(1970, 0, 1), end: Date.UTC(1970, 11, 31) })
    expect(resolveRange(2100, now)).toEqual({ start: Date.UTC(2100, 0, 1), end: Date.UTC(2100, 11, 31) })
    expect(resolveRange(1969, now)).toEqual(recent)
    expect(resolveRange(1969, now)).toEqual(recent)
    expect(resolveRange(2101, now)).toEqual(recent)
    expect(resolveRange(2024.5, now)).toEqual(recent)
    expect(resolveRange(Number.NaN, now)).toEqual(recent)
    expect(warn).toHaveBeenCalledTimes(4)

    warn.mockRestore()
  })

  it('keeps missing days empty and only fills calendar-leading days when enabled', () => {
    const data = normalizeData([
      { timestamp: jan1, value: 0 },
      { timestamp: jan2, value: 8 },
      { timestamp: Date.UTC(2023, 11, 31), value: 100 },
    ])
    const range = { start: jan1, end: jan3 }

    const withoutLeading = createCalendar(range, data, 0, false)
    const withLeading = createCalendar(range, data, 0, true)

    expect(withoutLeading[0]![0]).toMatchObject({ placeholder: true, value: null })
    expect(withoutLeading[3]![0]).toMatchObject({ placeholder: false, value: null, level: 0 })
    expect(withLeading[0]![0]).toMatchObject({ placeholder: false, value: 100, level: 5 })
    expect(withLeading[1]![0]).toMatchObject({ placeholder: false, value: 0, level: 1 })
    expect(withLeading[2]![0]).toMatchObject({ placeholder: false, value: 8, level: 5 })
  })

  it('assigns equal-width color levels with a lowest valid-value range', () => {
    expect(getColorLevel(null, 0, 100)).toBe(0)
    expect(getColorLevel(0, 0, 100)).toBe(1)
    expect(getColorLevel(19.99, 0, 100)).toBe(1)
    expect(getColorLevel(20, 0, 100)).toBe(2)
    expect(getColorLevel(40, 0, 100)).toBe(3)
    expect(getColorLevel(60, 0, 100)).toBe(4)
    expect(getColorLevel(80, 0, 100)).toBe(5)
    expect(getColorLevel(100, 0, 100)).toBe(5)
    expect(getColorLevel(8, 8, 8)).toBe(1)
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
    expect(wrapper.emitted('cellClick')?.[0]?.[0]).toMatchObject({ timestamp: jan1, value: 0 })
    expect(wrapper.emitted('cellClick')?.[0]?.[1]).toBeInstanceOf(MouseEvent)
  })

  it('emits cellClick for explicit no-data items but not missing or placeholder cells', async () => {
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

    const cellClicks = wrapper.emitted('cellClick')!
    expect(cellClicks).toHaveLength(1)
    expect(cellClicks[0]?.[0]).toMatchObject({ timestamp: jan2, value: null })

    await cells[3]!.trigger('click')
    await cells[0]!.trigger('click')
    expect(wrapper.emitted('cellClick')).toHaveLength(1)
  })

  it('keeps calendar-leading data interactive without affecting range color levels', async () => {
    const leadingDay = Date.UTC(2023, 11, 31)
    const wrapper = mount(Heatmap, {
      props: {
        range: { start: jan1, end: jan3 },
        fillCalendarLeading: true,
        data: [
          { timestamp: leadingDay, value: 100 },
          { timestamp: jan1, value: 0 },
          { timestamp: jan2, value: 8 },
        ],
        classes: { cell: 'heatmap-cell' },
      },
    })

    const cells = wrapper.findAll('.heatmap-cell')
    expect(cells[0]!.element.tagName).toBe('BUTTON')
    expect(cells[0]!.attributes('data-level')).toBe('5')
    expect(cells[2]!.attributes('data-level')).toBe('5')

    await cells[0]!.trigger('click')
    expect(wrapper.emitted('cellClick')?.[0]?.[0]).toMatchObject({ timestamp: leadingDay, value: 100 })
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

  it('uses Heatmap locale text and DatePicker date labels from ProConfigProvider', () => {
    const locale = {
      ...zhCN,
      DatePicker: {
        ...zhCN.DatePicker!,
        lang: {
          ...zhCN.DatePicker!.lang,
          shortWeekDays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
          shortMonths: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        },
      },
      Heatmap: {
        label: '贡献热力图',
        less: '低',
        more: '高',
        noData: '暂无贡献',
        level: '贡献等级',
      },
    }
    const wrapper = mount(ProConfigProvider, {
      props: {
        locale,
      },
      slots: {
        default: () => h(Heatmap, {
          range: { start: jan1, end: jan3 },
          data: [{ timestamp: jan1, value: null }],
        }),
      },
    })

    expect(wrapper.find('table').attributes('aria-label')).toBe('贡献热力图')
    expect(wrapper.find('.ant-heatmap-indicator').text()).toContain('低')
    expect(wrapper.find('.ant-heatmap-indicator').text()).toContain('高')
    expect(wrapper.find('.ant-heatmap-indicator-color').attributes('aria-label')).toBe('贡献等级 1')
    expect(wrapper.find('th.ant-heatmap-week-label[scope="row"]').text()).toBe('周一')
    expect(wrapper.find('.ant-heatmap-month-label').attributes('aria-label')).toBe('一月')
    expect(wrapper.findAll('.ant-heatmap-cell-container')[2]!.attributes('aria-label')).toContain('暂无贡献')
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

  it('does not inline a hardcoded empty color when only active colors are customized', () => {
    const wrapper = mount(Heatmap, {
      props: {
        range: { start: jan1, end: jan2 },
        data: [
          { timestamp: jan1, value: 0 },
          { timestamp: jan2, value: 8 },
        ],
        activeColors: ['#111111', '#222222', '#333333', '#444444'],
      },
    })

    const indicatorColors = wrapper.findAll('.ant-heatmap-indicator-color')
    expect(indicatorColors).toHaveLength(5)
    expect((indicatorColors[0]!.element as HTMLElement).style.backgroundColor).toBe('')
    expect((indicatorColors[1]!.element as HTMLElement).style.backgroundColor).toBe('rgb(17, 17, 17)')
    expect((indicatorColors[4]!.element as HTMLElement).style.backgroundColor).toBe('rgb(68, 68, 68)')

    expect((wrapper.find('[data-level="1"]').element as HTMLElement).style.backgroundColor).toBe('')
    expect((wrapper.find('[data-level="5"]').element as HTMLElement).style.backgroundColor).toBe('rgb(68, 68, 68)')
  })

  it('applies a custom minimum color without overriding the default active scale', () => {
    const wrapper = mount(Heatmap, {
      props: {
        range: { start: jan1, end: jan2 },
        data: [
          { timestamp: jan1, value: 0 },
          { timestamp: jan2, value: 8 },
        ],
        minimumColor: '#abcdef',
      },
    })

    const indicatorColors = wrapper.findAll('.ant-heatmap-indicator-color')
    expect((indicatorColors[0]!.element as HTMLElement).style.backgroundColor).toBe('rgb(171, 205, 239)')
    expect((indicatorColors[1]!.element as HTMLElement).style.backgroundColor).toBe('')

    expect((wrapper.find('[data-level="1"]').element as HTMLElement).style.backgroundColor).toBe('rgb(171, 205, 239)')
    expect((wrapper.find('[data-level="5"]').element as HTMLElement).style.backgroundColor).toBe('')
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

  it('falls back to a fixed color scale for invalid active colors', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const wrapper = mount(Heatmap, {
      props: {
        range: { start: jan1, end: jan1 },
        activeColors: ['#111111', '#222222'] as any,
      },
    })

    expect(wrapper.findAll('.ant-heatmap-indicator-color')).toHaveLength(5)
    expect(warn).toHaveBeenCalledTimes(1)
    warn.mockRestore()
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

  it('renders camelCase indicator text slots and keeps the kebab-case names working', () => {
    const camel = mount(Heatmap, {
      props: { range: { start: jan1, end: jan2 } },
      slots: {
        indicatorLeadingText: () => 'Low',
        indicatorTrailingText: () => 'High',
      },
    })
    expect(camel.find('.ant-heatmap-indicator').text()).toBe('LowHigh')

    const kebab = mount(Heatmap, {
      props: { range: { start: jan1, end: jan2 } },
      slots: {
        'indicator-leading-text': () => 'Low',
        'indicator-trailing-text': () => 'High',
      } as any,
    })
    expect(kebab.find('.ant-heatmap-indicator').text()).toBe('LowHigh')
  })

  it('falls back to the defaults when slots only yield empty nodes', () => {
    const empty = () => [createCommentVNode('v-if', true)]
    const wrapper = mount(Heatmap, {
      props: {
        range: { start: jan1, end: jan2 },
        data: [{ timestamp: jan1, value: 3 }],
        tooltip: true,
      },
      slots: {
        footer: empty,
        indicator: empty,
        indicatorLeadingText: empty,
        indicatorTrailingText: empty,
        tooltip: empty,
      },
    })

    // 空的 indicator 插槽回退到默认指示器，文字回退到语言包
    expect(wrapper.find('.ant-heatmap-indicator').text()).toBe('LessMore')
    // 空的 footer 插槽不再留下占位 div
    expect(wrapper.find('.ant-heatmap-footer').element.children).toHaveLength(1)
    // 空的 tooltip 插槽回退到默认文案
    expect(String(wrapper.findComponent(Tooltip).props('title'))).toContain('Level')
  })

  it('does not render the footer placeholder when there is no footer slot', () => {
    const wrapper = mount(Heatmap, { props: { range: { start: jan1, end: jan2 } } })

    const footer = wrapper.find('.ant-heatmap-footer')
    expect(footer.element.children).toHaveLength(1)
    expect(footer.element.firstElementChild?.classList.contains('ant-heatmap-indicator')).toBe(true)

    const hidden = mount(Heatmap, { props: { range: { start: jan1, end: jan2 }, showColorIndicator: false } })
    expect(hidden.find('.ant-heatmap-footer').exists()).toBe(false)
  })

  it('merges a partial Heatmap locale with the English defaults field by field', () => {
    const wrapper = mount(ProConfigProvider, {
      props: { locale: { ...zhCN, Heatmap: { less: '少' } as any } },
      slots: {
        default: () => h(Heatmap, { range: { start: jan1, end: jan2 } }),
      },
    })

    expect(wrapper.find('.ant-heatmap-indicator').text()).toBe('少More')
    expect(wrapper.find('table').attributes('aria-label')).toBe('Heatmap')
  })

  describe('colors', () => {
    it('uses a theme class instead of inline colors for built-in themes', () => {
      const wrapper = mount(Heatmap, {
        props: {
          range: { start: jan1, end: jan2 },
          data: [
            { timestamp: jan1, value: 0 },
            { timestamp: jan2, value: 8 },
          ],
          colorTheme: 'orange',
        },
      })

      expect(wrapper.find('.ant-heatmap').classes()).toContain('ant-heatmap-theme-orange')
      expect((wrapper.find('[data-level="5"]').element as HTMLElement).style.backgroundColor).toBe('')
      wrapper.findAll('.ant-heatmap-indicator-color').forEach((color) => {
        expect((color.element as HTMLElement).style.backgroundColor).toBe('')
      })
    })

    it('lets activeColors win over colorTheme and ignores invalid themes', () => {
      const custom = mount(Heatmap, {
        props: {
          range: { start: jan1, end: jan1 },
          colorTheme: 'orange',
          activeColors: ['#111111', '#222222', '#333333', '#444444'],
        },
      })
      expect(custom.find('.ant-heatmap').classes()).not.toContain('ant-heatmap-theme-orange')

      const invalid = mount(Heatmap, {
        props: { range: { start: jan1, end: jan1 }, colorTheme: 'invalid-theme' as any },
      })
      expect(invalid.find('.ant-heatmap').classes().some(name => name.startsWith('ant-heatmap-theme-'))).toBe(false)
    })

    it('derives the default scale and the built-in themes from design tokens', () => {
      mount(Heatmap, { props: { range: { start: jan1, end: jan1 } } })

      const css = Array.from(document.querySelectorAll('style'))
        .map(el => el.textContent ?? '')
        .join('\n')
        .replace(/\s+/g, '')

      expect(css).toContain('.ant-heatmap-cell[data-level="2"]{background-color:var(--ant-heatmap-active-color-1)')
      expect(css).toContain('.ant-heatmap-cell[data-level="5"]{background-color:var(--ant-heatmap-active-color-4)')
      // 默认色阶取成功色色板的 3 / 5 / 6 / 7 档，由浅到深
      expect(css).toContain('--ant-heatmap-active-color-1:#b7eb8f')
      expect(css).toContain('--ant-heatmap-active-color-2:#73d13d')
      expect(css).toContain('--ant-heatmap-active-color-3:#52c41a')
      expect(css).toContain('--ant-heatmap-active-color-4:#389e0d')
      expect(css).toContain('.ant-heatmap-theme-green.ant-heatmap-cell[data-level="2"]')
      expect(css).toContain('var(--ant-green-3)')
      expect(css).toContain('var(--ant-red-9)')
      // 不再出现写死的 GitHub 配色
      expect(css).not.toContain('#9be9a8')
      expect(css).not.toContain('#216e39')
    })
  })

  describe('timeZone', () => {
    // 本地时间戳：无论测试机在哪个时区，`local` 都应该把它们归到本地日历日
    const localJan1 = new Date(2024, 0, 1).getTime()
    const localJan1Late = new Date(2024, 0, 1, 23, 59, 59).getTime()
    const localJan2 = new Date(2024, 0, 2).getTime()
    const localJan3 = new Date(2024, 0, 3).getTime()

    it('normalizes data and ranges by the local calendar day', () => {
      const data = normalizeData([
        { timestamp: localJan1, value: 1 },
        { timestamp: localJan1Late, value: 2 },
        { timestamp: localJan2, value: 3 },
      ], 'local')

      expect(data.size).toBe(2)
      expect(data.get(jan1)?.value).toBe(2)
      expect(data.get(jan2)?.value).toBe(3)

      expect(resolveRange({ start: localJan1, end: localJan3 }, undefined, 'local')).toEqual({ start: jan1, end: jan3 })
      expect(resolveRange('recent', localJan1Late, 'local').end).toBe(jan1)
      // 年份范围与时区无关
      expect(resolveRange(2024, undefined, 'local')).toEqual({ start: jan1, end: Date.UTC(2024, 11, 31) })
    })

    it('exposes local-midnight timestamps on calendar cells', () => {
      const data = normalizeData([{ timestamp: localJan1Late, value: 2 }], 'local')
      const calendar = createCalendar({ start: jan1, end: jan3 }, data, 0, false, 'local')
      const cell = calendar[1]![0]!

      expect(cell.dayKey).toBe(jan1)
      expect(cell.timestamp).toBe(localJan1)
      expect(cell.date?.getDate()).toBe(1)
      expect(cell.value).toBe(2)
    })

    it('renders local timestamps on the local day and labels them with that date', async () => {
      const wrapper = mount(Heatmap, {
        props: {
          timeZone: 'local',
          range: { start: localJan1, end: localJan3 },
          data: [{ timestamp: localJan1Late, value: 4 }],
          classes: { cell: 'heatmap-cell' },
        },
      })

      const cells = wrapper.findAll('.heatmap-cell').filter(cell => cell.element.tagName === 'BUTTON')
      expect(cells).toHaveLength(1)
      expect(cells[0]!.attributes('aria-label')).toContain('Jan 1, 2024')

      await cells[0]!.trigger('click')
      expect(wrapper.emitted('cellClick')?.[0]?.[0]).toMatchObject({ timestamp: localJan1Late, value: 4 })
    })

    it('reads timeZone from ProConfigProvider and lets props override it', () => {
      const render = (timeZone?: 'UTC' | 'local') => mount(ProConfigProvider, {
        props: { heatmap: { timeZone: 'local' } },
        slots: {
          default: () => h(Heatmap, {
            timeZone,
            range: { start: jan1, end: jan3 },
            data: [{ timestamp: jan2 + 12 * 60 * 60 * 1000, value: 4 }],
          }),
        },
      })

      // UTC 正午在任何时区都落在本地的 1 月 2 日或 3 日；显式 UTC 时一定是 1 月 2 日
      expect(render('UTC').find('button').attributes('aria-label')).toContain('Jan 2, 2024')
      const localLabel = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
        .format(new Date(jan2 + 12 * 60 * 60 * 1000))
      expect(render().find('button').attributes('aria-label')).toContain(localLabel)
    })
  })

  it('adds the rtl class and keeps the table direction-agnostic', () => {
    const wrapper = mount({
      render() {
        return h(ConfigProvider, { direction: 'rtl' }, {
          default: () => h(Heatmap, { range: { start: jan1, end: jan3 }, data: [{ timestamp: jan1, value: 1 }] }),
        })
      },
    })

    expect(wrapper.find('.ant-heatmap').classes()).toContain('ant-heatmap-rtl')
    const css = Array.from(document.querySelectorAll('style'))
      .map(el => el.textContent ?? '')
      .join('\n')
      .replace(/\s+/g, '')
    expect(css).toContain('.ant-heatmap-rtl{direction:rtl')
    expect(css).toContain('.ant-heatmap-footer{display:flex;align-items:center;justify-content:space-between;gap:var(--ant-margin-sm);margin-block-start:var(--ant-margin-xs)')
  })
})
