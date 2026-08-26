import type { SectionType } from './utils'

export interface ApiTableItem {
  name: string
  description?: string
  type?: string
  default?: string
}

export interface ComponentApiData {
  tagName: string
  componentName: string
  description: string
  source: string
  attributes: ApiTableItem[]
  events: ApiTableItem[]
  slots: ApiTableItem[]
}

export interface DefaultComponentDefinition {
  componentName: string
  tagName?: string
  description?: string
  source?: string
  attributes?: ApiTableItem[]
  events?: ApiTableItem[]
  slots?: ApiTableItem[]
  lang?: 'zh' | 'en' | 'both'
}

export interface ParsedMarkdown {
  title: string
  description: string
  source: string
  components: ComponentApiData[]
}

export type ApiSection = SectionType

export type MarkdownLang = 'zh' | 'en'

export interface MarkdownHookContext {
  componentName: string
  tagName: string
  source: string
  lang: MarkdownLang
}

export interface MarkdownHooks {
  props?: (items: ApiTableItem[], context: MarkdownHookContext) => ApiTableItem[] | void
  events?: (items: ApiTableItem[], context: MarkdownHookContext) => ApiTableItem[] | void
  slots?: (items: ApiTableItem[], context: MarkdownHookContext) => ApiTableItem[] | void
}
