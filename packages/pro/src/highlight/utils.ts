import type {
  GetHighlightChunksOptions,
  HighlightChunk,
  HighlightKeyword,
  HighlightRange,
} from './types'

/** ES 规范里的 SyntaxCharacter，全部可以在 `u` 模式下安全转义 */
const SYNTAX_CHARACTERS = /[.*+?^${}()|[\]\\]/g

function escapeRegExp(value: string) {
  return value.replace(SYNTAX_CHARACTERS, '\\$&')
}

function isRegExp(value: unknown): value is RegExp {
  return Object.prototype.toString.call(value) === '[object RegExp]'
}

/**
 * 关键词转数组，丢掉空串、非法值和重复项。
 *
 * `caseSensitive` 为 `false` 时，字符串关键词按小写去重（`['Vue', 'vue']` 只扫一次）。
 */
export function normalizeKeywords(
  keywords: HighlightKeyword | HighlightKeyword[] | null | undefined,
  caseSensitive = false,
): HighlightKeyword[] {
  if (keywords == null)
    return []

  const list = Array.isArray(keywords) ? keywords : [keywords]
  const seen = new Set<string>()
  const result: HighlightKeyword[] = []

  for (const item of list) {
    let key: string
    if (typeof item === 'string') {
      if (!item.length)
        continue
      key = `s:${caseSensitive ? item : item.toLowerCase()}`
    }
    else if (isRegExp(item)) {
      key = `r:${item.flags}:${item.source}`
    }
    else {
      continue
    }
    if (seen.has(key))
      continue
    seen.add(key)
    result.push(item)
  }

  return result
}

/**
 * 每个关键词编译成一个独立的全局正则，不修改调用方传入的 RegExp（包括 `lastIndex`）。
 */
function compileKeyword(keyword: HighlightKeyword, caseSensitive: boolean) {
  if (typeof keyword === 'string')
    return new RegExp(escapeRegExp(keyword), caseSensitive ? 'gu' : 'giu')

  // `caseSensitive` 不作用于 RegExp：保留调用方的 flags，只补 `g`、去掉 `y`。
  const flags = keyword.flags.replace(/[gy]/g, '')
  return new RegExp(keyword.source, `${flags}g`)
}

/** 按码点前进，避免零宽匹配把代理对（emoji、生僻字）切开 */
function advanceByCodePoint(content: string, index: number) {
  const codePoint = content.codePointAt(index)
  return index + (codePoint !== undefined && codePoint > 0xFFFF ? 2 : 1)
}

interface OrderedRange extends HighlightRange {
  order: number
}

function scanRanges(content: string, keywords: HighlightKeyword[], caseSensitive: boolean) {
  const ranges: OrderedRange[] = []

  keywords.forEach((keyword, order) => {
    const regex = compileKeyword(keyword, caseSensitive)
    let match = regex.exec(content)
    while (match) {
      const start = match.index
      const length = match[0].length
      if (length) {
        ranges.push({ start, end: start + length, keyword, order })
      }
      else {
        // 零宽匹配（`/(?=a)/g`、`/^/gm`）不产生区间，手动前进防止死循环。
        if (start >= content.length)
          break
        regex.lastIndex = advanceByCodePoint(content, start)
      }
      match = regex.exec(content)
    }
  })

  return ranges
}

/**
 * 清洗并合并区间：
 * 1. 丢掉 `start` / `end` 不是有限数的区间，向下取整，裁剪到 `[0, length]`，丢掉空区间；
 * 2. 按 `start` 升序；同起点按 `end` 降序；再相同按关键词顺序；
 * 3. 只合并**重叠**的区间（相邻区间不合并），`keyword` 保留起点最靠前的那个。
 */
function mergeRanges(ranges: OrderedRange[], length: number) {
  const valid: OrderedRange[] = []

  for (const range of ranges) {
    if (!range || !Number.isFinite(range.start) || !Number.isFinite(range.end))
      continue
    const start = Math.max(0, Math.floor(range.start))
    const end = Math.min(length, Math.floor(range.end))
    if (end > start)
      valid.push({ start, end, keyword: range.keyword, order: range.order })
  }

  valid.sort((a, b) => a.start - b.start || b.end - a.end || a.order - b.order)

  const merged: HighlightRange[] = []
  for (const range of valid) {
    const last = merged[merged.length - 1]
    if (last && range.start < last.end) {
      last.end = Math.max(last.end, range.end)
      continue
    }
    merged.push({ start: range.start, end: range.end, keyword: range.keyword })
  }

  return merged
}

/**
 * 把纯文本按关键词切成有序的命中 / 未命中片段。
 *
 * 所有片段的 `text` 拼起来严格等于 `content`；`content` 为空时返回 `[]`。
 * 不依赖 Vue，可直接用于 Table 筛选、Select `optionRender` 等场景，SSR 下两端结果一致。
 */
export function getHighlightChunks(
  content: string,
  keywords?: HighlightKeyword | HighlightKeyword[],
  options: GetHighlightChunksOptions = {},
): HighlightChunk[] {
  const text = typeof content === 'string' ? content : ''
  if (!text)
    return []

  const { caseSensitive = false, findChunks } = options
  const normalized = normalizeKeywords(keywords, caseSensitive)

  let ranges: HighlightRange[] = []
  if (findChunks) {
    const custom = findChunks({ content: text, keywords: normalized, caseSensitive })
    if (Array.isArray(custom))
      ranges = mergeRanges(custom.map((range, order) => ({ ...range, order })), text.length)
  }
  else if (normalized.length) {
    ranges = mergeRanges(scanRanges(text, normalized, caseSensitive), text.length)
  }

  const chunks: HighlightChunk[] = []
  let cursor = 0
  ranges.forEach((range, index) => {
    if (range.start > cursor)
      chunks.push({ text: text.slice(cursor, range.start), start: cursor, end: range.start, highlight: false })

    const chunk: HighlightChunk = {
      text: text.slice(range.start, range.end),
      start: range.start,
      end: range.end,
      highlight: true,
      index,
    }
    if (range.keyword !== undefined)
      chunk.keyword = range.keyword
    chunks.push(chunk)
    cursor = range.end
  })

  if (cursor < text.length)
    chunks.push({ text: text.slice(cursor), start: cursor, end: text.length, highlight: false })

  return chunks
}

/**
 * 关键词的内容签名：字面量数组每次 render 都是新引用，按签名比较可避免重复计算。
 */
export function getKeywordsSignature(keywords: HighlightKeyword | HighlightKeyword[] | null | undefined) {
  if (keywords == null)
    return ''
  const list = Array.isArray(keywords) ? keywords : [keywords]
  return JSON.stringify(list.map(item => (isRegExp(item) ? ['r', item.source, item.flags] : ['s', item])))
}
