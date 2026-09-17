import type { DefaultComponentDefinition } from './types'

export const defaultComponents: DefaultComponentDefinition[] = [
  {
    componentName: 'ProConfigProvider',
    tagName: 'ap-config-provider',
    description: 'Provides shared configuration for Pro components.',
    lang: 'both',
    attributes: [
      { name: 'locale', description: 'Locale object. Pro locale wrappers have the same shape as Antdv locale objects.', type: 'ProLocale' },
      { name: 'prefixCls', description: 'Prefix class name for components.', type: 'string' },
      { name: 'iconPrefixCls', description: 'Prefix class name for icons.', type: 'string' },
      { name: 'direction', description: 'Text direction.', type: '\'ltr\' | \'rtl\'' },
      { name: 'theme', description: 'Theme configuration.', type: 'ThemeConfig' },
      { name: 'componentSize', description: 'Default size of components.', type: '\'small\' | \'medium\' | \'large\'' },
      { name: 'componentDisabled', description: 'Whether components are disabled by default.', type: 'boolean' },
      { name: 'variant', description: 'Default variant of input components.', type: '\'outlined\' | \'borderless\' | \'filled\' | \'underlined\'' },
      { name: 'getPopupContainer', description: 'Container for popup elements.', type: '(triggerNode?: HTMLElement) => HTMLElement' },
      { name: 'getTargetContainer', description: 'Container used for scrolling and fixed elements.', type: '() => HTMLElement | Window' },
      { name: 'csp', description: 'Content Security Policy configuration.', type: '{ nonce?: string }' },
      { name: 'renderEmpty', description: 'Render empty content for components.', type: '(...args: any[]) => any' },
      { name: 'virtual', description: 'Whether virtual scrolling is enabled.', type: 'boolean' },
      { name: 'popupMatchSelectWidth', description: 'Whether popup width matches the select width.', type: 'boolean' },
      { name: 'popupOverflow', description: 'Popup overflow strategy.', type: '\'viewport\' | \'scroll\'' },
      { name: 'comment', description: 'Default Comment configuration.', type: 'CommentConfig' },
      { name: 'cron', description: 'Default Cron configuration.', type: 'CronConfig' },
      { name: 'heatmap', description: 'Default Heatmap configuration.', type: 'HeatmapConfig' },
      { name: 'scrollbar', description: 'Default Scrollbar configuration.', type: 'ScrollbarConfig' },
      { name: 'inputTag', description: 'Default InputTag configuration.', type: 'InputTagConfig' },
    ],
    slots: [
      { name: 'default', description: 'Content rendered inside the provider.' },
      { name: 'renderEmpty', description: 'Custom empty state for Table, List, and other components.' },
      { name: 'transformCellText', description: 'Transform table cell text. Accepts { text, column, record, index }.' },
    ],
  },
]
