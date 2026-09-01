---
category: Pro Components
title: Heatmap
subtitle: 热力图
description: 使用日历网格展示按日期聚合的数据密度。
demo:
  cols: 1
group:
  title: Data Display
  order: 1
---

## 何时使用

- 展示用户活跃度、访问量、订单量或告警数量等按日聚合的数据。
- 需要用颜色等级快速比较一段时间内的数据密度。

## 代码演示

<demo-group>
  <demo src="./demo/basic.vue">基础用法</demo>
  <demo src="./demo/colors.vue">颜色等级</demo>
  <demo src="./demo/interaction.vue">Tooltip 与日期事件</demo>
  <demo src="./demo/semantic.vue">语义化样式</demo>
</demo-group>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 日期数据。`null`、省略值或缺少条目为无数据；`0` 为有效数据。同一 UTC 日期存在多个有效条目时，以最后一个为准。 | `HeatmapData` | - |
| range | 展示范围。`recent` 为以当天 UTC 为终点的 365 天；数字表示一个 UTC 日历年。对象范围会按时间先后自动归一化。 | `'recent' \| number \| HeatmapRange` | `'recent'` |
| firstDayOfWeek | 一周开始日，`0` 为周日 | `0 \| 1 \| ... \| 6` | `0` |
| showMonthLabels | 是否显示月份标签 | `boolean` | `true` |
| showWeekLabels | 是否显示星期标签 | `boolean` | `true` |
| showColorIndicator | 是否显示颜色等级指示器 | `boolean` | `true` |
| fillCalendarLeading | 是否填充范围起点前的同周日期 | `boolean` | `false` |
| size | 单元格尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| xGap / yGap | 水平/垂直单元格间距 | `number \| string` | `3` |
| colorTheme | 内置颜色主题 | `'green' \| 'blue' \| 'orange' \| 'purple' \| 'red'` | - |
| activeColors | 自定义活跃颜色等级 | `string[]` | - |
| minimumColor | 自定义最低有效数值颜色 | `string` | - |
| tooltip | 是否显示 Tooltip，或传入 Tooltip 配置；需要按单元格生成内容时，请使用 tooltip 插槽。 | `boolean \| TooltipProps` | `false` |
| classes | 自定义语义化 class，支持对象或函数 | `HeatmapClassNamesType` | - |
| styles | 自定义语义化 style，支持对象或函数 | `HeatmapStylesType` | - |

### 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| cell-click | 点击有数据项的日期单元格（包括无数据项），或在其上按 Enter/空格时触发 | `(item: HeatmapDataItem, event: MouseEvent \| KeyboardEvent) => void` |

### 插槽

| 插槽 | 说明 |
| --- | --- |
| footer | 底部左侧扩展内容 |
| indicator | 完整替换颜色指示器 |
| indicator-leading-text | 默认指示器前置文字 |
| indicator-trailing-text | 默认指示器后置文字 |
| tooltip | 自定义 Tooltip 内容，参数为 `HeatmapTooltipSlotProps` |

## 语义化 DOM

<demo src="./demo/_semantic.vue" simplify></demo>

日期单元格带有 `data-level` 和 `data-empty` 状态属性，可用于细化样式。

## 主题 Token

Heatmap 支持通过 `theme.components.Heatmap` 自定义组件样式 Token。默认颜色、标签、圆角、尺寸和焦点样式均从全局 Token 派生。

<ComponentTokenTable component="Heatmap" />
