---
category: Pro Components
title: CategorySearch
description: Pick a dimension first, then edit its value by type, keeping all filter conditions as tags inside one input.
demo:
  cols: 2
group:
  title: Data Entry
  order: 2
---

## When To Use {#when-to-use}

- A list page needs several combined filters without laying out a whole form.
- Dimensions have different value types (single select, multiple select, date range, number range, text) and should be edited in one input.

CategorySearch is a pure input component. It only produces filter conditions and a keyword; it does not fetch data, paginate or save filters.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/group.vue">Grouped dimensions</demo>
  <demo src="./demo/search.vue">Keyword search</demo>
  <demo src="./demo/closable.vue">Non-removable conditions</demo>
  <demo src="./demo/before-change.vue">Intercept changes</demo>
  <demo src="./demo/custom.vue">Custom panel and tag</demo>
  <demo src="./demo/save-filter.vue">Save filters</demo>
  <demo src="./demo/max-tag.vue">Collapse tags</demo>
  <demo src="./demo/field-names.vue">Custom field names</demo>
  <demo src="./demo/size.vue">Size, variant and status</demo>
  <demo src="./demo/table.vue">Filter a Table</demo>
  <demo src="./demo/semantic.vue">Semantic styles</demo>
</demo-group>

## API {#api}

### Properties {#properties}

