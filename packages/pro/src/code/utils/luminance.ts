function parseHex(value: string): [number, number, number] | null {
  const hex = value.slice(1)
  if (!/^[\da-f]+$/i.test(hex))
    return null
  if (hex.length === 3 || hex.length === 4) {
    return [
      Number.parseInt(hex[0]! + hex[0]!, 16),
      Number.parseInt(hex[1]! + hex[1]!, 16),
      Number.parseInt(hex[2]! + hex[2]!, 16),
    ]
  }
  if (hex.length === 6 || hex.length === 8) {
    return [
      Number.parseInt(hex.slice(0, 2), 16),
      Number.parseInt(hex.slice(2, 4), 16),
      Number.parseInt(hex.slice(4, 6), 16),
    ]
  }
  return null
}

function parseRgb(value: string): [number, number, number] | null {
  const match = value.match(/^rgba?\(([^)]+)\)$/i)
  if (!match)
    return null
  const parts = match[1]!.split(/[\s,/]+/).filter(Boolean)
  if (parts.length < 3)
    return null
  const channels = parts.slice(0, 3).map((part) => {
    const number = Number.parseFloat(part)
    return part.endsWith('%') ? number * 2.55 : number
  })
  if (channels.some(channel => !Number.isFinite(channel)))
    return null
  return channels as [number, number, number]
}

function toLinear(channel: number) {
  const value = Math.min(255, Math.max(0, channel)) / 255
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

/**
 * 相对亮度（WCAG），范围 0–1。无法解析的颜色返回 `null`。
 *
 * 只支持 token 里实际会出现的格式：`#rgb` / `#rrggbb` / `#rrggbbaa` / `rgb()` / `rgba()`。
 */
export function getLuminance(color: unknown): number | null {
  if (typeof color !== 'string')
    return null
  const value = color.trim()
  const rgb = value.startsWith('#') ? parseHex(value) : parseRgb(value)
  if (!rgb)
    return null
  return 0.2126 * toLinear(rgb[0]) + 0.7152 * toLinear(rgb[1]) + 0.0722 * toLinear(rgb[2])
}

/**
 * 背景色是否是暗色。无法解析时按亮色处理。
 *
 * 阈值取感知中点（约等于 L* = 50）。antd 暗色算法的容器背景是 `#141414`（亮度约 0.007），
 * 亮色是 `#ffffff`（亮度 1），两边都离阈值很远。
 */
export function isDarkColor(color: unknown): boolean {
  const luminance = getLuminance(color)
  return luminance !== null && luminance < 0.18
}
