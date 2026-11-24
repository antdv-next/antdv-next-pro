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
  /**
   * 评论操作。内容由外层 `Space` 排列（`columnGap` 取自 `actionGap` token，自动换行），
   * 因此这里只需要放具体的操作项，容器与间距由组件负责。
   *
   * 操作项请使用真实控件（如 `a-button` `type="text"` `size="small"`）而非
   * `span` 配合 `@click` —— 前者自带 hover / focus 反馈、禁用态与按钮语义。
   *
   * @example
   * ```tsx
   * <Comment
   *   v-slots={{
   *     actions: () => (
   *       <>
   *         <Button type="text" size="small" icon={<LikeOutlined />} onClick={onLike}>
   *           {likes}
   *         </Button>
   *         <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={onDelete}>
   *           Delete
   *         </Button>
   *       </>
   *     ),
   *   }}
   * />
   * ```
   */
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
