import type { AntdvMenuItem } from './interface'
import type { Menu } from '@/locales/zh-CN/menu'
import type { InnerLocale } from '@/utils/locale'
import locales from '@/locales'
import { components } from './components'

// Helper to flatten nested docs locales
function flattenDocsLocales(nestedLocales: Menu) {
  const vue = nestedLocales.docs.vue
  return {
    '/docs/vue/introduce': vue.introduce,
    '/docs/vue/use': vue.use,
    '/docs/vue/getting-started': vue.gettingStarted,
    '/docs/vue/other': vue.other,
    '/docs/vue/contributing': vue.contributing,
  }
}

// Export locale map by converting centralized locales to the expected format
export const docsMenuLocales: Record<string, Record<InnerLocale, string>> = (() => {
  const zhFlat = flattenDocsLocales(locales['zh-CN'].menu)
  const enFlat = flattenDocsLocales(locales['en-US'].menu)

  const result: Record<string, Record<InnerLocale, string>> = {}

  for (const key of Object.keys(zhFlat)) {
    result[key] = {
      'zh-CN': zhFlat[key as keyof typeof zhFlat],
      'en-US': enFlat[key as keyof typeof enFlat],
    }
  }

  return result
})()

export const docsMenus: Record<string, AntdvMenuItem[]> = {
  '/docs/vue': [
    {
      key: '/docs/vue/introduce',
      label: '/docs/vue/introduce',
    },
    {
      key: '/docs/vue/use',
      label: '/docs/vue/use',
      type: 'group',
      children: [
        {
          key: '/docs/vue/getting-started',
          label: '/docs/vue/getting-started',
        },
      ],
    },
    {
      key: '/docs/vue/other',
      label: '/docs/vue/other',
      type: 'group',
      children: [
        {
          key: '/docs/vue/contributing',
          label: '/docs/vue/contributing',
        },
      ],
    },
  ],
  '/components': components,
}
