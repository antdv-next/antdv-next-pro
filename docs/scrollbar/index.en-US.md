---
category: Pro Components
title: Scrollbar
description: A custom dual-axis scrollbar container for Pro layouts and dense navigation areas.
demo:
  cols: 1
group:
  title: Navigation
  order: 1
---

## When To Use

- When the native scrollbar is visually too heavy for dense Pro layouts.
- When you need a fixed-height navigation or content area with both vertical and horizontal scrolling.
- When you want semantic `classes` and `styles` control for the scrollbar structure.
- When you want auto-mode overlays to disappear after the pointer leaves the content area for a while.

## Examples

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/visibility.vue">Visibility modes</demo>
  <demo src="./demo/sider.vue">Navigation sider</demo>
  <demo src="./demo/controller.vue">Events and scroll control</demo>
  <demo src="./demo/semantic.vue">Semantic styling</demo>
</demo-group>

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| visibility | Shared visibility strategy for both axes | `'auto' \| 'always' \| 'hidden'` | `'auto'` |
| visibilityX | Visibility strategy for horizontal scrollbar | `'auto' \| 'always' \| 'hidden'` | - |
| visibilityY | Visibility strategy for vertical scrollbar | `'auto' \| 'always' \| 'hidden'` | - |
| hideDelay | Delay in milliseconds before auto-mode overlays hide after the pointer leaves the content area | `number` | `1200` |
| native | Use native browser scrollbars and disable overlay thumbs | `boolean` | `false` |
| classes | Customize semantic class names. Supports object or function. | `Record<[SemanticDOM](#semantic-dom), string> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), string>` | - |
| styles | Customize semantic inline styles. Supports object or function. | `Record<[SemanticDOM](#semantic-dom), CSSProperties> \| (info: { props }) => Record<[SemanticDOM](#semantic-dom), CSSProperties>` | - |

### Events

| Event | Description | Type |
| --- | --- | --- |
| scroll | Triggered when the native scroll container scrolls | `(event: Event) => void` |

### Methods

The component `ref` exposes the following instance API:

| Name | Description | Type |
| --- | --- | --- |
| scrollTo | Scroll to a target position with native `ScrollToOptions` or `(left, top)` arguments | `(options: ScrollToOptions) => void; (left: number, top?: number) => void` |
| containerRef | Native scroll container reference | `ShallowRef<HTMLElement \| undefined>` |

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>
