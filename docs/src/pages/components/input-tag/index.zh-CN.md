---
category: Pro Components
title: InputTag
subtitle: 标签输入
description: 用于录入文本标签的输入组件，不提供下拉或搜索行为。
demo:
  cols: 1
group:
  title: Data Entry
  order: 2
---

## 何时使用

适合录入邮箱、关键词、分类等字符串标签。

## 代码演示

<demo-group>
  <demo src="./demo/basic.vue">基础用法</demo>
  <demo src="./demo/separators.vue">分隔符</demo>
  <demo src="./demo/controlled.vue">受控用法</demo>
  <demo src="./demo/readonly.vue">只读与语义化</demo>
</demo-group>

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value / defaultValue | 标签列表 | `string[]` | `[]` |
| inputValue / defaultInputValue | 编辑器文本 | `string` | `''` |
| tokenSeparators | 提交标签的分隔符 | `string[]` | `[]` |
| allowDuplicate | 是否允许重复标签 | `boolean` | `false` |
| maxCount | 最大标签数量 | `number` | - |
| allowClear | 是否显示清空按钮 | `boolean` | `false` |
| disabled / readonly | 禁用或只读 | `boolean` | `false` |
| classes / styles | 语义化结构样式 | `InputTagClassNamesType` / `InputTagStylesType` | - |

### 事件

支持 `update:value`、`change`、`update:inputValue`、`inputChange`、`add`、`remove`、`clear`、`pressEnter`、`focus`、`blur`。

### 主题 Token

通过 `theme.components.InputTag` 配置 `tagGap` 和 `inputMinWidth`。
