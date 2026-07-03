const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

function toBase62(num: number): string {
  let str = ''
  do {
    str = BASE62[num % 62] + str
    num = Math.floor(num / 62)
  } while (num > 0)
  return str
}

export function shortHash(str: string): string {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(str)

  let hash = 2166136261
  for (let i = 0; i < bytes.length; i++) {
    hash ^= bytes[i]
    hash += (hash << 1)
      + (hash << 4)
      + (hash << 7)
      + (hash << 8)
      + (hash << 24)
  }

  return toBase62(hash >>> 0) // 无符号整数 → Base62
}
