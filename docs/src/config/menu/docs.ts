import type { AntdvMenuItem } from './interface'
import type { InnerLocale } from '@/utils/locale'
import { components } from './components'

// Pro docs currently only ships the components section; docs/blog sections
// can be re-added here once the corresponding pages exist.
export const docsMenuLocales: Record<string, Record<InnerLocale, string>> = {}

export const docsMenus: Record<string, AntdvMenuItem[]> = {
  '/components': components,
}
