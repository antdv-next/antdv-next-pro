import type { CSSProperties, VNodeChild } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/semantic'

/** 可渲染内容 / Renderable content */
export type CodeNode = VNodeChild

/**
 * 高亮配色。`auto` 跟随组件库当前主题（按 `colorBgContainer` 的亮度判断）。
 *
 * Highlight color scheme. `auto` follows the current theme (decided by the luminance of `colorBgContainer`).
 */
export type CodeTheme = 'auto' | 'light' | 'dark'

/**
 * 一个语法 token。同一行所有 token 的 `content` 拼起来必须等于该行源码。
 *
 * A syntax token. The `content` of all tokens in a line must concatenate to the source of that line.
 */
export interface CodeToken {
  content: string
  /** 亮色主题下的颜色 / Color in the light scheme */
  color?: string
  /** 暗色主题下的颜色，不提供时用 `color` / Color in the dark scheme, falls back to `color` */
  darkColor?: string
  italic?: boolean
  bold?: boolean
  underline?: boolean
}

/**
 * 语法高亮器。组件只依赖这个接口，不依赖任何具体的高亮库。
 *
 * Syntax highlighter. The component only depends on this interface, not on any highlighting library.
 */
export interface CodeHighlighter {
  /**
   * 同步检查：这个语言现在能不能直接分词。
   *
   * Synchronous check: whether the language can be tokenized right now.
   */
  hasLanguage: (language: string) => boolean
  /**
   * 加载语言（包含高亮器自身的初始化）。
   * - resolve(false)：不支持这个语言，回退纯文本，不算错误；
   * - reject：加载失败，回退纯文本并触发 `error({ stage: 'load' })`，之后可以重试。
   *
   * Load a language (including the initialization of the highlighter itself).
   * - resolve(false): the language is not supported; falls back to plain text without an error;
   * - reject: loading failed; falls back to plain text and emits `error({ stage: 'load' })`. It can be retried later.
   */
  loadLanguage: (language: string) => Promise<boolean>
  /**
   * 同步分词，按行返回。行数必须和源码一致，每行 token 的 `content` 拼起来必须等于该行源码。
   *
   * Tokenize synchronously and return tokens line by line. The line count must match the source,
   * and the `content` of the tokens in each line must concatenate to the source of that line.
   */
  tokenize: (code: string, language: string) => CodeToken[][]
}

export interface CodeCopyConfig {
  /** 自定义复制文本，默认按组件的复制规则生成 / Custom text to copy */
  text?: string | (() => string | Promise<string>)
  /** 复制图标：`[复制, 复制成功]` / Copy icons: `[copy, copied]` */
  icon?: CodeNode | [CodeNode, CodeNode]
  /** 提示文案：`[复制, 复制成功]`；`false` 时不显示 Tooltip / Tooltips: `[copy, copied]`; `false` hides the tooltip */
  tooltips?: false | [CodeNode, CodeNode]
  tabIndex?: number
}

export interface CodeExtraInfo {
  /** 按当前模式的复制规则复制 / Copy with the rules of the current mode */
  copy: () => Promise<void>
  /** 最近一次复制是否成功且仍在反馈期内 / Whether the last copy succeeded and is still in its feedback period */
  copied: boolean
  language: string
}

export interface CodeSemanticClassNames {
  /** 根容器 / Root container */
  root?: string
  /** 头部（extra 与复制按钮）/ Header (extra and the copy button) */
  header?: string
  /** 滚动容器 pre / Scroll container (pre) */
  pre?: string
  /** 单个逻辑行 / Logical line */
  line?: string
  /** 行号（Diff 下新旧两列各一个）/ Line number cell (two per line in diff mode) */
  lineNumber?: string
  /** Diff 的 +/- 标记 / Diff marker */
  marker?: string
  /** 复制按钮 / Copy button */
  copy?: string
}

export interface CodeSemanticStyles {
  root?: CSSProperties
  header?: CSSProperties
  pre?: CSSProperties
  line?: CSSProperties
  lineNumber?: CSSProperties
  marker?: CSSProperties
  copy?: CSSProperties
}

export interface CodeProps {
  prefixCls?: string
  rootClass?: string
  /**
   * 源码。`diff` 为 `true` 时是带行前缀的文本。只接受字符串，按文本渲染，不解析 HTML。
   * @default ''
   */
  content?: string
  /**
   * 语言名或别名，交给 `highlighter` 解释。`'text'` 表示纯文本。
   * @default 'text'
   */
  language?: string
  /**
   * 按 Diff 行前缀（`+` / `-` / 空格）解析 `content`。
   * @default false
   */
  diff?: boolean
  /**
   * 显示行号。Diff 模式下显示旧、新两列。
   * @default false
   */
  showLineNumbers?: boolean
  /**
   * 自动换行。行号仍然对应逻辑行。
   * @default false
   */
  wordWrap?: boolean
  /**
   * 复制按钮。
   * @default false
   */
  copyable?: boolean | CodeCopyConfig
  /**
   * 高亮配色。
   * @default 'auto'
   */
  theme?: CodeTheme
  /**
   * 语法高亮器。不提供时显示纯文本。请在模块级创建一次并复用同一个引用。
   */
  highlighter?: CodeHighlighter
  /**
   * 头部扩展区，优先级低于 `#extra` 插槽。
   */
  extra?: CodeNode | ((info: CodeExtraInfo) => CodeNode)
  /**
   * 自定义语义化 class，支持对象或函数。
   */
  classes?: CodeClassNamesType
  /**
   * 自定义语义化 style，支持对象或函数。
   */
  styles?: CodeStylesType
}

export type CodeSemanticName = keyof CodeSemanticClassNames & keyof CodeSemanticStyles
export type CodeClassNamesType = SemanticClassNamesType<CodeProps, CodeSemanticClassNames>
export type CodeStylesType = SemanticStylesType<CodeProps, CodeSemanticStyles>

export type CodeErrorStage = 'parse' | 'load' | 'highlight' | 'copy'

export interface CodeHighlightInfo {
  language: string
  highlighted: boolean
}

export interface CodeErrorInfo {
  stage: CodeErrorStage
  error: Error
}

export interface CodeCopyInfo {
  text: string
}

export interface CodeEmits {
  /** 当前输入已经有了最终结果：高亮完成，或者确定回退为纯文本 */
  highlight: (info: CodeHighlightInfo) => void
  /** Diff 解析、语言加载、分词或复制失败 */
  error: (info: CodeErrorInfo) => void
  /** 复制成功 */
  copy: (info: CodeCopyInfo) => void
  [key: string]: (...args: any[]) => void
}

export interface CodeSlots {
  /** 头部扩展区 */
  extra?: (info: CodeExtraInfo) => any
}

export interface CodeRef {
  /** 按当前模式的复制规则复制；失败时触发 `error({ stage: 'copy' })`，不会 reject */
  copy: () => Promise<void>
  nativeElement: HTMLElement | null
}

export interface CodeConfig {
  showLineNumbers?: boolean
  wordWrap?: boolean
  copyable?: boolean | CodeCopyConfig
  theme?: CodeTheme
  highlighter?: CodeHighlighter
  class?: string
  style?: CSSProperties
  classes?: CodeClassNamesType
  styles?: CodeStylesType
}
