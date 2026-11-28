import type { CodeToken } from '../types'

/**
 * 校验高亮器返回的 token 和源码是否对得上：行数相等，且每行 token 的 `content` 拼起来等于该行源码。
 *
 * 行号、Diff 映射和复制都以行数据为准。第三方高亮器一旦少行或改了内容，直接渲染会让显示的代码和
 * 复制出去的代码不一致，所以对不上就整体放弃这次高亮。
 */
export function validateTokens(tokens: unknown, lines: readonly string[]): tokens is CodeToken[][] {
  if (!Array.isArray(tokens) || tokens.length !== lines.length)
    return false

  for (let index = 0; index < lines.length; index += 1) {
    const lineTokens = tokens[index]
    if (!Array.isArray(lineTokens))
      return false

    let text = ''
    for (const token of lineTokens) {
      if (!token || typeof token.content !== 'string')
        return false
      text += token.content
    }
    if (text !== lines[index])
      return false
  }

  return true
}
