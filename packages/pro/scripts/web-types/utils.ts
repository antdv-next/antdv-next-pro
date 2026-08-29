export function toKebabCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s._:]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

export function cleanText(text?: string) {
  if (!text)
    return ''

  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&ZeroWidthSpace;|&#8203;/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`/g, '')
    .replace(/<[^>]+>/g, '')
    .trim()
}

export function normalizeHeadingText(text: string) {
  return cleanText(text)
    .replace(/\s*\{#[^}]+\}\s*/g, '')
    .replace(/[：:]\s*$/, '')
    .trim()
}

const SECTION_TITLES = {
  props: new Set(['props', 'prop', 'property', 'properties', '属性']),
  events: new Set(['events', 'event', '事件']),
  slots: new Set(['slots', 'slot', '插槽']),
  methods: new Set(['methods', 'method', '方法']),
}

export type SectionType = keyof typeof SECTION_TITLES

export function getSectionType(text: string): SectionType | null {
  const normalized = text.toLowerCase()
  if (SECTION_TITLES.props.has(normalized))
    return 'props'
  if (SECTION_TITLES.events.has(normalized))
    return 'events'
  if (SECTION_TITLES.slots.has(normalized))
    return 'slots'
  if (SECTION_TITLES.methods.has(normalized))
    return 'methods'
  return null
}

export function isApiHeading(text: string) {
  return text.trim().toLowerCase() === 'api'
}
