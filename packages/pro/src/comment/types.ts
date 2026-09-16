import type { CSSProperties, VNode } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/semantic'

/**
 * datetime 相对 author 的排布方式。
 *
 * - `inline`：与 author 同一行（Ant Design Comment 的默认行为）
 * - `block`：另起一行，位于 author 下方
 */
export type CommentDatetimePlacement = 'inline' | 'block'

/**
 * `datetime` / `actions` 在各自行内的对齐方式。
 *
 * 使用逻辑方向，`direction="rtl"` 时自动镜像。
 */
export type CommentAlign = 'start' | 'end'

/**
 * 内置图标的动作名（大小写不敏感）。
 *
 * `actions` 中命中这些名称的字符串会渲染为「图标 + 文案」的文字按钮；
 * 未命中的字符串仍按纯文本渲染。
 */
export type CommentActionName
  = | 'reply'
    | 'comment'
    | 'like'
    | 'dislike'
    | 'edit'
    | 'delete'
    | 'remove'
    | 'share'
    | 'copy'
    | 'flag'
    | 'star'
    | 'favorite'
    | 'close'
    | 'cancel'
    | 'more'
    | 'ellipsis'
    | 'back'
    | 'report'

export interface CommentSemanticClassNames {
  /** 最外层容器 */
  root?: string
  /** avatar 与 content 的行容器 */
  inner?: string
  /** 头像区域 */
  avatar?: string
  /** 内容列 */
  content?: string
  /** author 与 datetime 的行容器 */
  header?: string
  /** 作者节点 */
  author?: string
  /** 时间节点 */
  datetime?: string
  /** 正文 */
  body?: string
  /** 操作区域 */
  actions?: string
  /** 嵌套评论容器 */
  children?: string
}

export interface CommentSemanticStyles {
  root?: CSSProperties
  inner?: CSSProperties
  avatar?: CSSProperties
  content?: CSSProperties
  header?: CSSProperties
  author?: CSSProperties
  datetime?: CSSProperties
  body?: CSSProperties
  actions?: CSSProperties
  children?: CSSProperties
}

export interface CommentProps {
  prefixCls?: string
  rootClass?: string
  /**
   * 评论作者。`string` 按纯文本渲染，复杂内容请使用 `#author` 插槽。
   */
  author?: string | VNode
  /**
   * 头像图片地址。组件会转交 `avatar` 组件的 `src`，并以 `author` 作为 `alt`。
   * 需要文字头像、图标头像或自定义头像时使用 `#avatar` 插槽。
   */
  avatar?: string
  /**
   * 评论时间。组件不做任何格式化，复杂内容（如 Tooltip 包裹）请使用 `#datetime` 插槽。
   */
  datetime?: string | VNode
  /**
   * 评论正文。组件不做 HTML / Markdown 解析，复杂内容请使用 `#content` 插槽。
   */
  content?: string | VNode
  /**
   * 评论操作。字符串**不区分大小写**地命中 {@link CommentActionName}
   * （如 `'Reply'` / `'Delete'`）时渲染为纯图标，其余字符串按纯文本渲染。
   *
   * 内置图标不可交互 —— 字符串条目没有地方挂载回调，渲染成按钮会给出
   * 「可点击」却没有响应的错误承诺。需要点击行为、禁用状态或自定义图标时
   * 请使用 `#actions` 插槽。
   */
  actions?: (string | VNode)[]
  /**
   * `datetime` 相对 `author` 的排布方式。
   * @default 'inline'
   */
  datetimePlacement?: CommentDatetimePlacement
  /**
   * `datetime` 在所在行内的对齐方式，使用逻辑方向。
   * @default 'start'
   */
  align?: CommentAlign
  /**
   * 自定义语义化 class，支持对象或函数。
   */
  classes?: CommentClassNamesType
  /**
   * 自定义语义化 style，支持对象或函数。
   */
  styles?: CommentStylesType
}

export type CommentSemanticName = keyof CommentSemanticClassNames & keyof CommentSemanticStyles
export type CommentClassNamesType = SemanticClassNamesType<CommentProps, CommentSemanticClassNames>
export type CommentStylesType = SemanticStylesType<CommentProps, CommentSemanticStyles>

export interface CommentSlots {
  avatar?: () => any
  author?: () => any
  datetime?: () => any
  content?: () => any
  actions?: () => any
  /**
   * 默认插槽承载嵌套评论，组件不限制嵌套层级。
   *
   * 过深的层级会同时放大 DOM 深度与水平空间占用，建议业务层自行限制深度。
   */
  default?: () => any
}

/**
 * Comment 是纯展示组件，不对外派发事件。
 */
export type CommentEmits = Record<string, never>

export interface CommentConfig {
  datetimePlacement?: CommentDatetimePlacement
  align?: CommentAlign
  class?: string
  style?: CSSProperties
  classes?: CommentClassNamesType
  styles?: CommentStylesType
}
