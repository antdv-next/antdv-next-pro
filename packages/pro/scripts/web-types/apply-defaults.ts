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
    const entry = componentMap.get(component.tagName) || {}
    const langs = resolveLangs(definition.lang)

    langs.forEach((lang) => {
      if (!entry[lang])
        entry[lang] = component
    })

    componentMap.set(component.tagName, entry)
  })
}
