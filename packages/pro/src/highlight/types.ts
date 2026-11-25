import type { Component, CSSProperties } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/semantic'

/**
 * 关键词。`string` 一律按字面量匹配；`RegExp` 按自身的 `source` 与 `flags` 匹配。
 *
 * Keyword. A `string` is always matched literally; a `RegExp` is matched with its own `source` and `flags`.
 */
export type HighlightKeyword = string | RegExp

/**
 * 一段命中区间，左闭右开 `[start, end)`。
 *
 * A matched range, half-open `[start, end)`.
 */
export interface HighlightRange {
  start: number
  end: number
  /** 命中该区间的关键词 / Keyword that produced this range */
  keyword?: HighlightKeyword
}

export interface HighlightFindChunksParams {
  content: string
  /** 规范化、去重之后的关键词 / Normalized and de-duplicated keywords */
  keywords: HighlightKeyword[]
  caseSensitive: boolean
}

/**
 * 自定义区间查找函数，替代内置扫描（拼音、去变音符、模糊搜索、后端偏移量等）。
 * 返回结果仍会经过清洗与重叠合并。
 *
 * Custom range finder that replaces the built-in scan (pinyin, diacritics, fuzzy search, server offsets...).
 * The returned ranges are still sanitized and merged.
 */
export type HighlightFindChunks = (params: HighlightFindChunksParams) => HighlightRange[]

export interface GetHighlightChunksOptions {
  /**
   * 是否区分大小写，只作用于字符串关键词
   * @default false
   */
  caseSensitive?: boolean
  /** 自定义区间查找函数 */
  findChunks?: HighlightFindChunks
}

export interface HighlightChunk {
  text: string
  start: number
  end: number
  highlight: boolean
  /** 第几个高亮片段，从 0 开始（重叠的命中合并后算一个）。只有命中片段才有 */
  index?: number
  /** 片段中起点最靠前的命中所用的关键词（同起点取最长）。只有命中片段才可能有 */
  keyword?: HighlightKeyword
}

export interface HighlightRenderInfo {
  /** 命中的文本 / Matched text */
  text: string
  /** 第几个命中片段，从 0 开始 / Zero-based index of the highlighted chunk */
  index: number
  start: number
  end: number
  /** 命中的关键词 / Matched keyword */
  keyword?: HighlightKeyword
}

export interface HighlightSemanticClassNames {
  /** 根节点 / Root element */
  root?: string
  /** 命中节点 / Highlighted chunk */
  highlight?: string
}

export interface HighlightSemanticStyles {
  /** 根节点 / Root element */
  root?: CSSProperties
  /** 命中节点 / Highlighted chunk */
  highlight?: CSSProperties
}

export interface HighlightProps {
  prefixCls?: string
  rootClass?: string
  /**
   * 原文本，只接受纯字符串，组件不解析 HTML。
   * @default ''
   */
  content?: string
  /**
   * 关键词。字符串按字面量匹配，`RegExp` 按自身 flags 匹配，空串会被忽略。
   */
  keywords?: HighlightKeyword | HighlightKeyword[]
  /**
   * 是否区分大小写，只作用于字符串关键词。
   * @default false
   */
  caseSensitive?: boolean
  /**
   * 命中节点使用的标签或组件。
   * @default 'mark'
   */
  highlightTag?: string | Component
  /**
   * 自定义命中节点的内容，渲染在 `highlightTag` 内部，优先级低于 `#highlight` 插槽。
   */
  highlightRender?: (info: HighlightRenderInfo) => any
  /**
   * 自定义区间查找函数，替代内置扫描。
   */
  findChunks?: HighlightFindChunks
  /**
   * 自定义语义化 class，支持对象或函数。
   */
  classes?: HighlightClassNamesType
  /**
   * 自定义语义化 style，支持对象或函数。
   */
  styles?: HighlightStylesType
}

export type HighlightSemanticName = keyof HighlightSemanticClassNames & keyof HighlightSemanticStyles
export type HighlightClassNamesType = SemanticClassNamesType<HighlightProps, HighlightSemanticClassNames>
export type HighlightStylesType = SemanticStylesType<HighlightProps, HighlightSemanticStyles>

export interface HighlightSlots {
  /**
   * 自定义命中节点的内容，渲染在 `highlightTag` 内部。
   * 返回空节点时回退为显示命中的原文本。
   */
  highlight?: (info: HighlightRenderInfo) => any
}

/**
 * Highlight 是纯展示组件，不对外派发事件。
 */
export type HighlightEmits = Record<string, never>

export interface HighlightRef {
  nativeElement: HTMLElement | null
}

export interface HighlightConfig {
  caseSensitive?: boolean
  highlightTag?: string | Component
  class?: string
  style?: CSSProperties
  classes?: HighlightClassNamesType
  styles?: HighlightStylesType
}
