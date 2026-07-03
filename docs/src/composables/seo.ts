import type { Frontmatter } from '@/composables/doc-page.ts'

interface SeoMeta {
  title?: string
  description?: string
  keywords?: string[] | string
}

interface RouteLike {
  path: string
  fullPath?: string
  meta?: Record<string, any>
}

interface ApplyRouteSeoOptions {
  frontmatter?: Frontmatter
}

type LocaleCode = 'zh-CN' | 'en-US'

const SITE_NAME = 'Antdv Next Pro'

const DEFAULT_SEO: Record<LocaleCode, Required<SeoMeta>> = {
  'zh-CN': {
    title: 'Antdv Next Pro 进阶组件库',
    description: 'Antdv Next Pro 是基于 Antdv Next 的 Vue 3 企业级进阶组件库，提供完整组件文档、示例与主题定制能力。',
    keywords: [
      'Antdv Next Pro',
      'Antdv Next',
      'Vue 3 组件库',
      'Ant Design Vue',
      'UI 组件',
      'TypeScript',
      'TSX',
      '组件文档',
    ],
  },
  'en-US': {
    title: 'Antdv Next Pro Component Library',
    description: 'Antdv Next Pro is an advanced Vue 3 component library built on Antdv Next, including comprehensive docs, demos, and theme customization.',
    keywords: [
      'Antdv Next Pro',
      'Antdv Next',
      'Vue 3 component library',
      'Ant Design Vue',
      'UI components',
      'TypeScript',
      'TSX',
      'documentation',
    ],
  },
}

const PATH_SEO: Record<string, Record<LocaleCode, SeoMeta>> = {
  '/': {
    'zh-CN': {
      title: 'Antdv Next Pro 进阶组件库',
      description: 'Antdv Next Pro 组件库主页，提供 Vue 3 进阶组件、主题能力与开发资源。',
      keywords: ['Antdv Next Pro', 'Vue 3', '组件库', '设计系统'],
    },
    'en-US': {
      title: 'Antdv Next Pro Component Library',
      description: 'Antdv Next Pro homepage for advanced Vue 3 UI components, theme customization, and developer resources.',
      keywords: ['Antdv Next Pro', 'Vue 3', 'Component Library', 'Design System'],
    },
  },
  '/index-cn': {
    'zh-CN': {
      title: 'Antdv Next Pro 进阶组件库',
      description: 'Antdv Next Pro 组件库主页，提供 Vue 3 进阶组件、主题能力与开发资源。',
      keywords: ['Antdv Next Pro', 'Vue 3', '组件库', '设计系统'],
    },
    'en-US': {},
  },
}

function detectLocaleFromPath(path: string): LocaleCode {
  return path.endsWith('-cn') || path === '/index-cn' ? 'zh-CN' : 'en-US'
}

function normalizeTitle(title: string): string {
  if (!title)
    return SITE_NAME
  return title.includes(SITE_NAME) ? title : `${title} - ${SITE_NAME}`
}

function normalizeKeywords(keywords?: string[] | string): string {
  if (!keywords)
    return ''
  const keywordList = Array.isArray(keywords) ? keywords : keywords.split(',')
  return Array.from(new Set(keywordList.map(item => item.trim()).filter(Boolean))).join(', ')
}

function ensureMetaByName(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function ensureMetaByProperty(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function ensureCanonicalLink(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

function toDocFallbackTitle(path: string) {
  if (!path.startsWith('/components/'))
    return ''
  const segment = path.split('/').filter(Boolean).at(-1) ?? ''
  if (!segment)
    return ''
  return segment
    .split('-')
    .map(str => str.charAt(0).toUpperCase() + str.slice(1))
    .join(' ')
}

export function applyRouteSeo(to: RouteLike, options: ApplyRouteSeoOptions = {}) {
  if (typeof document === 'undefined')
    return

  const locale = detectLocaleFromPath(to.path)
  const defaultSeo = DEFAULT_SEO[locale]
  const routeMetaSeo = (to.meta?.seo ?? {}) as SeoMeta
  const pathSeo = PATH_SEO[to.path]?.[locale] ?? {}
  const docTitle = options.frontmatter?.title ?? toDocFallbackTitle(to.path)
  const docKeywords = docTitle
    ? locale === 'zh-CN'
      ? [docTitle, `${docTitle} API`, `${docTitle} 组件`]
      : [docTitle, `${docTitle} API`, `${docTitle} component`]
    : []

  const title = docTitle || routeMetaSeo.title || pathSeo.title || defaultSeo.title
  const description = options.frontmatter?.description || routeMetaSeo.description || pathSeo.description || defaultSeo.description

  const keywords = normalizeKeywords([
    ...defaultSeo.keywords,
    ...(Array.isArray(pathSeo.keywords) ? pathSeo.keywords : pathSeo.keywords?.split(',') ?? []),
    ...(Array.isArray(routeMetaSeo.keywords) ? routeMetaSeo.keywords : routeMetaSeo.keywords?.split(',') ?? []),
    ...docKeywords,
  ])

  const fullTitle = normalizeTitle(title)

  document.documentElement.lang = locale
  document.title = fullTitle

  ensureMetaByName('description', description)
  ensureMetaByName('keywords', keywords)
  ensureMetaByName('robots', 'index, follow')

  ensureMetaByProperty('og:site_name', SITE_NAME)
  ensureMetaByProperty('og:type', 'website')
  ensureMetaByProperty('og:title', fullTitle)
  ensureMetaByProperty('og:description', description)
  ensureMetaByName('twitter:card', 'summary_large_image')
  ensureMetaByName('twitter:title', fullTitle)
  ensureMetaByName('twitter:description', description)

  const canonical = `${window.location.origin}${to.path}`
  ensureCanonicalLink(canonical)
  ensureMetaByProperty('og:url', canonical)
}
