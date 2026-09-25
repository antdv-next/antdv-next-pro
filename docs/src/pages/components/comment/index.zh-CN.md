---
category: Pro Components
title: Comment
subtitle: 评论
description: 展示评论、回复与讨论内容。
demo:
  cols: 1
group:
  title: Data Display
  order: 2
---

## 何时使用 {#when-to-use}

- 展示文档、Issue、任务下的评论与回复。
- 展示 AI 对话反馈、审批意见等用户讨论内容。
- 需要统一的作者、头像、时间、操作与嵌套缩进约定，不想每次手写 `Avatar + Flex`。

`Comment` 是纯展示组件：数据请求、分页、提交、删除、点赞状态等都由业务层负责，组件不解析 HTML / Markdown。

## 代码演示 {#examples}

<demo-group>
  <demo src="./demo/basic.vue">基础用法</demo>
  <demo src="./demo/actions.vue">自定义操作</demo>
  <demo src="./demo/datetime.vue">时间位置</demo>
  <demo src="./demo/nested.vue">嵌套评论</demo>
  <demo src="./demo/semantic.vue">语义化样式</demo>
</demo-group>

## API {#api}

### 属性 {#properties}

| 属性 | 说明 | 类型 | 默认值 | 版本 | [全局配置](/components/config-provider-cn#component-config) |
| --- | --- | --- | --- | --- | --- |
| prefixCls | 组件样式前缀 | `string` | - | - | × |
| rootClass | 组件根元素 class | `string` | - | - | × |
| author | 评论作者，`string` 按纯文本渲染 | `string \| VNode` | - | - | × |
| avatar | 头像图片地址，内部转交 `Avatar` 的 `src`，并以 `author` 作为 `alt` | `string` | - | - | × |
| datetime | 评论时间，组件不做任何格式化 | `string \| VNode` | - | - | × |
| content | 评论正文，组件不做 HTML / Markdown 解析 | `string \| VNode` | - | - | × |
| datetimePlacement | 时间相对作者的排布方式 | `'inline' \| 'block'` | `'inline'` | - | ✓ |
| align | 时间在所在行内的对齐方式，逻辑方向，RTL 下自动镜像 | `'start' \| 'end'` | `'start'` | - | ✓ |
| classes | 自定义语义化 class，支持对象或函数 | `CommentClassNamesType` | - | - | ✓ |
| styles | 自定义语义化 style，支持对象或函数 | `CommentStylesType` | - | - | ✓ |

> 同名插槽始终优先于属性：同时传入 `author` 与 `#author` 时以插槽为准。

### 插槽 {#slots}

| 插槽 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| avatar | 自定义头像，可放文字头像、图标或 `Avatar` | `() => any` | - |
| author | 自定义作者，可放链接、标签等 | `() => any` | - |
| datetime | 自定义时间，可配合 Tooltip 展示完整时间 | `() => any` | - |
| content | 自定义正文，可放图片、代码块等 | `() => any` | - |
| actions | 自定义操作，建议使用 `a-button` | `() => any` | - |
| default | 嵌套评论 | `() => any` | - |

## 嵌套评论 {#nested-comments}

子评论放在默认插槽中即可，组件本身不限制嵌套层级。建议在业务层限制递归深度，通常不超过三层。缩进量可通过 `styles.children` 调整。

## 操作项 {#actions}

操作区完全由 `#actions` 插槽定义，组件不内置任何动作名或图标映射。

```vue
<a-comment author="Zhang San" content="...">
  <template #actions>
    <a-button type="text" size="small" @click="onLike">
      <template #icon><LikeOutlined /></template>
      {{ likes }}
    </a-button>
    <a-button type="text" size="small" danger @click="onDelete">
      <template #icon><DeleteOutlined /></template>
      删除
    </a-button>
  </template>
</a-comment>
```

操作项**建议使用 `a-button type="text" size="small"`**：它自带 hover / focus 反馈与按钮语义，危险操作加 `danger` 即可获得红色。图标通过 `<template #icon>` 传入，配合 `@antdv-next/icons` 使用。

常用动作的参考写法：

| 动作 | 图标 |
| --- | --- |
| 回复 / 评论 | `MessageOutlined` |
| 点赞 | `LikeOutlined` / `LikeFilled` |
| 点踩 | `DislikeOutlined` |
| 编辑 | `EditOutlined` |
| 分享 | `ShareAltOutlined` |
| 复制 | `CopyOutlined` |
| 删除 / 移除 | `DeleteOutlined` |
| 举报 | `WarningOutlined` |
| 更多 | `EllipsisOutlined` |

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

`avatar`、`header`、`body`、`actions`、`children` 只在其内容存在时渲染。

## 无障碍 {#accessibility}

- 组件自身不承载交互逻辑，不对外派发事件。
- 通过 `avatar` 属性传入图片时，组件会以 `author` 作为图片 `alt`；使用 `#avatar` 插槽时由使用方负责。
- `datetime` 渲染为普通文本。需要机器可读时间时，请在 `#datetime` 插槽内自行使用 `<time>`。
- `actions` 的操作项由使用方提供：请使用 `a-button` 等真实控件并绑定 `onClick`，纯图标按钮需要提供 `aria-label`（或可见文案）。

## 主题 Token {#design-tokens}

Comment 支持通过 `theme.components.Comment` 自定义组件样式 Token，默认值全部从全局 Token 派生。

<ComponentTokenTable component="Comment" />
