import type Token from 'markdown-it/lib/token.d.mts'
import type { ApiSection, ComponentApiData, ParsedMarkdown } from './types'
import fs from 'node:fs/promises'
import { resolveTitleFromToken } from '@mdit-vue/shared'
import { createMarkdownParser } from './markdown'
import { parseTable } from './table'
import { getSectionType, isApiHeading, normalizeHeadingText, toKebabCase } from './utils'

const md = createMarkdownParser()

const NAME_HEADERS = new Set([
  'property',
  'properties',
  'prop',
  'props',
  'attribute',
  'attributes',
  'event',
  'events',
  '事件',
  '事件名',
  'slot',
  'slots',
  '插槽',
  '插槽名',
  'method',
  'methods',
  '方法',
  'name',
])

const DESC_HEADERS = new Set(['description', '说明'])
const TYPE_HEADERS = new Set(['type', '类型'])
const DEFAULT_HEADERS = new Set(['default', '默认值'])

function getHeadingText(tokens: Token[], headingIndex: number) {
  const inlineToken = tokens[headingIndex + 1]
  if (!inlineToken || inlineToken.type !== 'inline')
    return ''
  const rawText = resolveTitleFromToken(inlineToken, {
    shouldAllowHtml: false,
    shouldEscapeText: false,
  })
  return normalizeHeadingText(rawText)
}

function resolvePageTitle(tokens: Token[], frontmatter: Record<string, any>) {
  let title = ''
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!
    if (token.type === 'heading_open' && token.tag === 'h1') {
      title = getHeadingText(tokens, i)
      break
    }
  }

  if (!title && typeof frontmatter.title === 'string')
    title = frontmatter.title.trim()

  return title
}

function resolveDescription(frontmatter: Record<string, any>) {
  if (typeof frontmatter.description === 'string')
    return frontmatter.description
  if (typeof frontmatter.subtitle === 'string')
    return frontmatter.subtitle
  return ''
}

function getOrCreateComponent(
  map: Map<string, ComponentApiData>,
  name: string,
  description: string,
  source: string,
) {
  const safeName = name.trim()
  const tagName = `a-${toKebabCase(safeName)}`
  const existing = map.get(tagName)
  if (existing)
    return existing

  const entry: ComponentApiData = {
    tagName,
    componentName: safeName,
    description,
    source,
    attributes: [],
    events: [],
    slots: [],
  }
  map.set(tagName, entry)
  return entry
}

function parseApiSections(
  tokens: Token[],
  pageTitle: string,
  description: string,
  source: string,
) {
  const components = new Map<string, ComponentApiData>()
  let inApi = false
  let apiStructure: 'unknown' | 'single' | 'grouped' = 'unknown'
  let currentComponent: ComponentApiData | null = null
  let currentSection: ApiSection | null = null

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!

    if (token.type === 'heading_open') {
      const level = Number.parseInt(token.tag.slice(1), 10)
      const headingText = getHeadingText(tokens, i)

      if (level === 2) {
        if (isApiHeading(headingText)) {
          inApi = true
          apiStructure = 'unknown'
          currentComponent = null
          currentSection = null
        }
        else if (inApi) {
          inApi = false
          apiStructure = 'unknown'
          currentComponent = null
          currentSection = null
        }
        continue
      }

      if (!inApi)
        continue

      const section = getSectionType(headingText)
      if (section) {
        currentSection = section
        if (apiStructure === 'unknown')
          apiStructure = 'single'
        if (!currentComponent)
          currentComponent = getOrCreateComponent(components, pageTitle, description, source)
        continue
      }

      if (apiStructure === 'unknown')
        apiStructure = 'grouped'

      if (apiStructure === 'grouped' && level === 3) {
        const componentName = headingText || pageTitle
        currentComponent = getOrCreateComponent(components, componentName, description, source)
      }

      currentSection = null
      continue
    }

    if (token.type === 'table_open' && inApi) {
      if (!currentSection) {
        apiStructure = 'single'
        currentSection = 'props'
        currentComponent = getOrCreateComponent(components, pageTitle, description, source)
      }
      if (!currentComponent)
        continue
      if (currentSection === 'methods')
        continue

      const { headers, rows, endIndex } = parseTable(tokens, i)
      i = endIndex

      const nameIndex = headers.findIndex(h => NAME_HEADERS.has(h))
      if (nameIndex === -1)
        continue

      const descIndex = headers.findIndex(h => DESC_HEADERS.has(h))
      const typeIndex = headers.findIndex(h => TYPE_HEADERS.has(h))
      const defaultIndex = headers.findIndex(h => DEFAULT_HEADERS.has(h))

      rows.forEach((row) => {
        const nameRaw = row[nameIndex]
        const descRaw = descIndex >= 0 ? row[descIndex] : ''
        const typeRaw = typeIndex >= 0 ? row[typeIndex] : ''
        const defaultRaw = defaultIndex >= 0 ? row[defaultIndex] : ''

        if (!nameRaw || nameRaw === '-' || /\s/.test(nameRaw))
          return

        const item = {
          name: currentSection === 'props' ? toKebabCase(nameRaw) : nameRaw,
          description: descRaw,
          type: typeRaw && typeRaw !== '-' ? typeRaw : 'any',
          default: defaultRaw && defaultRaw !== '-' ? defaultRaw : undefined,
        }

        if (currentSection === 'props')
          currentComponent?.attributes?.push?.(item)
        else if (currentSection === 'events')
          currentComponent?.events?.push?.(item)
        else if (currentSection === 'slots')
          currentComponent?.slots?.push(item)
      })
    }
  }

  return Array.from(components.values())
}

export async function parseMarkdownFile(filePath: string): Promise<ParsedMarkdown | null> {
  const content = await fs.readFile(filePath, 'utf-8')
  return parseMarkdownContent(content, filePath)
}

export function parseMarkdownContent(content: string, source: string = ''): ParsedMarkdown | null {
  const env: Record<string, any> = {}
  const tokens = md.parse(content, env)
  const frontmatter = env.frontmatter || {}

  const title = resolvePageTitle(tokens, frontmatter)
  if (!title)
    return null

  const description = resolveDescription(frontmatter)
  const components = parseApiSections(tokens, title, description, source)

  return {
    title,
    description,
    source,
    components,
  }
}
