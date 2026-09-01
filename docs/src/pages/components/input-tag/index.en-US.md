---
category: Pro Components
title: InputTag
description: Text tag input without dropdown or search behavior.
demo:
  cols: 1
group:
  title: Data Entry
  order: 2
---

## When To Use

Use it to enter string tags such as emails, keywords, or categories.

## Examples

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/separators.vue">Separators</demo>
  <demo src="./demo/controlled.vue">Controlled</demo>
  <demo src="./demo/readonly.vue">Readonly and semantic</demo>
</demo-group>

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| value / defaultValue | Tag list | `string[]` | `[]` |
| inputValue / defaultInputValue | Editor text | `string` | `''` |
| tokenSeparators | Separators that commit tags | `string[]` | `[]` |
| allowDuplicate | Allow duplicate tags | `boolean` | `false` |
| maxCount | Maximum tag count | `number` | - |
| allowClear | Show clear action | `boolean` | `false` |
| disabled / readonly | Disable or make readonly | `boolean` | `false` |
| classes / styles | Semantic structure styling | `InputTagClassNamesType` / `InputTagStylesType` | - |

### Events

Supports `update:value`, `change`, `update:inputValue`, `inputChange`, `add`, `remove`, `clear`, `pressEnter`, `focus`, and `blur`.

### Design Tokens

Customize `tagGap` and `inputMinWidth` through `theme.components.InputTag`.
