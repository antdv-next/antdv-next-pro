import type { ApiTableItem, ComponentApiData, DefaultComponentDefinition } from './types'
import { toKebabCase } from './utils'

export type ComponentLangMap = Map<string, { zh?: ComponentApiData, en?: ComponentApiData }>

function normalizeItems(items: ApiTableItem[] | undefined, toKebab = false) {
  if (!items)
    return []
  return items.map(item => ({
    ...item,
    name: toKebab ? toKebabCase(item.name) : item.name,
  }))
}

function buildComponentData(definition: DefaultComponentDefinition): ComponentApiData {
  const tagName = definition.tagName || `a-${toKebabCase(definition.componentName)}`
  return {
    tagName,
    componentName: definition.componentName,
    description: definition.description || '',
    source: definition.source || 'defaults.ts',
    attributes: normalizeItems(definition.attributes, true),
    events: normalizeItems(definition.events),
    slots: normalizeItems(definition.slots),
  }
}

function resolveLangs(lang: DefaultComponentDefinition['lang']) {
  if (lang === 'zh' || lang === 'en')
    return [lang]
  return ['zh', 'en'] as const
}

export function applyDefaults(componentMap: ComponentLangMap, defaults: DefaultComponentDefinition[]) {
  defaults.forEach((definition) => {
    const component = buildComponentData(definition)
    const autoTag = `a-${toKebabCase(definition.componentName)}`
    const entry = componentMap.get(component.tagName) || {}
    const langs = resolveLangs(definition.lang)

    // 显式 tagName 与按组件名自动推导的 `a-` 前缀不一致时（如 ap-config-provider），
    // 文档解析结果挂在自动推导的 tag 下：把文档数据重映射到真实 tag，并移除幽灵 tag，
    // 避免 IDE 补全出不存在的元素。
    if (component.tagName !== autoTag) {
      const autoEntry = componentMap.get(autoTag)
      if (autoEntry && (autoEntry.zh || autoEntry.en)) {
        langs.forEach((lang) => {
          if (autoEntry[lang] && !entry[lang])
            entry[lang] = { ...autoEntry[lang], tagName: component.tagName }
          else if (!entry[lang])
            entry[lang] = component
        })
        componentMap.set(component.tagName, entry)
        componentMap.delete(autoTag)
        return
      }
    }

    langs.forEach((lang) => {
      if (!entry[lang])
        entry[lang] = component
    })

    componentMap.set(component.tagName, entry)
  })
}
