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

## 何时使用 {#when-to-use}

适合录入邮箱、关键词、分类等字符串标签。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基础用法</demo>
  <demo src="./demo/separators.vue">分隔符</demo>
  <demo src="./demo/trigger.vue">自定义触发键</demo>
  <demo src="./demo/save-on-blur.vue">失焦保存</demo>
  <demo src="./demo/draggable.vue">拖拽排序</demo>
  <demo src="./demo/collapse.vue">标签折叠</demo>
  <demo src="./demo/controlled.vue">受控用法</demo>
  <demo src="./demo/readonly.vue">只读与语义化</demo>
  <demo src="./demo/semantic.vue">语义化样式</demo>
</demo-group>

## API {#api}

### 属性 {#properties}

| 参数 | 说明 | 类型 | 默认值 | 版本 | [全局配置](/components/config-provider-cn#component-config) |
| --- | --- | --- | --- | --- | --- |
| prefixCls | 组件样式前缀 | `string` | - | - | × |
| rootClass | 组件根元素 class | `string` | - | - | × |
| value | 受控标签列表 | `string[]` | `[]` | - | × |
| defaultValue | 初始标签列表 | `string[]` | `[]` | - | × |
| inputValue | 受控输入内容 | `string` | `''` | - | × |
| defaultInputValue | 初始输入内容 | `string` | `''` | - | × |
| placeholder | 输入占位符；标签列表和输入内容都为空时显示 | `string` | - | - | × |
| disabled | 是否禁用组件 | `boolean` | `false` | - | × |
| readonly | 是否只读 | `boolean` | `false` | - | × |
| autoFocus | 是否自动聚焦输入框 | `boolean` | `false` | - | × |
| size | 输入框尺寸 | `SizeType` | - | - | × |
| status | 输入框状态 | `InputProps['status']` | - | - | × |
| variant | 输入框变体 | `Variant` | - | - | × |
| maxCount | 最大标签数量 | `number` | - | - | ✓ |
| tokenSeparators | 按触发键提交时用于拆分标签的分隔符 | `string[]` | `[]` | - | ✓ |
| allowDuplicate | 是否允许重复标签 | `boolean` | `false` | - | ✓ |
| allowClear | 是否显示清空按钮 | `boolean` | `false` | - | ✓ |
| trigger | 标签提交触发键 | `'enter' \| 'space'` | `'enter'` | - | × |
| saveOnBlur | 失焦时是否提交输入内容 | `boolean` | `false` | - | × |
| draggable | 是否允许拖拽排序 | `boolean` | `false` | - | × |
| collapseTags | 是否折叠标签 | `boolean` | `false` | - | × |
| collapseTagsTooltip | 是否通过 Tooltip 显示折叠标签 | `boolean` | `false` | - | × |
| maxCollapseTags | 折叠时最多显示的标签数量 | `number` | `1` | - | × |
| inputProps | 传给内部 Input 的属性，详情参考 [Input Props](https://www.antdv-next.cn/components/input-cn#input-props)；受控值、状态、交互事件和 prefix/suffix 等由 InputTag 管理 | `InputTagInputProps` | - | - | × |
| tagProps | 传给每个内部 Tag 的属性，详情参考 [Tag Props](https://www.antdv-next.cn/components/tag-cn#tag-props)；`closable`、`disabled` 和 `onClose` 由 InputTag 管理 | `InputTagTagProps` | - | - | × |
| classes | 语义化结构 class | `InputTagClassNamesType` | - | - | ✓ |
| styles | 语义化结构样式 | `InputTagStylesType` | - | - | ✓ |

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 标签列表变化时触发，并返回变化来源 | `(value: string[], info: InputTagChangeInfo) => void` | - |
| inputChange | 输入内容变化时触发 | `(value: string, event?: Event) => void` | - |
| add | 添加标签后触发；批量添加时逐个触发 | `(value: string, info: { index: number, event?: Event }) => void` | - |
| remove | 删除标签后触发 | `(value: string, info: { index: number, trigger: 'tag-remove' \| 'backspace', event?: Event }) => void` | - |
| clear | 点击清空按钮后触发 | `(event: MouseEvent) => void` | - |
| pressEnter | 输入框触发 Enter 时触发 | `(inputValue: string, event: KeyboardEvent) => void` | - |
| dragTag | 拖拽调整标签顺序后触发 | `(oldIndex: number, newIndex: number, value: string, event?: DragEvent) => void` | - |
| focus | 输入框获得焦点时触发 | `(event: FocusEvent) => void` | - |
| blur | 输入框失去焦点时触发 | `(event: FocusEvent) => void` | - |

`change` 事件的 `info.trigger` 用于标识变化来源，包括 `enter`、`space`、`blur`、`token-separator`、`drag`、`tag-remove`、`backspace` 和 `clear`。

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| prefix | 标签列表前的内容 | - | - |
| suffix | 输入框末尾的内容 | - | - |
| clearIcon | 自定义清空图标 | - | - |
| tag | 自定义标签内容 | `{ value: string, index: number, closable: boolean, onClose: (event: MouseEvent) => void }` | - |

> `tag` 插槽仅作用于主内容区的标签。开启 `collapseTagsTooltip` 后，Tooltip 内展示的折叠标签为纯展示内容，**不会**应用 `tag` 插槽，但仍会应用 `tagProps` 以及 `classes.tag` / `styles.tag` 语义化样式。


### 方法 {#methods}

组件 `ref` 会暴露以下实例能力：

| 名称 | 说明 | 参数 | 版本 |
| --- | --- | --- | --- |
| focus | 聚焦输入框 | `(options?: FocusOptions)` | - |
| blur | 使输入框失焦 | - | - |
| input | 获取内部原生 input 引用 | - | - |
| nativeElement | 获取组件根元素引用 | - | - |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="InputTag"></ComponentTokenTable>

## FAQ {#faq}

#### `tokenSeparators` 是如何工作的？

输入过程中遇到分隔符会立即拆分并提交标签，触发来源标识为 `token-separator`。例如配置 `[',', ' ']` 后，输入 `one, two,` 会依次生成 `one` 和 `two` 两个标签，分隔符本身不会保留在输入框中。

#### `allowDuplicate` 如何判断两个标签是否重复？

基于严格字符串相等（区分大小写）。例如 `Vue` 与 `vue` 不视为重复，可以同时存在。

#### 拖拽标签时如何决定插入位置？

开启 `draggable` 后，拖拽标签悬停在目标标签上时，根据鼠标位于目标标签的**左半区还是右半区**决定插入位置：左半区插入到目标之前，右半区插入到目标之后。拖拽过程中目标标签会显示对应的插入位置指示线。

#### `inputProps` / `tagProps` 支持哪些属性？

`inputProps` 支持内部 Input 的非冲突属性，例如 `showCount`、`maxlength`、`autocomplete` 和 `inputMode`；`tagProps` 支持内部 Tag 的非冲突属性，例如 `color`、`bordered`、`variant`、`icon` 和 `closeIcon`。

InputTag 顶层属性优先控制组件状态，因此 `inputProps` 中的 `value`、`disabled`、`readonly`、`size`、`status`、`variant`、`allowClear`、`prefix`、`suffix` 以及相关输入事件不会覆盖 InputTag 的内部行为。
