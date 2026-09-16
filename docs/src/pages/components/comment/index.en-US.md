---
category: Pro Components
title: Comment
description: Display comments, replies, and discussions.
demo:
  cols: 1
group:
  title: Data Display
  order: 2
---

## When To Use {#when-to-use}

- Display comments and replies on documents, issues, and tasks.
- Display user discussions such as AI feedback and approval notes.
- Get consistent author, avatar, datetime, actions, and nesting conventions without rebuilding `Avatar + Flex` every time.

`Comment` is a presentational component. It does not handle data fetching, pagination, sorting, submission, deletion, like state, or comment-tree conversion, and it never parses HTML or Markdown. Those belong to the business layer.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/actions.vue">Custom actions</demo>
  <demo src="./demo/datetime.vue">Datetime placement</demo>
  <demo src="./demo/nested.vue">Nested comments</demo>
  <demo src="./demo/semantic.vue">Semantic styling</demo>
</demo-group>

## API {#api}

### Properties {#properties}

| Property | Description | Type | Default | Version | [Global Config](/components/config-provider#component-config) |
| --- | --- | --- | --- | --- | --- |
| prefixCls | Component class prefix | `string` | - | - | × |
| rootClass | Class applied to the component root | `string` | - | - | × |
| author | Comment author. A `string` renders as plain text. | `string \| VNode` | - | - | × |
| avatar | Avatar image URL. It is forwarded to `Avatar`'s `src`, and `author` becomes the image `alt`. | `string` | - | - | × |
| datetime | Comment time. The component never formats it. | `string \| VNode` | - | - | × |
| content | Comment body. The component never parses HTML or Markdown. | `string \| VNode` | - | - | × |
| actions | Comment actions. A string matching a built-in action name (see [Actions](#actions)) renders as a plain icon; any other string renders as-is. | `(string \| VNode)[]` | - | - | × |
| datetimePlacement | How the datetime is placed relative to the author. | `'inline' \| 'block'` | `'inline'` | - | ✓ |
| align | Alignment of the datetime within its row, using a logical direction that mirrors in RTL. | `'start' \| 'end'` | `'start'` | - | ✓ |
| classes | Customize semantic classes with an object or function. | `CommentClassNamesType` | - | - | ✓ |
| styles | Customize semantic inline styles with an object or function. | `CommentStylesType` | - | - | ✓ |

> A slot with the same name always wins over the prop: passing both `author` and `#author` renders the slot.

### Slots {#slots}

| Slot | Description | Type | Version |
| --- | --- | --- | --- |
| avatar | Custom avatar, such as initials, an icon, or an `Avatar`. | `() => any` | - |
| author | Custom author, such as a link or a tag. | `() => any` | - |
| datetime | Custom datetime, for example wrapped in a Tooltip. | `() => any` | - |
| content | Custom body, such as images or code blocks. | `() => any` | - |
| actions | Custom actions. Use real interactive controls. | `() => any` | - |
| default | Nested comments. | `() => any` | - |

## Nested comments {#nested-comments}

Child comments go in the default slot; the component does not limit the depth. Deep nesting inflates both DOM depth and horizontal space, so limit the recursion depth in the business layer, usually to three levels. The indent derives from the avatar size; override `paddingInlineStart` through `styles.children` to change it.

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

`avatar`, `header`, `body`, `actions`, and `children` render only when they have content. Containers carry token-driven spacing, so the component never emits a placeholder node that would add a stray gap.

## Accessibility {#accessibility}

- The component is not an interactive control and never adds `role="button"` or `role="link"`.
- When the image is passed through the `avatar` prop, `author` becomes the image `alt`. With the `#avatar` slot, that is up to the caller.
- `datetime` renders as plain text. Wrap your own `<time>` in the `#datetime` slot when a machine-readable value is required.
- Built-in action names in `actions` render as plain icons carrying `role="img"` and `aria-label`; they stay out of the tab order and are never announced as buttons. For interactive actions, use real controls such as `a-button` inside the `#actions` slot. Do not bind `@click` to a `span`.

## Design Tokens {#design-tokens}

Customize Comment with `theme.components.Comment`. Every default derives from global Tokens.

<ComponentTokenTable component="Comment" />