| Property | Description | Type | Default | Version | [Global Config](/components/config-provider#component-config) |
| --- | --- | --- | --- | --- | --- |
| prefixCls | Style prefix of the component | `string` | - | - | × |
| rootClass | Class of the root element | `string` | - | - | × |
| options | Dimensions, groups supported | `(CategorySearchOption \| CategorySearchOptionGroup)[]` | `[]` | - | × |
| fieldNames | Custom field names of `label`, `value`, `children` and `options` | `CategorySearchFieldNames` | - | - | × |
| value(v-model) | Selected conditions | `CategorySearchValueItem[]` | - | - | × |
| defaultValue | Initial selected conditions | `CategorySearchValueItem[]` | `[]` | - | × |
| searchValue(v-model) | Keyword | `string` | - | - | × |
| defaultSearchValue | Initial keyword | `string` | `''` | - | × |
| showSearch | Whether a keyword can be typed | `boolean` | `true` | - | ✓ |
| placeholder | Placeholder shown when there is no tag or keyword | `string` | from locale | - | × |
| allowClear | Whether to show the clear button; conditions with `closable: false` are kept | `boolean \| { clearIcon?: VueNode }` | `false` | - | ✓ |
| disabled | Whether disabled; follows ConfigProvider by default | `boolean` | `false` | - | × |
| size | Size | `'small' \| 'middle' \| 'large'` | - | - | × |
| variant | Variant | `'outlined' \| 'borderless' \| 'filled' \| 'underlined'` | `'outlined'` | - | ✓ |
| status | Validation status; follows Form.Item by default | `'error' \| 'warning'` | - | - | × |
| maxTagCount | Max number of visible tags; the rest are collapsed | `number` | - | - | ✓ |
| maxTagTextLength | Max length of the value text in a tag; longer text ends with `...` | `number` | - | - | × |
| maxTagPlaceholder | Content of the collapsed tag | `VueNode \| (omittedValues: CategorySearchValueItem[]) => VueNode` | `+ N ...` | - | × |
| open(v-model) | Whether the popup is open | `boolean` | - | - | × |
| defaultOpen | Whether the popup is open initially | `boolean` | `false` | - | × |
| placement | Popup placement, mirrored in RTL | `'bottomLeft' \| 'bottomRight' \| 'topLeft' \| 'topRight'` | `'bottomLeft'` | - | × |
| getPopupContainer | Parent node of the popup | `(triggerNode: HTMLElement) => HTMLElement` | - | - | × |
| popupMatchSelectWidth | Whether the popup matches the input width; a number sets a fixed width | `boolean \| number` | `false` | - | × |
| labelRender | Custom display of the value inside a tag; the slot of the same name takes priority | `(info: { option, item }) => VueNode` | - | - | × |
| beforeChange | Called before add / update / remove / clear; return `false` or reject to cancel | `(info: CategorySearchChangeInfo) => boolean \| void \| Promise<boolean \| void>` | - | - | × |
| classes | Semantic classes, object or function | `CategorySearchClassNamesType` | - | - | ✓ |
| styles | Semantic styles, object or function | `CategorySearchStylesType` | - | - | ✓ |

### CategorySearchOption {#category-search-option}

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| label | Dimension name | `VueNode` | - |
| value | Dimension id, matches `key` of a selected item | `string \| number` | - |
| type | Value type | `'select' \| 'dateRange' \| 'numberRange' \| 'input' \| 'custom'` | `'select'` |
| children | Candidate values when `type` is `select`, same shape as Select options | `{ label, value, disabled }[]` | - |
| multiple | Whether `select` allows multiple values | `boolean` | `false` |
| closable | Whether the generated tag can be removed | `boolean` | `true` |
| disabled | Whether the dimension is disabled | `boolean` | `false` |
| componentProps | Props passed to the value editor: Checkbox.Group for multiple select, RangePicker for `dateRange`, InputNumber for `numberRange`, Input for `input` | `Record<string, any>` | - |

A group is written as `{ label, key?, options: CategorySearchOption[] }`, the same as Select.

### Value {#value}

`value` is `{ key, value }[]`. `key` is the dimension `value`, and each dimension appears at most once; choosing a dimension again edits the existing tag instead of adding one. The shape of `value` depends on the dimension `type`:

| type | value |
| --- | --- |
| `select` (single) | The candidate `value` |
| `select` (multiple) | `(string \| number)[]` |
| `dateRange` | Same as the RangePicker value; strings when `componentProps.valueFormat` is set |
| `numberRange` | `[min, max]`, either end may be `null`; swapped automatically when min > max |
| `input` | `string` |
| `custom` | Decided by the `panel` slot |

Committing an empty value (nothing selected, an empty string, or a range with both ends empty) removes the condition.

### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Fired when the selected conditions change | `(value: CategorySearchValueItem[], info: CategorySearchChangeInfo) => void` | - |
| search | Fired when Enter is pressed in the input | `(searchValue: string, value: CategorySearchValueItem[]) => void` | - |
| clear | Fired after the clear button is clicked | `() => void` | - |
| openChange | Fired when the popup opens or closes | `(open: boolean) => void` | - |
| focus | Fired when the input gets focus | `(event: FocusEvent) => void` | - |
| blur | Fired when the input loses focus | `(event: FocusEvent) => void` | - |

`CategorySearchChangeInfo` is `{ type: 'add' \| 'update' \| 'remove' \| 'clear', option?, item?, prevItem? }`.

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| prefix | Content before the tags | - | - |
| suffix | Content at the end of the input, e.g. a "save filter" button | - | - |
| clearIcon | Custom clear icon | - | - |
| tag | Custom whole tag | `{ option, item, label, closable, onClose }` | - |
| labelRender | Custom display of the value inside a tag | `{ option, item }` | - |
| optionRender | Custom dimension list item | `{ option }` | - |
| panel | Value panel of `type: 'custom'` | `{ option, value, setValue, confirm, cancel }` | - |
| maxTagPlaceholder | Content of the collapsed tag | `{ omittedValues }` | - |
| notFoundContent | Content when there are no dimensions or candidates | - | - |

### Methods {#methods}

| Name | Description | Parameters | Version |
| --- | --- | --- | --- |
| focus | Focus the input | `(options?: FocusOptions)` | - |
| blur | Blur the input | - | - |
| open | Open the popup; with a dimension `value`, open that dimension's value panel directly | `(optionValue?: string \| number)` | - |
| nativeElement | Root element of the component | - | - |

## Keyboard {#keyboard}

| Key | Behavior |
| --- | --- |
| ↓ / ↑ | Open the dimension list; move within the dimension list or single-select candidates |
| Enter | Open the active dimension's panel / pick the active candidate; fires `search` when nothing is active |
| Esc | Go back to the dimension list from a value panel; close the popup from the list |
| Backspace | Remove the last removable tag when the keyword is empty |

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

Popup nodes live under `classes.popup` / `styles.popup`: `root` (popup root), `list` (dimension list) and `panel` (value panel).

## Design Token {#design-token}

<ComponentTokenTable component="CategorySearch"></ComponentTokenTable>

## FAQ {#faq}

#### Why are "save filter" and the "more" menu not built in?

CategorySearch only produces filter conditions. Saving and restoring filters involves storage and business logic; put a button in the `suffix` slot instead, see the "Save filters" example.

#### How do I support treeSelect, colored labels or other value types?

Use `type: 'custom'` with the `panel` slot to render any control, call `setValue` to update the draft and `confirm` to commit, then customize the tag display with `labelRender`.
