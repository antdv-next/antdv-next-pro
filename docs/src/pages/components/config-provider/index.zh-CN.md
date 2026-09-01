---
category: Pro Components
title: ProConfigProvider
subtitle: 全局配置
description: 为 Antdv Next 与 Pro 组件提供统一的主题、语言和交互配置。
demo:
  cols: 1
group:
  title: Other
  order: 99
---

## 何时使用

`ProConfigProvider` 是 `antdv-next` `ConfigProvider` 的 Pro 包装层。它会透传所有 Antdv ConfigProvider 配置，并额外提供 Pro 组件的全局配置入口。

- 在应用根部统一设置语言、文字方向、主题和组件默认状态。
- 在局部页面嵌套 Provider，继承外层配置并覆盖当前页面需要调整的选项。

全局安装后组件名为 `ap-config-provider`，也可以从 `@antdv-next/pro` 导入 `ProConfigProvider` 后局部注册。

## 使用方式

```vue
<script setup lang="ts">
import zhCN from '@antdv-next/pro/locale/zh_CN'
</script>

<template>
  <ap-config-provider
    :locale="zhCN"
    direction="ltr"
    component-size="middle"
  >
    <router-view />
  </ap-config-provider>
</template>
```

Locale wrapper 与 `antdv-next/locale/*` 保持一致，可按需从 `@antdv-next/pro/locale/*` 引入。`ProConfigProvider` 不会改变 Antdv ConfigProvider 的公开行为。

## 与 ConfigProvider 的关系

`ProConfigProvider` 内部组合了 `antdv-next` 的 `ConfigProvider`，因此它可以接收并透传 Antdv ConfigProvider 的全部属性。使用 Pro 组件时，通常在应用根部直接使用 `ap-config-provider`，Antdv 基础组件和 Pro 组件会共享同一份配置。

如果项目已经使用 `a-config-provider`，可以将 `ap-config-provider` 嵌套在内部。外层配置会被继承，内层显式设置的属性只对当前子树生效：

```vue
<a-config-provider :theme="theme" direction="ltr">
  <ap-config-provider component-size="large">
    <App />
  </ap-config-provider>
</a-config-provider>
```

也可以反向嵌套，让局部 `a-config-provider` 覆盖 Antdv 配置；ProConfigProvider 提供的 Pro 上下文仍会对该子树生效：

```vue
<ap-config-provider component-size="middle">
  <a-config-provider direction="rtl">
    <SettingsPanel />
  </a-config-provider>
</ap-config-provider>
```

一般不需要在应用根部重复包裹两个 Provider，只有在需要为局部页面覆盖配置时才进行嵌套。

## 代码示例

应用根部通常只需要一个 Provider。locale、主题和组件默认值可以组合配置：

```vue
<script setup lang="ts">
import zhCN from '@antdv-next/pro/locale/zh_CN'
</script>

<template>
  <ap-config-provider
    :locale="zhCN"
    :theme="{ token: { colorPrimary: '#1677ff' } }"
    component-size="middle"
    variant="outlined"
  >
    <router-view />
  </ap-config-provider>
</template>
```

局部页面可以嵌套 Provider，只覆盖需要变化的配置：

```vue
<ap-config-provider component-size="large">
  <ap-config-provider component-size="small">
    <SettingsPanel />
  </ap-config-provider>
</ap-config-provider>
```

通过插槽统一定制空状态：

```vue
<ap-config-provider>
  <template #renderEmpty>
    <a-empty description="暂无数据" />
  </template>
  <a-table :data-source="[]" :columns="columns" />
</ap-config-provider>
```

## API

### ProConfigProvider Props

以下属性与 `antdv-next` `ConfigProvider` 完全一致。完整的组件级配置（如 `button`、`table`、`input`、`select` 等）请参考 [Antdv ConfigProvider](https://www.antdv-next.com/components/config-provider-cn)。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| locale | 语言包。Pro locale wrapper 与 Antdv locale 对象一致 | `ProLocale` | - |
| direction | 布局方向 | `'ltr' \| 'rtl'` | `'ltr'` |
| theme | 主题 Token、算法和组件级配置 | `ThemeConfig` | - |
| componentSize | 后代组件默认尺寸 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| componentDisabled | 是否默认禁用后代组件 | `boolean` | `false` |
| variant | 输入类组件的默认变体 | `'outlined' \| 'borderless' \| 'filled' \| 'underlined'` | `'outlined'` |
| prefixCls / iconPrefixCls | CSS 和图标前缀 | `string` | `'ant'` / `'anticon'` |
| getPopupContainer | 弹层挂载容器 | `(triggerNode?: HTMLElement) => HTMLElement` | - |
| getTargetContainer | 固定元素和滚动容器 | `() => HTMLElement \| Window` | - |
| csp | Content Security Policy 配置 | `{ nonce?: string }` | - |
| virtual | 是否启用虚拟滚动 | `boolean` | `true` |
| popupMatchSelectWidth | 弹层宽度是否匹配 Select | `boolean` | `true` |
| popupOverflow | 弹层溢出策略 | `'viewport' \| 'scroll'` | `'viewport'` |

### Slots

| 插槽 | 说明 |
| --- | --- |
| default | Provider 包裹的内容 |
| renderEmpty | 自定义 Table、List 等组件的空状态，可接收组件名称 |
| transformCellText | 转换 Table 单元格文本，可作为属性或命名插槽使用，接收 `{ text, column, record, index }` |

### 嵌套规则

Provider 使用 Antdv ConfigProvider 的继承规则：外层未设置的值由更外层 Provider 或默认值补齐；内层显式设置的值只对当前子树生效。
