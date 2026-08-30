import type { App, CSSProperties, SlotsType } from 'vue'
import type {
  HeatmapClassNamesType,
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
import { useMergeSemantic } from '../_util/semantic'
import { useProComponentConfig } from '../config-provider'
import useStyle from './style'
import { HEATMAP_COLOR_THEMES } from './types'
import { createCalendar, formatGap, normalizeData, resolveRange } from './utils'

const DEFAULT_ACTIVE_COLORS = HEATMAP_COLOR_THEMES.green
const DEFAULT_MINIMUM_COLOR = '#ebedf0'

function omitClassAndStyle(attrs: Record<string, any>) {
  const nextAttrs = { ...attrs }
  delete nextAttrs.class
  delete nextAttrs.style
  return nextAttrs
}

function normalizeColors(colors: string[] | undefined) {
  const result = colors?.filter(color => typeof color === 'string' && color.trim()) ?? []
  return result.length ? result : undefined
}

function isColorTheme(value: unknown): value is HeatmapColorTheme {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(HEATMAP_COLOR_THEMES, value)
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

    const resolvedActiveColors = computed(() => {
      const colorTheme = mergedColorTheme.value
      return mergedActiveColors.value
        ?? (isColorTheme(colorTheme) ? HEATMAP_COLOR_THEMES[colorTheme] : DEFAULT_ACTIVE_COLORS)
    })
    const resolvedColors = computed(() => [mergedMinimumColor.value ?? DEFAULT_MINIMUM_COLOR, ...resolvedActiveColors.value])
    const usesCustomColors = computed(() => Boolean(mergedActiveColors.value || mergedColorTheme.value || mergedMinimumColor.value))

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

    const displayedRange = computed(() => resolveRange(props.range))
    const calendar = computed(() => createCalendar(
      displayedRange.value,
      normalizeData(props.data),
      mergedFirstDayOfWeek.value,
      mergedFillCalendarLeading.value,
      resolvedActiveColors.value.length,
    ))

    const localeCode = computed(() => antConfig.value.locale?.locale)
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
    const localeText = computed(() => localeCode.value?.toLowerCase().startsWith('zh')
      ? { less: '少', more: '多', noData: '无数据', level: '等级' }
      : { less: 'Less', more: 'More', noData: 'No data', level: 'Level' })

    const weekLabels = computed(() => Array.from({ length: 7 }, (_, index) => {
      const day = Date.UTC(2023, 0, 1 + ((mergedFirstDayOfWeek.value + index) % 7))
      return weekdayFormatter.value.format(new Date(day))
    }))
    const monthHeaderCells = computed(() => {
      let previousMonth = ''
      const headers: Array<{ label: string, colspan: number }> = []

      for (let column = 0; column < (calendar.value[0]?.length ?? 0); column += 1) {
        const cell = calendar.value.map(row => row[column]).find(current => current?.timestamp)
        if (!cell?.date) {
          continue
        }
        const month = `${cell.date.getUTCFullYear()}-${cell.date.getUTCMonth()}`
        if (month === previousMonth) {
          headers[headers.length - 1]!.colspan += 1
          continue
        }
        previousMonth = month
        headers.push({ label: monthFormatter.value.format(cell.date), colspan: 1 })
      }

      return headers
    })

    const mergedClassName = computed(() => clsx(
      prefixCls.value,
      `${prefixCls.value}-${mergedSize.value}`,
      hashId.value,
      cssVarCls.value,
      rootCls.value,
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

    function formatTooltip(cell: { date?: Date, value: number | null, level: number }) {
      if (!cell.date) {
        return ''
      }
      const value = cell.value === null ? localeText.value.noData : cell.value
      return `${dateFormatter.value.format(cell.date)}: ${value} (${localeText.value.level} ${cell.level})`
    }

    function renderIndicator() {
      if (slots.indicator) {
        return slots.indicator()
      }
      if (!mergedShowColorIndicator.value) {
        return null
      }

      return (
        <div
          class={clsx(`${prefixCls.value}-indicator`, mergedClassNames.value.indicator)}
          style={mergedStyles.value.indicator}
        >
          <span>{slots['indicator-leading-text']?.() ?? localeText.value.less}</span>
          <div class={`${prefixCls.value}-indicator-colors`}>
            {resolvedColors.value.map((color, index) => (
              <span
                key={index}
                class={`${prefixCls.value}-indicator-color`}
                data-level={index + 1}
                style={usesCustomColors.value ? { backgroundColor: color } : undefined}
              />
            ))}
          </div>
          <span>{slots['indicator-trailing-text']?.() ?? localeText.value.more}</span>
        </div>
      )
    }

    function renderCell(cell: HeatmapCell, row: number, column: number) {
      const cellStyle = usesCustomColors.value && cell.level > 0
        ? { backgroundColor: resolvedColors.value[cell.level - 1] }
        : undefined
      const canFocus = !cell.placeholder
      const slotProps = cell.date
        ? { timestamp: cell.timestamp!, value: cell.value, date: cell.date, level: cell.level }
        : undefined
      const onClick = (event: MouseEvent) => {
        if (cell.item && typeof cell.item.value === 'number') {
          emit('cell-click', cell.item, event)
        }
      }
      const onKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          if (cell.item && typeof cell.item.value === 'number') {
            emit('cell-click', cell.item, event)
          }
        }
      }
      const node = (
        <div
          class={clsx(`${prefixCls.value}-cell`, mergedClassNames.value.cell)}
          style={[mergedStyles.value.cell, cellStyle]}
          data-level={cell.level}
          data-empty={cell.value === null ? 'true' : 'false'}
          tabindex={canFocus ? 0 : undefined}
          role={canFocus ? 'button' : undefined}
          aria-label={canFocus ? formatTooltip(cell) : undefined}
          onClick={onClick}
          onKeydown={onKeydown}
        />
      )
      const tooltip = mergedTooltip.value
      const content = !cell.placeholder && tooltip !== false && slotProps
        ? (
            <Tooltip
              {...(typeof tooltip === 'object' ? tooltip : {})}
              trigger={(typeof tooltip === 'object' && tooltip.trigger) ? tooltip.trigger : ['hover', 'focus'] as any}
              title={slots.tooltip?.(slotProps) ?? (typeof tooltip === 'object' ? tooltip.title : undefined) ?? formatTooltip(cell)}
            >
              {node}
            </Tooltip>
          )
        : node

      return (
        <td key={`${row}-${column}`} class={`${prefixCls.value}-cell-container`}>
          {content}
        </td>
      )
    }

    return () => {
      const indicator = renderIndicator()
      const hasFooter = Boolean(slots.footer || indicator)

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
              <table class={`${prefixCls.value}-table`} style={tableStyle.value}>
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
                      {mergedShowWeekLabels.value && <th class={`${prefixCls.value}-week-label`}>{rowIndex % 2 ? weekLabels.value[rowIndex] : ''}</th>}
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
                  <div>{slots.footer?.()}</div>
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
  HeatmapTooltipSlotProps,
} from './types'
export default Heatmap
export { Heatmap }
