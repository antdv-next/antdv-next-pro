import type { App, CSSProperties, SlotsType } from 'vue'
import type { HeatmapLocale, ProLocale } from '../locale/types'
import type {
  HeatmapClassNamesType,
  HeatmapColorScale,
  HeatmapColorTheme,
  HeatmapEmits,
  HeatmapProps,
  HeatmapSemanticClassNames,
  HeatmapSemanticStyles,
  HeatmapSlots,
  HeatmapStylesType,
} from './types'
import type { HeatmapCell } from './utils'
import { clsx } from '@v-c/util'
import { Tooltip } from 'antdv-next'
import { useConfig as useAntConfig, useBaseConfig } from 'antdv-next/config-provider/context'
import useCSSVarCls from 'antdv-next/config-provider/hooks/useCSSVarCls'
import { computed, defineComponent } from 'vue'
import { filterEmpty } from '../_util/node'
import { useMergeSemantic } from '../_util/semantic'
import { useProComponentConfig } from '../config-provider'
import useStyle from './style'
import { HEATMAP_ACTIVE_COLOR_COUNT, HEATMAP_COLOR_THEMES, isHeatmapColorScale } from './types'
import { createCalendar, formatGap, normalizeData, resolveRange } from './utils'

// 语言包缺少 Heatmap 字段（或只提供了部分字段）时的逐字段英文兜底。
const DEFAULT_LOCALE: HeatmapLocale = {
  label: 'Heatmap',
  less: 'Less',
  more: 'More',
  noData: 'No data',
  level: 'Level',
}
const LEVELS = Array.from({ length: HEATMAP_ACTIVE_COLOR_COUNT + 1 }, (_, index) => index + 1)

function omitClassAndStyle(attrs: Record<string, any>) {
  const nextAttrs = { ...attrs }
  delete nextAttrs.class
  delete nextAttrs.style
  return nextAttrs
}

function normalizeColors(colors: unknown): HeatmapColorScale | undefined {
  if (colors === undefined || isHeatmapColorScale(colors)) {
    return colors
  }

  if (import.meta.env?.DEV) {
    console.warn('[Heatmap] `activeColors` must contain four non-empty color strings. Falling back to the theme or default color scale.')
  }
}

function isColorTheme(value: unknown): value is HeatmapColorTheme {
  return typeof value === 'string' && (HEATMAP_COLOR_THEMES as readonly string[]).includes(value)
}

/**
 * slot 优先：插槽存在且过滤空节点（注释、空 Fragment、空白文本）后仍有内容才采用，否则返回 null 交给兜底。
 */
function renderSlot(slot: ((...args: any[]) => any) | undefined, ...args: any[]) {
  if (!slot) {
    return null
  }
  const nodes = filterEmpty(slot(...args))
  return nodes.length ? nodes : null
}

const Heatmap = defineComponent<
  HeatmapProps,
  HeatmapEmits,
  string,
  SlotsType<HeatmapSlots>
