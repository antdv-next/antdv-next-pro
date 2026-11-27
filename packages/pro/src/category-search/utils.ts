import type {
  CategorySearchFieldNames,
  CategorySearchOption,
  CategorySearchOptionGroup,
  CategorySearchOptionValue,
  CategorySearchType,
  CategorySearchValueOption,
} from './types'

export interface NormalizedGroup {
  key: CategorySearchOptionValue | string
  label: any
  options: CategorySearchOption[]
}

/** 维度列表的一行：分组标题或维度 / A row of the dimension list: group title or dimension */
export type ListEntry
  = | { kind: 'group', key: string, label: any }
    | { kind: 'option', key: string, option: CategorySearchOption, grouped: boolean }

export interface NormalizedOptions {
  /** 渲染用的扁平列表 / Flat list for rendering */
  entries: ListEntry[]
  /** 所有维度，按出现顺序 / All dimensions in order */
  options: CategorySearchOption[]
  /** value -> 维度 / value -> dimension */
  optionMap: Map<CategorySearchOptionValue, CategorySearchOption>
}

const DEFAULT_FIELD_NAMES = {
  label: 'label',
  value: 'value',
  children: 'children',
  options: 'options',
} as const

export function getFieldNames(fieldNames?: CategorySearchFieldNames) {
  return {
    label: fieldNames?.label || DEFAULT_FIELD_NAMES.label,
    value: fieldNames?.value || DEFAULT_FIELD_NAMES.value,
    children: fieldNames?.children || DEFAULT_FIELD_NAMES.children,
    options: fieldNames?.options || DEFAULT_FIELD_NAMES.options,
  }
}

function normalizeOption(raw: Record<string, any>, names: ReturnType<typeof getFieldNames>): CategorySearchOption {
  const children = raw[names.children] as Record<string, any>[] | undefined
  return {
    ...raw,
    label: raw[names.label],
    value: raw[names.value],
    children: Array.isArray(children)
      ? children.map(child => ({
          ...child,
          label: child[names.label],
          value: child[names.value],
        }) as CategorySearchValueOption)
      : undefined,
  } as CategorySearchOption
}

/**
 * 按 fieldNames 规范化 options，并建立 value -> 维度的索引。
 *
 * Normalize options with fieldNames and index dimensions by value.
 */
export function normalizeOptions(
  rawOptions: (CategorySearchOption | CategorySearchOptionGroup)[] | undefined,
  fieldNames?: CategorySearchFieldNames,
): NormalizedOptions {
  const names = getFieldNames(fieldNames)
  const entries: ListEntry[] = []
  const options: CategorySearchOption[] = []
  const optionMap = new Map<CategorySearchOptionValue, CategorySearchOption>()

  const pushOption = (option: CategorySearchOption, grouped: boolean) => {
    if (optionMap.has(option.value))
      return
    optionMap.set(option.value, option)
    options.push(option)
    entries.push({ kind: 'option', key: `option-${String(option.value)}`, option, grouped })
  }

  ;(rawOptions ?? []).forEach((raw, index) => {
    const record = raw as Record<string, any>
    const groupOptions = record[names.options]
    if (Array.isArray(groupOptions)) {
      entries.push({ kind: 'group', key: `group-${String(record.key ?? index)}`, label: record[names.label] })
      groupOptions.forEach(child => pushOption(normalizeOption(child, names), true))
      return
    }
    pushOption(normalizeOption(record, names), false)
  })

  return { entries, options, optionMap }
}

export function getOptionType(option?: CategorySearchOption): CategorySearchType {
  return option?.type ?? 'select'
}

/**
 * 值为空时不生成标签：提交空值等同于删除该条件。
 *
 * An empty value produces no tag; committing an empty value removes the condition.
 */
export function isEmptyValue(value: unknown, type: CategorySearchType) {
  if (value === undefined || value === null)
    return true
  if (type === 'input')
    return typeof value === 'string' ? value.trim() === '' : false
  if (type === 'numberRange' || type === 'dateRange') {
    if (!Array.isArray(value))
      return true
    return value.every(part => part === undefined || part === null || part === '')
  }
  if (Array.isArray(value))
    return value.length === 0
  return value === ''
}

/** 打开面板时的初始草稿值 / Initial draft value when a panel opens */
export function getDraftValue(option: CategorySearchOption, value: unknown) {
  const type = getOptionType(option)
  if (type === 'select' && option.multiple)
    return Array.isArray(value) ? [...value] : []
  if (type === 'numberRange')
    return Array.isArray(value) ? [value[0] ?? null, value[1] ?? null] : [null, null]
  if (type === 'dateRange')
    return Array.isArray(value) ? [...value] : null
  if (type === 'input')
    return typeof value === 'string' ? value : ''
  return value
}

/** 规范化数字区间：两端都有值且 min > max 时交换 / Swap a reversed number range */
export function normalizeNumberRange(value: [number | null, number | null]) {
  const [min, max] = value
  if (typeof min === 'number' && typeof max === 'number' && min > max)
    return [max, min] as [number, number]
  return [min ?? null, max ?? null] as [number | null, number | null]
}

function isDayjsLike(value: unknown): value is { format: (template?: string) => string } {
  return !!value && typeof value === 'object' && typeof (value as any).format === 'function'
}

function formatDate(value: unknown, format?: unknown) {
  if (isDayjsLike(value))
    return value.format(typeof format === 'string' ? format : 'YYYY-MM-DD')
  if (value instanceof Date)
    return value.toISOString().slice(0, 10)
  return value === undefined || value === null ? '' : String(value)
}

export interface FormatTextOptions {
  rangeSeparator: string
  valueSeparator: string
}

/**
 * 计算标签里值的默认显示。返回数组时按顺序渲染（label 可以是 VNode）。
 *
 * Default display of the value inside a tag. Arrays are rendered in order (labels may be VNodes).
 */
export function formatValue(option: CategorySearchOption, value: any, texts: FormatTextOptions): any[] {
  const type = getOptionType(option)
  if (type === 'select') {
    const values: CategorySearchOptionValue[] = Array.isArray(value) ? value : [value]
    const children = option.children ?? []
    const nodes: any[] = []
    values.forEach((current, index) => {
      if (index > 0)
        nodes.push(texts.valueSeparator)
      const matched = children.find(child => child.value === current)
      nodes.push(matched?.label ?? String(current))
    })
    return nodes
  }
  if (type === 'numberRange') {
    const [min, max] = Array.isArray(value) ? value : [undefined, undefined]
    const hasMin = min !== undefined && min !== null
    const hasMax = max !== undefined && max !== null
    if (hasMin && hasMax)
      return [`${min}${texts.rangeSeparator}${max}`]
    if (hasMin)
      return [`≥ ${min}`]
    if (hasMax)
      return [`≤ ${max}`]
    return []
  }
  if (type === 'dateRange') {
    const format = option.componentProps?.format
    const [start, end] = Array.isArray(value) ? value : [undefined, undefined]
    return [`${formatDate(start, format)}${texts.rangeSeparator}${formatDate(end, format)}`]
  }
  if (Array.isArray(value))
    return [value.join(texts.valueSeparator)]
  return [value === undefined || value === null ? '' : String(value)]
}

/** 截断纯文本内容 / Truncate plain text content */
export function truncateNodes(nodes: any[], maxLength?: number) {
  if (maxLength === undefined || maxLength < 0)
    return nodes
  if (!nodes.every(node => typeof node === 'string'))
    return nodes
  const text = nodes.join('')
  return text.length > maxLength ? [`${text.slice(0, maxLength)}...`] : nodes
}
