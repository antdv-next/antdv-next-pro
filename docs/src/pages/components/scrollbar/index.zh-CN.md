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

## 何时使用

- 当原生滚动条在高密度 Pro 布局里显得过重时。
- 当你需要一个定高的导航区或内容区，并同时支持横向与纵向滚动时。
- 当你希望通过语义化 `classes` 和 `styles` 精细控制滚动条结构样式时。
- 当你希望 `auto` 模式下在用户移出内容区域一段时间后自动隐藏滚动条时。

## 代码演示

<demo-group>
  <demo src="./demo/basic.vue">基础用法</demo>
  <demo src="./demo/visibility.vue">显隐模式</demo>
  <demo src="./demo/sider.vue">导航侧栏</demo>
  <demo src="./demo/controller.vue">事件与滚动控制</demo>
  <demo src="./demo/semantic.vue">语义化样式</demo>
</demo-group>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| visibility | 横纵轴共用的显隐策略 | `'auto' \| 'always' \| 'hidden'` | `'auto'` |
| visibilityX | 横向滚动条显隐策略 | `'auto' \| 'always' \| 'hidden'` | - |
| visibilityY | 纵向滚动条显隐策略 | `'auto' \| 'always' \| 'hidden'` | - |
| hideDelay | `auto` 模式下移出内容区域后自动隐藏滚动条的延时，单位为毫秒 | `number` | `1200` |
| native | 使用浏览器原生滚动条并关闭覆盖层 thumb | `boolean` | `false` |
| classes | 自定义语义化 class，支持对象和函数形式 | `Record<[语义化 DOM](#语义化-dom), string> \| (info: { props }) => Record<[语义化 DOM](#语义化-dom), string>` | - |
| styles | 自定义语义化内联样式，支持对象和函数形式 | `Record<[语义化 DOM](#语义化-dom), CSSProperties> \| (info: { props }) => Record<[语义化 DOM](#语义化-dom), CSSProperties>` | - |

### 事件

| 事件 | 说明 | 类型 |
| --- | --- | --- |
| scroll | 原生滚动容器滚动时触发 | `(event: Event) => void` |

### 方法

组件 `ref` 会暴露以下实例能力：

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| scrollTo | 滚动到目标位置，支持原生 `ScrollToOptions` 或 `(left, top)` 调用 | `(options: ScrollToOptions) => void; (left: number, top?: number) => void` |
| containerRef | 原生滚动容器引用 | `ShallowRef<HTMLElement \| undefined>` |

## 语义化 DOM

<demo src="./demo/_semantic.vue" simplify></demo>
