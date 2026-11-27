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
| data | Date data. `null`, an omitted value, and a missing entry mean no data; `0` is valid data. The last valid item for a date (normalized by `timeZone`) wins. | `HeatmapData` | - | - | × |
| range | Display range. `'recent'` is the last 365 days ending today; a number is a calendar year (such as `2024`, 1970 – 2100); or pass `{ start, end }` timestamps. | `'recent' \| number \| HeatmapRange` | `'recent'` | - | × |
| timeZone | Time zone used to normalize timestamps in `data` / `range` to dates. See [Time zone](#time-zone). | `'UTC' \| 'local'` | `'UTC'` | - | ✓ |
| firstDayOfWeek | First day of a week, where `0` is Sunday. | `0 \| 1 \| ... \| 6` | `0` | - | ✓ |
| showMonthLabels | Show month labels. | `boolean` | `true` | - | ✓ |
| showWeekLabels | Show week labels. | `boolean` | `true` | - | ✓ |
| showColorIndicator | Show the color indicator. | `boolean` | `true` | - | ✓ |
| fillCalendarLeading | Fill dates before the range start in the same week. | `boolean` | `false` | - | ✓ |
| size | Cell size. | `'small' \| 'medium' \| 'large'` | `'medium'` | - | ✓ |
| xGap / yGap | Horizontal and vertical cell gaps. | `number \| string` | `3` | - | ✓ |
| colorTheme | Included color theme, taken from the Ant Design preset palettes and following the theme algorithm. Without it the scale derives from `colorPrimary`. | `'green' \| 'blue' \| 'orange' \| 'purple' \| 'red'` | - | - | ✓ |
| activeColors | Four custom colors above the lowest level. | `HeatmapColorScale` | - | - | ✓ |
| minimumColor | Custom color for the lowest valid value level. | `string` | - | - | ✓ |
| tooltip | Show a Tooltip or provide Tooltip options. Use the tooltip slot for per-cell content. | `boolean \| TooltipProps` | `false` | - | ✓ |
| classes | Customize semantic classes with an object or function. | `HeatmapClassNamesType` | - | - | ✓ |
| styles | Customize semantic inline styles with an object or function. | `HeatmapStylesType` | - | - | ✓ |

### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| cellClick | Triggered when a supplied data-item cell, including a no-data item, is clicked or activated by keyboard. | `(item: HeatmapDataItem, event: MouseEvent) => void` | - |

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| footer | Bottom-left extension content. | `() => any` | - |
| indicator | Replace the complete color indicator. | `() => any` | - |
| indicatorLeadingText | Leading text for the default indicator. | `() => any` | - |
| indicatorTrailingText | Trailing text for the default indicator. | `() => any` | - |
| tooltip | Customize Tooltip content with `HeatmapTooltipSlotProps`. | `(props: HeatmapTooltipSlotProps) => any` | - |

> A slot that renders nothing (for example a falsy `v-if`) falls back to the default content.

## Time zone {#time-zone}

Heatmap aggregates by day, so every timestamp in `data` and `range` is first normalized to a date. `timeZone` decides which time zone is used:

| Value | Behavior | Use it when |
| --- | --- | --- |
| `UTC` (default) | Normalizes by the UTC date; "today" for `range="recent"` is the UTC today. | The server already aggregates by UTC and timestamps are UTC midnights. |
| `local` | Normalizes by the browser's local time zone; "today" is the local today. | Timestamps come from local time, such as `new Date(2024, 0, 1).getTime()` or `dayjs().startOf('day')`. |

With the default `UTC`, a local midnight in UTC+8 (such as `new Date(2024, 0, 1).getTime()`) is 16:00 of the previous UTC day and lands in the previous day's cell. Set `timeZone="local"` for that kind of data.

The `timestamp` / `date` passed to the `tooltip` slot are the midnight of that date in the selected time zone. A year `range` is not affected by the time zone.

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

Date cells expose `data-level` and `data-empty` for finer style control.

## Design Tokens {#design-tokens}

Customize Heatmap with `theme.components.Heatmap`. Its defaults derive from global Tokens for color, typography, radius, sizing, and focus styles: the default scale (`activeColor1` – `activeColor4`) comes from the `colorPrimary` palette and switches automatically in dark themes.

<ComponentTokenTable component="Heatmap" />
