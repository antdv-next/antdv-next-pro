---
category: Pro Components
title: Heatmap
description: Display date-aggregated data density in a calendar grid.
demo:
  cols: 1
group:
  title: Data Display
  order: 1
---

## When To Use {#when-to-use}

- Display daily aggregates such as activity, traffic, orders, or alerts.
- Compare data density over time through discrete color levels.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/colors.vue">Color levels</demo>
  <demo src="./demo/interaction.vue">Tooltip and cell events</demo>
  <demo src="./demo/semantic.vue">Semantic styling</demo>
</demo-group>

## API {#api}

### Properties {#properties}

| Property | Description | Type | Default | Version | [Global Config](/components/config-provider#component-config) |
| --- | --- | --- | --- | --- | --- |
| prefixCls | Component class prefix | `string` | - | - | × |
| rootClass | Class applied to the component root | `string` | - | - | × |
| data | Date data. `null`, an omitted value, and a missing entry mean no data; `0` is valid data. The last valid item for a UTC date wins. | `HeatmapData` | - | - | × |
| range | Display range. `recent` is 365 days ending on the current UTC date; a number represents a UTC calendar year. Object ranges are normalized chronologically. | `'recent' \| number \| HeatmapRange` | `'recent'` | - | × |
| firstDayOfWeek | First day of a week, where `0` is Sunday. | `0 \| 1 \| ... \| 6` | `0` | - | ✓ |
| showMonthLabels | Show month labels. | `boolean` | `true` | - | ✓ |
| showWeekLabels | Show week labels. | `boolean` | `true` | - | ✓ |
| showColorIndicator | Show the color indicator. | `boolean` | `true` | - | ✓ |
| fillCalendarLeading | Fill dates before the range start in the same week. | `boolean` | `false` | - | ✓ |
| size | Cell size. | `'small' \| 'medium' \| 'large'` | `'medium'` | - | ✓ |
| xGap / yGap | Horizontal and vertical cell gaps. | `number \| string` | `3` | - | ✓ |
| colorTheme | Included color theme. | `'green' \| 'blue' \| 'orange' \| 'purple' \| 'red'` | - | - | ✓ |
| activeColors | Custom colors for valid value levels above the lowest level. | `string[]` | - | - | ✓ |
| minimumColor | Custom color for the lowest valid value level. | `string` | - | - | ✓ |
| tooltip | Show a Tooltip or provide Tooltip options. Use the tooltip slot for per-cell content. | `boolean \| TooltipProps` | `false` | - | ✓ |
| classes | Customize semantic classes with an object or function. | `HeatmapClassNamesType` | - | - | ✓ |
| styles | Customize semantic inline styles with an object or function. | `HeatmapStylesType` | - | - | ✓ |

### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| cell-click | Triggered by clicking a supplied data-item cell, including a no-data item, or pressing Enter/Space on it. | `(item: HeatmapDataItem, event: MouseEvent \| KeyboardEvent) => void` | - |

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| footer | Bottom-left extension content. | `() => any` | - |
| indicator | Replace the complete color indicator. | `() => any` | - |
| indicator-leading-text | Leading text for the default indicator. | `() => any` | - |
| indicator-trailing-text | Trailing text for the default indicator. | `() => any` | - |
| tooltip | Customize Tooltip content with `HeatmapTooltipSlotProps`. | `(props: HeatmapTooltipSlotProps) => any` | - |

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

Date cells expose `data-level` and `data-empty` for finer style control.

## Design Tokens {#design-tokens}

Customize Heatmap with `theme.components.Heatmap`. Its defaults derive from global Tokens for color, typography, radius, sizing, and focus styles.

<ComponentTokenTable component="Heatmap" />
