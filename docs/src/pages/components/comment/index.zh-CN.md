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

`Comment` 是纯展示组件：不负责数据请求、分页、排序、提交、删除、点赞状态与评论树转换，也不解析 HTML / Markdown，这些都由业务层负责。

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
| actions | 评论操作，`string` 按纯文本渲染 | `(string \| VNode)[]` | - | - | × |
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
| actions | 自定义操作，请放真实的交互控件 | `() => any` | - |
| default | 嵌套评论 | `() => any` | - |

## 嵌套评论 {#nested-comments}

子评论放在默认插槽中即可，组件本身不限制嵌套层级。过深的层级会同时放大 DOM 深度和水平空间占用，建议业务层限制递归深度（通常不超过三层）。缩进量由头像尺寸决定，需要调整时可通过 `styles.children` 覆盖 `paddingInlineStart`。

## 操作项 {#actions}

`actions` 的每一项按三种方式渲染：

| 传入内容 | 渲染结果 |
| --- | --- |
| 命中内置动作名的字符串 | 纯图标，名称由 `aria-label` 与 `title` 承载 |
| 其它字符串 | 按传入文案原样渲染 |
| `VNode`，或 `#actions` 插槽 | 完全由使用方控制，可放按钮、图标与状态 |

内置动作名不区分大小写：

| 动作名 | 图标 |
| --- | --- |
| `reply` `comment` | 消息 |
| `like` | 点赞 |
| `dislike` | 点踩 |
| `edit` | 编辑 |
| `delete` `remove` | 删除 |
| `share` | 分享 |
| `copy` | 复制 |
| `flag` | 标记 |
| `star` `favorite` | 收藏 |
| `close` `cancel` | 关闭 |
| `more` `ellipsis` | 更多 |
| `back` | 返回 |
| `report` | 警示 |

> 内置动作名渲染为**纯图标而非按钮**：字符串条目没有地方挂载回调，渲染成按钮会给出「可点击」却没有响应的错误承诺，也会在纯展示组件里凭空制造可聚焦控件。图标本身不可交互，需要点击行为、禁用或二次确认时请使用 `#actions` 插槽。

这样组件无需内置一份需要翻译的动作文案表 —— 可见文案始终由业务层决定。

## 语义化 DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

`avatar`、`header`、`body`、`actions`、`children` 只在其内容存在时渲染。容器带有 Token 化的间距，组件不会为空内容补占位节点，以免凭空多出一份间距。

## 无障碍 {#accessibility}

- 组件本身不是交互控件，不会给任何节点附加 `role="button"` 或 `role="link"`。
- 通过 `avatar` 属性传入图片时，组件会以 `author` 作为图片 `alt`；使用 `#avatar` 插槽时由使用方负责。
- `datetime` 渲染为普通文本。需要机器可读时间时，请在 `#datetime` 插槽内自行使用 `<time>`。
- `actions` 中的内置动作名渲染为带 `role="img"` 与 `aria-label` 的纯图标，不进入 Tab 顺序，也不会被读作按钮。需要交互时请在 `#actions` 插槽内使用真实控件（如 `a-button`），不要用 `span` 配合 `@click`。

## 主题 Token {#design-tokens}

Comment 支持通过 `theme.components.Comment` 自定义组件样式 Token，默认值全部从全局 Token 派生。

<ComponentTokenTable component="Comment" />
