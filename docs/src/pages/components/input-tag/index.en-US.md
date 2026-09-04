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

## When To Use {#when-to-use}

Use it to enter string tags such as emails, keywords, or categories.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/separators.vue">Separators</demo>
  <demo src="./demo/trigger.vue">Custom trigger</demo>
  <demo src="./demo/save-on-blur.vue">Save on blur</demo>
  <demo src="./demo/draggable.vue">Draggable</demo>
  <demo src="./demo/collapse.vue">Collapse tags</demo>
  <demo src="./demo/controlled.vue">Controlled</demo>
  <demo src="./demo/readonly.vue">Readonly and semantic</demo>
  <demo src="./demo/semantic.vue">Semantic styling</demo>
</demo-group>

## API {#api}

### Properties {#properties}

| Property | Description | Type | Default | Version | [Global Config](/components/config-provider#component-config) |
| --- | --- | --- | --- | --- | --- |
| prefixCls | Component class prefix | `string` | - | - | × |
| rootClass | Class applied to the component root | `string` | - | - | × |
| value | Controlled tag list | `string[]` | `[]` | - | × |
| defaultValue | Initial tag list | `string[]` | `[]` | - | × |
| inputValue | Controlled input value | `string` | `''` | - | × |
| defaultInputValue | Initial input value | `string` | `''` | - | × |
| placeholder | Input placeholder; shown only when both tags and input are empty | `string` | - | - | × |
| disabled | Disable the component | `boolean` | `false` | - | × |
| readonly | Make the component readonly | `boolean` | `false` | - | × |
| autoFocus | Autofocus the input | `boolean` | `false` | - | × |
| size | Input size | `SizeType` | - | - | × |
| status | Input status | `InputProps['status']` | - | - | × |
| variant | Input variant | `Variant` | - | - | × |
| maxCount | Maximum number of tags | `number` | - | - | ✓ |
| tokenSeparators | Separators used to split tags when submitting with the trigger key | `string[]` | `[]` | - | ✓ |
| allowDuplicate | Allow duplicate tags | `boolean` | `false` | - | ✓ |
| allowClear | Show the clear action | `boolean` | `false` | - | ✓ |
| trigger | Key used to submit a tag | `'enter' \| 'space'` | `'enter'` | - | × |
| saveOnBlur | Submit the input value on blur | `boolean` | `false` | - | × |
| draggable | Allow tags to be reordered by dragging | `boolean` | `false` | - | × |
| collapseTags | Collapse tags | `boolean` | `false` | - | × |
| collapseTagsTooltip | Show collapsed tags in a Tooltip | `boolean` | `false` | - | × |
| maxCollapseTags | Maximum visible tags when collapsed | `number` | `1` | - | × |
| inputProps | Props passed to the internal Input; see [Input](https://www.antdv-next.cn/components/input#input). Controlled values, state, interaction events, and prefix/suffix are managed by InputTag | `InputTagInputProps` | - | - | × |
| tagProps | Props passed to each internal Tag; see [Tag](https://www.antdv-next.cn/components/tag). `closable`, `disabled`, and `onClose` are managed by InputTag | `InputTagTagProps` | - | - | × |
| classes | Semantic structure classes | `InputTagClassNamesType` | - | - | ✓ |
| styles | Semantic structure styles | `InputTagStylesType` | - | - | ✓ |

### Events {#events}

| Event | Description | Type | Version |
| --- | --- | --- | --- |
| change | Triggered when the tag list changes, with the change source | `(value: string[], info: InputTagChangeInfo) => void` | - |
| inputChange | Triggered when the input value changes | `(value: string, event?: Event) => void` | - |
| add | Triggered after a tag is added; emitted once per tag for batch additions | `(value: string, info: { index: number, event?: Event }) => void` | - |
| remove | Triggered after a tag is removed | `(value: string, info: { index: number, trigger: 'tag-remove' \| 'backspace', event?: Event }) => void` | - |
| clear | Triggered after the clear action is clicked | `(event: MouseEvent) => void` | - |
| pressEnter | Triggered when the input receives Enter | `(inputValue: string, event: KeyboardEvent) => void` | - |
| dragTag | Triggered after tags are reordered by dragging | `(oldIndex: number, newIndex: number, value: string, event?: DragEvent) => void` | - |
| focus | Triggered when the input receives focus | `(event: FocusEvent) => void` | - |
| blur | Triggered when the input loses focus | `(event: FocusEvent) => void` | - |

The `change` event's `info.trigger` identifies the change source: `enter`, `space`, `blur`, `token-separator`, `drag`, `tag-remove`, `backspace`, or `clear`.

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| prefix | Content before the tag list | - | - |
| suffix | Content at the end of the input | - | - |
| clearIcon | Custom clear icon | - | - |
| tag | Custom tag content | `{ value: string, index: number, closable: boolean, onClose: (event: MouseEvent) => void }` | - |

> The `tag` slot only applies to tags in the main content area. When `collapseTagsTooltip` is enabled, collapsed tags inside the Tooltip are purely presentational and do **not** use the `tag` slot, but still apply `tagProps` and the `classes.tag` / `styles.tag` semantic styles.


### Methods {#methods}

The component `ref` exposes the following API:

| Name | Description | Parameters | Version |
| --- | --- | --- | --- |
| focus | Focus the input | `(options?: FocusOptions)` | - |
| blur | Blur the input | - | - |
| input | Reference to the internal native input | - | - |
| nativeElement | Reference to the component root element | - | - |

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Token {#design-token}

<ComponentTokenTable component="InputTag"></ComponentTokenTable>

## FAQ {#faq}

#### How does `tokenSeparators` work?

Tags are split and committed immediately when a separator is typed, identified by the `token-separator` change trigger. For example, with `[',', ' ']` configured, typing `one, two,` creates the tags `one` and `two` in order; the separators themselves are not kept in the input.

#### How does `allowDuplicate` detect duplicates?

Duplicates are detected by strict string equality (case-sensitive). For example, `Vue` and `vue` are not considered duplicates and can coexist.

#### How is the insertion position decided when dragging tags?

With `draggable` enabled, hovering a dragged tag over a target tag inserts it based on the mouse position: the **left half** of the target inserts the tag before it, the **right half** inserts it after. An insertion indicator line is shown on the target tag while dragging.

#### Which properties do `inputProps` / `tagProps` support?

`inputProps` supports non-conflicting Input properties such as `showCount`, `maxlength`, `autocomplete`, and `inputMode`; `tagProps` supports non-conflicting Tag properties such as `color`, `bordered`, `variant`, `icon`, and `closeIcon`.

InputTag top-level properties control the component state. Therefore, `value`, `disabled`, `readonly`, `size`, `status`, `variant`, `allowClear`, `prefix`, `suffix`, and related input events in `inputProps` cannot override InputTag's internal behavior.
