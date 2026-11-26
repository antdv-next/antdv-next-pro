---
category: Pro Components
title: CategorySearch
subtitle: 分类搜索
description: 先选择维度，再按维度类型编辑值，把筛选条件以标签形式放在一个输入框里。
demo:
  cols: 2
group:
  title: Data Entry
  order: 2
---

## 何时使用 {#when-to-use}

- 列表页顶部需要组合多个筛选条件，又不想铺开一整块表单时。
- 不同维度的值类型不同（单选、多选、日期区间、数字区间、文本），需要在同一个输入框里统一编辑时。

CategorySearch 是纯输入组件，只产出筛选条件和关键字，不负责请求数据、分页或保存过滤器。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基础用法</demo>
  <demo src="./demo/group.vue">维度分组</demo>
  <demo src="./demo/search.vue">关键字搜索</demo>
  <demo src="./demo/closable.vue">不可删除的条件</demo>
  <demo src="./demo/before-change.vue">变更拦截</demo>
  <demo src="./demo/custom.vue">自定义面板与标签</demo>
  <demo src="./demo/save-filter.vue">保存过滤器</demo>
  <demo src="./demo/max-tag.vue">标签折叠</demo>
  <demo src="./demo/field-names.vue">自定义字段名</demo>
  <demo src="./demo/size.vue">尺寸、变体与状态</demo>
  <demo src="./demo/table.vue">配合 Table 筛选</demo>
  <demo src="./demo/semantic.vue">语义化样式</demo>
</demo-group>

## API {#api}

### 属性 {#properties}