>(
  (props, { attrs, emit, slots }) => {
    const { prefixCls, direction } = useBaseConfig('heatmap', props)
    const antConfig = useAntConfig()
    const proConfig = useProComponentConfig('heatmap')
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)
    // 1.x 的 kebab-case 插槽名继续可用，文档只保留 camelCase。
    const legacySlots = slots as Record<string, ((...args: any[]) => any) | undefined>

    const mergedFirstDayOfWeek = computed(() => props.firstDayOfWeek ?? proConfig.value.firstDayOfWeek ?? 0)
    const mergedShowMonthLabels = computed(() => props.showMonthLabels ?? proConfig.value.showMonthLabels ?? true)
    const mergedShowWeekLabels = computed(() => props.showWeekLabels ?? proConfig.value.showWeekLabels ?? true)
    const mergedShowColorIndicator = computed(() => props.showColorIndicator ?? proConfig.value.showColorIndicator ?? true)
    const mergedFillCalendarLeading = computed(() => props.fillCalendarLeading ?? proConfig.value.fillCalendarLeading ?? false)
    const mergedSize = computed(() => props.size ?? proConfig.value.size ?? 'medium')
    const mergedXGap = computed(() => props.xGap ?? proConfig.value.xGap)
    const mergedYGap = computed(() => props.yGap ?? proConfig.value.yGap)
    const mergedTooltip = computed(() => props.tooltip ?? proConfig.value.tooltip ?? false)
    const mergedColorTheme = computed(() => props.colorTheme ?? proConfig.value.colorTheme)
    const mergedActiveColors = computed(() => normalizeColors(props.activeColors ?? proConfig.value.activeColors))
    const mergedMinimumColor = computed(() => props.minimumColor ?? proConfig.value.minimumColor)
    const mergedTimeZone = computed(() => (props.timeZone ?? proConfig.value.timeZone) === 'local' ? 'local' : 'UTC')

    // 内置主题与默认色阶都由样式（Token）提供，这里只有用户传入的颜色才走内联样式。
    const themeCls = computed(() => {
      const colorTheme = mergedColorTheme.value
      return !mergedActiveColors.value && isColorTheme(colorTheme)
        ? `${prefixCls.value}-theme-${colorTheme}`
        : undefined
    })

    function getCustomLevelStyle(level: number): CSSProperties | undefined {
      const backgroundColor = level === 1
        ? mergedMinimumColor.value
        : level > 1
          ? mergedActiveColors.value?.[level - 2]
          : undefined
      return backgroundColor ? { backgroundColor } : undefined
    }

    const mergedSemanticProps = computed<HeatmapProps>(() => ({
      ...props,
      firstDayOfWeek: mergedFirstDayOfWeek.value,
      showMonthLabels: mergedShowMonthLabels.value,
      showWeekLabels: mergedShowWeekLabels.value,
      showColorIndicator: mergedShowColorIndicator.value,
      fillCalendarLeading: mergedFillCalendarLeading.value,
      size: mergedSize.value,
      xGap: mergedXGap.value,
      yGap: mergedYGap.value,
      tooltip: mergedTooltip.value,
      colorTheme: mergedColorTheme.value,
      activeColors: mergedActiveColors.value,
      minimumColor: mergedMinimumColor.value,
      timeZone: mergedTimeZone.value,
    }))
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      HeatmapSemanticClassNames,
      HeatmapSemanticStyles,
      HeatmapProps
    >(
      computed(() => [proConfig.value.classes as HeatmapClassNamesType | undefined, props.classes]),
      computed(() => [proConfig.value.styles as HeatmapStylesType | undefined, props.styles]),
      computed(() => ({ props: mergedSemanticProps.value })),
    )

    const displayedRange = computed(() => resolveRange(props.range, Date.now(), mergedTimeZone.value))
    const calendar = computed(() => createCalendar(
      displayedRange.value,
      normalizeData(props.data, mergedTimeZone.value),
      mergedFirstDayOfWeek.value,
      mergedFillCalendarLeading.value,
      mergedTimeZone.value,
    ))

    const localeCode = computed(() => antConfig.value.locale?.locale)
    const pickerLang = computed(() => antConfig.value.locale?.DatePicker?.lang ?? antConfig.value.locale?.Calendar?.lang)
    const weekdayFormatter = computed(() => new Intl.DateTimeFormat(localeCode.value, {
      weekday: 'short',
      timeZone: 'UTC',
    }))
    const monthFormatter = computed(() => new Intl.DateTimeFormat(localeCode.value, {
      month: 'short',
      timeZone: 'UTC',
    }))
    const dateFormatter = computed(() => new Intl.DateTimeFormat(localeCode.value, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    }))
    const localeText = computed<HeatmapLocale>(() => ({
      ...DEFAULT_LOCALE,
      ...(antConfig.value.locale as ProLocale | undefined)?.Heatmap,
    }))

    const weekLabels = computed(() => Array.from({ length: 7 }, (_, index) => {
      const dayIndex = (mergedFirstDayOfWeek.value + index) % 7
      const pickerWeekdays = pickerLang.value?.shortWeekDays
      if (pickerWeekdays?.length === 7) {
        return pickerWeekdays[dayIndex]!
      }
      const day = Date.UTC(2023, 0, 1 + dayIndex)
      return weekdayFormatter.value.format(new Date(day))
    }))
    const monthHeaderCells = computed(() => {
      let previousMonth = ''
      const headers: Array<{ label: string, colspan: number }> = []

      for (let column = 0; column < (calendar.value[0]?.length ?? 0); column += 1) {
        const cell = calendar.value.map(row => row[column]).find(current => current?.dayKey !== undefined)
        if (cell?.dayKey === undefined) {
          continue
        }
        // dayKey 是日历日的 UTC 零点，月份 / 格式化统一按 UTC 读取，与 timeZone 无关。
        const day = new Date(cell.dayKey)
        const month = `${day.getUTCFullYear()}-${day.getUTCMonth()}`
        if (month === previousMonth) {
          headers[headers.length - 1]!.colspan += 1
          continue
        }
        previousMonth = month
        const pickerMonths = pickerLang.value?.shortMonths
        const label = pickerMonths?.length === 12
          ? pickerMonths[day.getUTCMonth()]!
          : monthFormatter.value.format(day)
        headers.push({ label, colspan: 1 })
      }

      return headers
    })

    const mergedClassName = computed(() => clsx(
      prefixCls.value,
      `${prefixCls.value}-${mergedSize.value}`,
      hashId.value,
      cssVarCls.value,
      rootCls.value,
      themeCls.value,
      { [`${prefixCls.value}-rtl`]: direction.value === 'rtl' },
      proConfig.value.class,
      props.rootClass,
      mergedClassNames.value.root,
      (attrs as any).class,
    ))
    const mergedStyle = computed(() => [
      mergedStyles.value.root,
      proConfig.value.style,
      (attrs as any).style,
    ])
    const tableStyle = computed<CSSProperties>(() => ({
      borderSpacing: `${formatGap(mergedXGap.value) ?? '3px'} ${formatGap(mergedYGap.value) ?? '3px'}`,
    }))

    function formatTooltip(cell: { dayKey?: number, value: number | null, level: number }) {
      if (cell.dayKey === undefined) {
        return ''
      }
      const value = cell.value === null ? localeText.value.noData : cell.value
      return `${dateFormatter.value.format(new Date(cell.dayKey))}: ${value} (${localeText.value.level} ${cell.level})`
    }

    function renderIndicator() {
      const customIndicator = renderSlot(slots.indicator)
      if (customIndicator) {
        return customIndicator
      }
      if (!mergedShowColorIndicator.value) {
        return null
      }

      return (
        <div
          class={clsx(`${prefixCls.value}-indicator`, mergedClassNames.value.indicator)}
          style={mergedStyles.value.indicator}
        >
          <span>{renderSlot(slots.indicatorLeadingText ?? legacySlots['indicator-leading-text']) ?? localeText.value.less}</span>
          <div class={`${prefixCls.value}-indicator-colors`}>
            {LEVELS.map(level => (
              <span
                key={level}
                class={`${prefixCls.value}-indicator-color`}
                data-level={level}
                role="img"
                aria-label={`${localeText.value.level} ${level}`}
                style={getCustomLevelStyle(level)}
              />
            ))}
          </div>
          <span>{renderSlot(slots.indicatorTrailingText ?? legacySlots['indicator-trailing-text']) ?? localeText.value.more}</span>
        </div>
      )
    }

    function renderCell(cell: HeatmapCell, row: number, column: number) {
      const cellStyle = getCustomLevelStyle(cell.level)
      const isInteractive = Boolean(cell.item)
      const cellLabel = cell.dayKey !== undefined ? formatTooltip(cell) : undefined
      const slotProps = cell.date
        ? { timestamp: cell.timestamp!, value: cell.value, date: cell.date, level: cell.level }
        : undefined
      const onClick = (event: MouseEvent) => {
        if (cell.item) {
          emit('cellClick', cell.item, event)
        }
      }
      const cellProps = {
        class: clsx(`${prefixCls.value}-cell`, mergedClassNames.value.cell),
        style: [mergedStyles.value.cell, cellStyle],
        'data-level': cell.level,
        'data-empty': cell.value === null ? 'true' : 'false',
      }
      const node = isInteractive
        ? (
            <button
              type="button"
              {...cellProps}
              aria-label={cellLabel}
              onClick={onClick}
            />
          )
        : <div {...cellProps} />
      const tooltip = mergedTooltip.value
      const content = !cell.placeholder && tooltip !== false && slotProps
        ? (
            <Tooltip
              {...(typeof tooltip === 'object' ? tooltip : {})}
              trigger={(typeof tooltip === 'object' && tooltip.trigger) ? tooltip.trigger : ['hover', 'focus'] as any}
              title={(renderSlot(slots.tooltip, slotProps) as any) ?? (typeof tooltip === 'object' ? tooltip.title : undefined) ?? formatTooltip(cell)}
            >
              {node}
            </Tooltip>
          )
        : node

      return (
        <td
          key={`${row}-${column}`}
          class={`${prefixCls.value}-cell-container`}
          aria-label={!isInteractive ? cellLabel : undefined}
        >
          {content}
        </td>
      )
    }

    return () => {
      const indicator = renderIndicator()
      const footer = renderSlot(slots.footer)
      const hasFooter = Boolean(footer || indicator)

      return (
        <div
          class={mergedClassName.value}
          style={mergedStyle.value}
          data-size={mergedSize.value}
          {...omitClassAndStyle(attrs as Record<string, any>)}
        >
          <div
            class={clsx(`${prefixCls.value}-content`, mergedClassNames.value.content)}
            style={mergedStyles.value.content}
          >
            <div class={`${prefixCls.value}-content-inner`}>
              <table class={`${prefixCls.value}-table`} style={tableStyle.value} aria-label={localeText.value.label}>
                {mergedShowMonthLabels.value && (
                  <thead>
                    <tr>
                      {mergedShowWeekLabels.value && <th />}
                      {monthHeaderCells.value.map((header, index) => (
                        <th
                          key={`${header.label}-${index}`}
                          class={`${prefixCls.value}-month-label`}
                          colspan={header.colspan}
                          data-colspan={header.colspan}
                          aria-label={header.label}
                          scope="colgroup"
                          title={header.colspan === 1 ? header.label : undefined}
                        >
                          {header.colspan > 1 && <span>{header.label}</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {calendar.value.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {mergedShowWeekLabels.value && (rowIndex % 2
                        ? <th class={`${prefixCls.value}-week-label`} scope="row">{weekLabels.value[rowIndex]}</th>
                        : <td class={`${prefixCls.value}-week-label`} />)}
                      {row.map((cell, columnIndex) => renderCell(cell, rowIndex, columnIndex))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {hasFooter && (
                <div
                  class={clsx(`${prefixCls.value}-footer`, mergedClassNames.value.footer)}
                  style={mergedStyles.value.footer}
                >
                  {footer && <div>{footer}</div>}
                  {indicator}
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }
  },
  {
    name: 'AHeatmap',
    inheritAttrs: false,
  },
)

;(Heatmap as any).install = (app: App) => {
  app.component(Heatmap.name, Heatmap)
}

export type {
  HeatmapClassNamesType,
  HeatmapColorScale,
  HeatmapColorTheme,
  HeatmapConfig,
  HeatmapData,
  HeatmapDataItem,
  HeatmapEmits,
  HeatmapFirstDayOfWeek,
  HeatmapProps,
  HeatmapRange,
  HeatmapSemanticClassNames,
  HeatmapSemanticName,
  HeatmapSemanticStyles,
  HeatmapSize,
  HeatmapSlots,
  HeatmapStylesType,
  HeatmapTimeZone,
  HeatmapTooltipSlotProps,
} from './types'
export default Heatmap
export { Heatmap }
