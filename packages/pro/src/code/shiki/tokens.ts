import type { ThemedTokenWithVariants } from 'shiki/core'
import type { CodeToken } from '../types'

// Shiki 的 FontStyle 位掩码：Italic = 1，Bold = 2，Underline = 4（NotSet = -1，None = 0）。
const FONT_STYLE_ITALIC = 1
const FONT_STYLE_BOLD = 2
const FONT_STYLE_UNDERLINE = 4

export const LIGHT_KEY = 'light'
export const DARK_KEY = 'dark'

/**
 * 把 Shiki 的双主题 token 转成组件的 `CodeToken`，只保留组件用得到的字段。
 */
export function toCodeTokens(lines: ThemedTokenWithVariants[][]): CodeToken[][] {
  return lines.map(line => line.map((token) => {
    const light = token.variants[LIGHT_KEY]
    const dark = token.variants[DARK_KEY]
    const fontStyle = light?.fontStyle ?? 0
    const result: CodeToken = { content: token.content }

    if (light?.color)
      result.color = light.color
    if (dark?.color)
      result.darkColor = dark.color
    if (fontStyle > 0) {
      if (fontStyle & FONT_STYLE_ITALIC)
        result.italic = true
      if (fontStyle & FONT_STYLE_BOLD)
        result.bold = true
      if (fontStyle & FONT_STYLE_UNDERLINE)
        result.underline = true
    }
    return result
  }))
}
