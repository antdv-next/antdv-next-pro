import type { ComponentApiData, MarkdownHookContext, MarkdownHooks } from './types'

export const markdownHooks: MarkdownHooks = {}

function applyHook(
  items: ComponentApiData['attributes'],
  hook: MarkdownHooks[keyof MarkdownHooks] | undefined,
  context: MarkdownHookContext,
) {
  if (!hook)
    return items
  const next = hook(items, context)
  return Array.isArray(next) ? next : items
}

export function applyMarkdownHooks(
  component: ComponentApiData,
  lang: MarkdownHookContext['lang'],
  hooks: MarkdownHooks = markdownHooks,
) {
  const context: MarkdownHookContext = {
    componentName: component.componentName,
    tagName: component.tagName,
    source: component.source,
    lang,
  }

  component.attributes = applyHook(component.attributes, hooks.props, context)
  component.events = applyHook(component.events, hooks.events, context)
  component.slots = applyHook(component.slots, hooks.slots, context)
}