| 属性 | 说明 | 类型 | 默认值 | 版本 | [全局配置](/components/config-provider-cn#component-config) |
| --- | --- | --- | --- | --- | --- |
| prefixCls | 组件样式前缀 | `string` | - | - | × |
| rootClass | 组件根元素 class | `string` | - | - | × |
| options | 可选维度，支持分组 | `(CategorySearchOption \| CategorySearchOptionGroup)[]` | `[]` | - | × |
| fieldNames | 自定义 options 中 `label`、`value`、`children`、`options` 的字段名 | `CategorySearchFieldNames` | - | - | × |
| value(v-model) | 已选条件 | `CategorySearchValueItem[]` | - | - | × |
| defaultValue | 初始已选条件 | `CategorySearchValueItem[]` | `[]` | - | × |
| searchValue(v-model) | 关键字 | `string` | - | - | × |
| defaultSearchValue | 初始关键字 | `string` | `''` | - | × |
| showSearch | 是否允许输入关键字 | `boolean` | `true` | - | ✓ |
| placeholder | 占位文字；没有标签和关键字时显示 | `string` | 读取 locale | - | × |
| allowClear | 是否显示清空按钮；清空时保留 `closable: false` 的条件 | `boolean \| { clearIcon?: VueNode }` | `false` | - | ✓ |
| disabled | 是否禁用，默认跟随 ConfigProvider | `boolean` | `false` | - | × |
| size | 尺寸 | `'small' \| 'middle' \| 'large'` | - | - | × |
| variant | 变体 | `'outlined' \| 'borderless' \| 'filled' \| 'underlined'` | `'outlined'` | - | ✓ |
| status | 校验状态，默认跟随 Form.Item | `'error' \| 'warning'` | - | - | × |
| maxTagCount | 最多显示的标签数，其余折叠 | `number` | - | - | ✓ |
| maxTagTextLength | 标签中值文字的最大长度，超出显示 `...` | `number` | - | - | × |
| maxTagPlaceholder | 折叠标签的内容 | `VueNode \| (omittedValues: CategorySearchValueItem[]) => VueNode` | `+ N ...` | - | × |
| open(v-model) | 浮层是否展开 | `boolean` | - | - | × |
| defaultOpen | 浮层默认是否展开 | `boolean` | `false` | - | × |
| placement | 浮层位置，RTL 下自动镜像 | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'` | `'bottomLeft'` | - | × |
| getPopupContainer | 浮层渲染的父节点 | `(triggerNode: HTMLElement) => HTMLElement` | - | - | × |
| popupMatchSelectWidth | 浮层是否与输入框同宽；为数字时设置固定宽度 | `boolean \| number` | `false` | - | × |
| labelRender | 自定义标签里值的显示，优先级低于同名插槽 | `(info: { option, item }) => VueNode` | - | - | × |
| beforeChange | 增、改、删、清空前调用，返回 `false` 或 reject 时取消变更 | `(info: CategorySearchChangeInfo) => boolean \| void \| Promise<boolean \| void>` | - | - | × |
| classes | 语义化结构 class，支持对象或函数 | `CategorySearchClassNamesType` | - | - | ✓ |
| styles | 语义化结构样式，支持对象或函数 | `CategorySearchStylesType` | - | - | ✓ |

### CategorySearchOption {#category-search-option}

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 维度名称 | `VueNode` | - |
| value | 维度标识，对应已选条件的 `key` | `string \| number` | - |
| type | 值类型 | `'select' \| 'dateRange' \| 'numberRange' \| 'input' \| 'custom'` | `'select'` |
| children | `type` 为 `select` 时的候选值，结构同 Select 的 option | `{ label, value, disabled }[]` | - |
| multiple | `type` 为 `select` 时是否多选 | `boolean` | `false` |
| closable | 生成的标签是否可删除 | `boolean` | `true` |
| disabled | 是否禁用该维度 | `boolean` | `false` |
| componentProps | 透传给值编辑控件：多选为 Checkbox.Group，`dateRange` 为 RangePicker，`numberRange` 为 InputNumber，`input` 为 Input | `Record<string, any>` | - |

分组写作 `{ label, key?, options: CategorySearchOption[] }`，与 Select 一致。

### 值的结构 {#value}

`value` 是 `{ key, value }[]`，`key` 对应维度的 `value`，同一维度最多出现一次；再次选择同一维度会编辑已有标签，不会新增。`value` 的结构由维度的 `type` 决定：

| type | value |
| --- | --- |
| `select`（单选） | 候选值的 `value` |
| `select`（多选） | `(string \| number)[]` |
| `dateRange` | 与 RangePicker 的 value 一致；传了 `componentProps.valueFormat` 时为字符串数组 |
| `numberRange` | `[min, max]`，任意一端可以是 `null`；最小值大于最大值时自动交换 |
| `input` | `string` |
| `custom` | 由 `panel` 插槽决定 |

提交空值（未选、空字符串、两端都为空的区间）等同于删除该条件。

### 事件 {#events}

| 事件 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| change | 已选条件变化时触发 | `(value: CategorySearchValueItem[], info: CategorySearchChangeInfo) => void` | - |
| search | 在输入框按 Enter 时触发 | `(searchValue: string, value: CategorySearchValueItem[]) => void` | - |
| clear | 点击清空按钮后触发 | `() => void` | - |
| openChange | 浮层展开状态变化时触发 | `(open: boolean) => void` | - |
| focus | 输入框获得焦点时触发 | `(event: FocusEvent) => void` | - |
| blur | 输入框失去焦点时触发 | `(event: FocusEvent) => void` | - |

`CategorySearchChangeInfo` 为 `{ type: 'add' \| 'update' \| 'remove' \| 'clear', option?, item?, prevItem? }`。

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| prefix | 标签之前的内容 | - | - |
| suffix | 输入框末尾的内容，可放“保存过滤器”等按钮 | - | - |
| clearIcon | 自定义清空图标 | - | - |
| tag | 自定义整个标签 | `{ option, item, label, closable, onClose }` | - |
| labelRender | 自定义标签里值的显示 | `{ option, item }` | - |
| optionRender | 自定义维度列表项 | `{ option }` | - |
| panel | `type: 'custom'` 的值面板 | `{ option, value, setValue, confirm, cancel }` | - |
| maxTagPlaceholder | 折叠标签的内容 | `{ omittedValues }` | - |
| notFoundContent | 没有维度或候选值时的内容 | - | - |

### 方法 {#methods}

| 名称 | 说明 | 参数 | 版本 |
| --- | --- | --- | --- |
| focus | 聚焦输入框 | `(options?: FocusOptions)` | - |
| blur | 使输入框失焦 | - | - |
| open | 打开浮层；传入维度 `value` 时直接打开该维度的值面板 | `(optionValue?: string \| number)` | - |
| nativeElement | 组件根元素 | - | - |

## 键盘交互 {#keyboard}

| 按键 | 行为 |
| --- | --- |
| ↓ / ↑ | 打开维度列表；在维度列表或单选候选值中移动 |
| Enter | 打开当前维度的值面板 / 选中当前候选值；没有高亮项时触发 `search` |
| Esc | 在值面板中返回维度列表；在维度列表中关闭浮层 |
| Backspace | 关键字为空时删除最后一个可删除的标签 |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

浮层的语义节点写在 `classes.popup` / `styles.popup` 下：`root`（浮层根节点）、`list`（维度列表）、`panel`（值面板）。

## 主题变量（Design Token）{#design-token}

<ComponentTokenTable component="CategorySearch"></ComponentTokenTable>

## FAQ {#faq}

#### 为什么保存过滤器、“更多”菜单没有内置？

CategorySearch 只负责产出筛选条件。保存和恢复过滤器涉及存储和业务逻辑，可以在 `suffix` 插槽里放按钮自行实现，参考“保存过滤器”示例。

#### 怎么接 treeSelect、彩色标签等其他值类型？

使用 `type: 'custom'` 和 `panel` 插槽渲染任意控件，调用 `setValue` 更新草稿、`confirm` 提交；再用 `labelRender` 自定义标签里的显示。
