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

## 何时使用 {#when-to-use}

- 展示用户活跃度、访问量、订单量或告警数量等按日聚合的数据。
- 需要用颜色等级快速比较一段时间内的数据密度。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基础用法</demo>
  <demo src="./demo/colors.vue">颜色等级</demo>
  <demo src="./demo/interaction.vue">Tooltip 与日期事件</demo>
  <demo src="./demo/semantic.vue">语义化样式</demo>
</demo-group>

## API {#api}

### 属性 {#properties}

| 属性 | 说明 | 类型 | 默认值 | 版本 | [全局配置](/components/config-provider-cn#component-config) |
| --- | --- | --- | --- | --- | --- |
| prefixCls | 组件样式前缀 | `string` | - | - | × |
| rootClass | 组件根元素 class | `string` | - | - | × |
| data | 日期数据。`null`、省略值或缺少条目为无数据；`0` 为有效数据。同一日期（按 `timeZone` 归一）存在多个有效条目时，以最后一个为准。 | `HeatmapData` | - | - | × |
| range | 展示范围。`'recent'` 为截至今天的最近 365 天；数字表示公历年份（如 `2024`，支持 1970 – 2100）；也可以传 `{ start, end }` 时间戳 | `'recent' \| number \| HeatmapRange` | `'recent'` | - | × |
| timeZone | `data` / `range` 中的时间戳按哪个时区归一到日期，见[时区](#time-zone) | `'UTC' \| 'local'` | `'UTC'` | - | ✓ |
| firstDayOfWeek | 一周开始日，`0` 为周日 | `0 \| 1 \| ... \| 6` | `0` | - | ✓ |
| showMonthLabels | 是否显示月份标签 | `boolean` | `true` | - | ✓ |
| showWeekLabels | 是否显示星期标签 | `boolean` | `true` | - | ✓ |
| showColorIndicator | 是否显示颜色等级指示器 | `boolean` | `true` | - | ✓ |
| fillCalendarLeading | 是否填充范围起点前的同周日期 | `boolean` | `false` | - | ✓ |
| size | 单元格尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` | - | ✓ |
| xGap / yGap | 水平/垂直单元格间距 | `number \| string` | `3` | - | ✓ |
| colorTheme | 内置颜色主题，取自 Ant Design 预设色板，跟随主题算法；不设置时色阶从 `colorPrimary` 派生 | `'green' \| 'blue' \| 'orange' \| 'purple' \| 'red'` | - | - | ✓ |
| activeColors | 自定义高于最低档位的四个颜色 | `HeatmapColorScale` | - | - | ✓ |
| minimumColor | 自定义最低有效数值档位颜色 | `string` | - | - | ✓ |
| tooltip | 是否显示 Tooltip，或传入 Tooltip 配置；需要按单元格生成内容时，请使用 tooltip 插槽。 | `boolean \| TooltipProps` | `false` | - | ✓ |
| classes | 自定义语义化 class，支持对象或函数 | `HeatmapClassNamesType` | - | - | ✓ |
| styles | 自定义语义化 style，支持对象或函数 | `HeatmapStylesType` | - | - | ✓ |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| cellClick | 点击或通过键盘激活 data 中出现过的日期单元格时触发（包含 value 为 null 的无数据项） | `(item: HeatmapDataItem, event: MouseEvent) => void` | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| footer | 底部左侧扩展内容 | `() => any` | - |
| indicator | 完整替换颜色指示器 | `() => any` | - |
| indicatorLeadingText | 默认指示器前置文字 | `() => any` | - |
| indicatorTrailingText | 默认指示器后置文字 | `() => any` | - |
| tooltip | 自定义 Tooltip 内容，参数为 `HeatmapTooltipSlotProps` | `(props: HeatmapTooltipSlotProps) => any` | - |

> 插槽内容为空（例如 `v-if` 为假）时会回退到默认内容。

## 时区 {#time-zone}

Heatmap 以「天」为单位聚合，`data` 与 `range` 里的时间戳需要先归一到某一天，`timeZone` 决定按哪个时区归一：

| 取值 | 行为 | 适用场景 |
| --- | --- | --- |
| `UTC`（默认） | 按 UTC 日期归一，`range="recent"` 的「今天」是 UTC 的今天 | 服务端已按 UTC 聚合，时间戳是 UTC 零点 |
| `local` | 按浏览器本地时区归一，「今天」是本地的今天 | 时间戳来自 `new Date(2024, 0, 1).getTime()`、`dayjs().startOf('day')` 等本地时间 |

在默认的 `UTC` 下，东八区的本地零点（如 `new Date(2024, 0, 1).getTime()`）对应 UTC 的前一天 16:00，会落到前一天的格子里。这种数据请设置 `timeZone="local"`。

`tooltip` 插槽参数里的 `timestamp` / `date` 是该日期在所选时区下的零点。`range` 传年份时不受时区影响。

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

日期单元格带有 `data-level` 和 `data-empty` 状态属性，可用于细化样式。

## 主题 Token {#design-tokens}

Heatmap 支持通过 `theme.components.Heatmap` 自定义组件样式 Token。默认颜色、标签、圆角、尺寸和焦点样式均从全局 Token 派生：默认色阶（`activeColor1` – `activeColor4`）来自 `colorPrimary` 色板，暗色主题下自动切换。

<ComponentTokenTable component="Heatmap" />
