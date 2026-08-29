import type { ApiTableItem } from './types'

export function mergeDescription(zh?: string, en?: string) {
  const zhText = zh?.trim() ?? ''
  const enText = en?.trim() ?? ''
  if (zhText && enText)
    return `(ZH) ${zhText}\n\n(EN) ${enText}`
  return zhText || enText
}

export function mergeLangData(zhList: ApiTableItem[], enList: ApiTableItem[]) {
  const map = new Map<string, { zh?: ApiTableItem, en?: ApiTableItem }>()

  zhList.forEach((item) => {
    map.set(item.name, { zh: item })
  })

  enList.forEach((item) => {
    const entry = map.get(item.name)
    if (entry)
      entry.en = item
    else
      map.set(item.name, { en: item })
  })

  return Array.from(map.values()).map(({ zh, en }) => {
    const base = en ?? zh
    return {
      ...base,
      description: mergeDescription(zh?.description, en?.description),
      type: en?.type ?? zh?.type,
      default: en?.default ?? zh?.default,
    }
  }).filter(Boolean)
}
