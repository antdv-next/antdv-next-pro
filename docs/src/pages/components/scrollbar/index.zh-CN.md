---
category: Pro Components
title: Scrollbar
subtitle: 滚动条
description: 面向 Pro 布局与高密度导航区域的双轴自定义滚动容器。
demo:
  cols: 1
group:
  title: Navigation
  order: 1
---

## 何时使用 {#when-to-use}

- 当原生滚动条在高密度 Pro 布局里显得过重时。
- 当你需要一个定高的导航区或内容区，并同时支持横向与纵向滚动时。
- 当你希望通过语义化 `classes` 和 `styles` 精细控制滚动条结构样式时。
- 当你希望 `auto` 模式下在用户移出内容区域一段时间后自动隐藏滚动条时。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基础用法</demo>
  <demo src="./demo/visibility.vue">显隐模式</demo>
  <demo src="./demo/motion.vue">显隐动画</demo>
  <demo src="./demo/sider.vue">导航侧栏</demo>
  <demo src="./demo/controller.vue">事件与滚动控制</demo>
  <demo src="./demo/semantic.vue">语义化样式</demo>
</demo-group>

## API {#api}

### 属性 {#properties}

| 参数 | 说明 | 类型 | 默认值 | 版本 | [全局配置](/components/config-provider-cn#component-config) |
| --- | --- | --- | --- | --- | --- |
| prefixCls | 组件样式前缀 | `string` | - | - | × |
| rootClass | 组件根元素 class | `string` | - | - | × |
| visibility | 横纵轴共用的显隐策略 | `'auto' \| 'always' \| 'hidden'` | `'auto'` | - | ✓ |
| visibilityX | 横向滚动条显隐策略 | `'auto' \| 'always' \| 'hidden'` | - | - | ✓ |
| visibilityY | 纵向滚动条显隐策略 | `'auto' \| 'always' \| 'hidden'` | - | - | ✓ |
| hideDelay | `auto` 模式下移出内容区域后自动隐藏滚动条的延时，单位为毫秒 | `number` | `1200` | - | ✓ |
| motion | 滚动条轨道显隐动画，`fade` 为淡入淡出，`slide` 为从右侧滑入、向右侧滑出 | `'fade' \| 'slide'` | `'fade'` | - | ✓ |
| classes | 用于自定义组件内部各语义化结构的 class，支持对象或函数 | `ScrollbarClassNamesType` | - | - | ✓ |
| styles | 用于自定义组件内部各语义化结构的行内 style，支持对象或函数 | `ScrollbarStylesType` | - | - | ✓ |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| scroll | 原生滚动容器滚动时触发 | `(event: Event) => void` | - |

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| default | 滚动容器内部承载的内容 | `() => any` | - |

### 方法 {#methods}

组件 `ref` 会暴露以下实例能力：

| 名称 | 说明 | 参数 | 版本 |
| --- | --- | --- | --- |
| scrollTo | 滚动到目标位置，支持原生 `ScrollToOptions` 或数值坐标调用 | `(options: ScrollToOptions)` 或 `(left: number, top?: number)` | - |
| containerRef | 原生滚动容器引用 | - | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题 Token {#design-tokens}

Scrollbar 支持通过 `theme.components.Scrollbar` 自定义组件样式 Token：

<ComponentTokenTable component="Scrollbar" />
