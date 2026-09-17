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

`Comment` is a presentational component. Data fetching, pagination, submission, deletion, and like state belong to the business layer. The component never parses HTML or Markdown.

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
| actions | Custom actions. `a-button` is recommended. | `() => any` | - |
| default | Nested comments. | `() => any` | - |

## Nested comments {#nested-comments}

Child comments go in the default slot; the component does not limit the depth. Limit the recursion depth in the business layer, usually to three levels. Adjust the indent through `styles.children`.

## Actions {#actions}

The actions area is entirely defined by the `#actions` slot. The component ships no built-in action names or icon mapping.

```vue
<a-comment author="Zhang San" content="...">
  <template #actions>
    <a-button type="text" size="small" @click="onLike">
      <template #icon><LikeOutlined /></template>
      {{ likes }}
    </a-button>
    <a-button type="text" size="small" danger @click="onDelete">
      <template #icon><DeleteOutlined /></template>
      Delete
    </a-button>
  </template>
</a-comment>
```

**`a-button type="text" size="small"` is recommended** for action items: it brings hover and focus feedback plus button semantics, and adding `danger` gives you the red treatment. Pass the icon through `<template #icon>` with a name from `@antdv-next/icons`.

Common action icons:

| Action | Icon |
| --- | --- |
| Reply / Comment | `MessageOutlined` |
| Like | `LikeOutlined` / `LikeFilled` |
| Dislike | `DislikeOutlined` |
| Edit | `EditOutlined` |
| Share | `ShareAltOutlined` |
| Copy | `CopyOutlined` |
| Delete / Remove | `DeleteOutlined` |
| Report | `WarningOutlined` |
| More | `EllipsisOutlined` |

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

`avatar`, `header`, `body`, `actions`, and `children` render only when they have content.

## Accessibility {#accessibility}

- The component itself carries no interaction logic and never emits events.
- When the image is passed through the `avatar` prop, `author` becomes the image `alt`. With the `#avatar` slot, that is up to the caller.
- `datetime` renders as plain text. Wrap your own `<time>` in the `#datetime` slot when a machine-readable value is required.
- Action items are supplied by the consumer: use real controls such as `a-button` with a bound `onClick`, and give icon-only buttons an `aria-label` (or visible text).

## Design Tokens {#design-tokens}

Customize Comment with `theme.components.Comment`. Every default derives from global Tokens.

<ComponentTokenTable component="Comment" />
