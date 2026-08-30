import type { AntdvMenuItem } from './interface'
import type { InnerLocale } from '@/utils/locale'
import proPkg from '@antdv-next/pro/package.json'
import locales from '@/locales'

// Helper function to convert nested component locales to flat structure
// e.g., { components: { scrollbar: 'Scrollbar' } } -> { '/components/scrollbar': 'Scrollbar', 'navigation': '导航' }
function flattenComponentLocales(nestedLocales: { components: Record<string, string> }) {
  const flattened: Record<string, string> = {}
  const components = nestedLocales.components
  const groupKeyMap: Record<string, string> = {
    general: 'general',
    layoutGroup: 'layoutGroup',
    navigation: 'navigation',
    dataEntry: 'data-entry',
    dataDisplay: 'dataDisplay',
    feedback: 'feedback',
    other: 'other',
  }

  for (const [key, value] of Object.entries(components)) {
    // Group labels (general, layoutGroup, navigation, etc.) don't have /components/ prefix
    if (groupKeyMap[key]) {
      flattened[groupKeyMap[key]] = value
    }
    else {
      // Component paths get /components/ prefix
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      flattened[`/components/${kebabKey}`] = value
    }
  }

  return flattened
}

// Export locale map by converting centralized locales to the expected format
export const componentLocales: Record<string, Record<InnerLocale, string>> = (() => {
  const zhFlat = flattenComponentLocales(locales['zh-CN'].menuComponents)
  const enFlat = flattenComponentLocales(locales['en-US'].menuComponents)

  const result: Record<string, Record<InnerLocale, string>> = {}

  for (const key of Object.keys(zhFlat)) {
    const zhValue = zhFlat[key]
    const enValue = enFlat[key]
    if (zhValue && enValue) {
      result[key] = {
        'zh-CN': zhValue,
        'en-US': enValue,
      }
    }
  }

  return result
})()

export const components: AntdvMenuItem[] = [
  { key: '/components/overview', label: '/components/overview' },
  { key: '/components/changelog', label: '/components/changelog', tag: `v${proPkg.version}` },
  {
    key: 'navigation',
    label: 'navigation',
    type: 'group',
    children: [
      { key: '/components/scrollbar', label: '/components/scrollbar' },
    ],
  },
  {
    key: 'dataDisplay',
    label: 'dataDisplay',
    type: 'group',
    children: [
      { key: '/components/heatmap', label: '/components/heatmap', tag: '1.1.0' },
    ],
  },
]
