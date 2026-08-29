import type { DefaultComponentDefinition } from './types'

export const defaultComponents: DefaultComponentDefinition[] = [
  {
    componentName: 'ProConfigProvider',
    tagName: 'ap-config-provider',
    description: 'Provides shared configuration for Pro components.',
    lang: 'both',
    attributes: [
      { name: 'prefixCls', description: 'Prefix class name for components.', type: 'string' },
      { name: 'iconPrefixCls', description: 'Prefix class name for icons.', type: 'string' },
      { name: 'direction', description: 'Text direction.', type: '\'ltr\' | \'rtl\'' },
      { name: 'theme', description: 'Theme configuration.', type: 'ThemeConfig' },
      { name: 'componentSize', description: 'Default size of components.', type: '\'small\' | \'middle\' | \'large\'' },
      { name: 'componentDisabled', description: 'Whether components are disabled by default.', type: 'boolean' },
      { name: 'getPopupContainer', description: 'Container for popup elements.', type: '(triggerNode?: HTMLElement) => HTMLElement' },
      { name: 'getTargetContainer', description: 'Container used for scrolling and fixed elements.', type: '() => HTMLElement | Window' },
      { name: 'csp', description: 'Content Security Policy configuration.', type: '{ nonce?: string }' },
      { name: 'renderEmpty', description: 'Render empty content for components.', type: '(...args: any[]) => any' },
      { name: 'virtual', description: 'Whether virtual scrolling is enabled.', type: 'boolean' },
      { name: 'popupMatchSelectWidth', description: 'Whether popup width matches the select width.', type: 'boolean' },
      { name: 'popupOverflow', description: 'Popup overflow strategy.', type: '\'viewport\' | \'scroll\'' },
      { name: 'scrollbar', description: 'Default Scrollbar configuration.', type: 'ScrollbarConfig' },
    ],
    slots: [
      { name: 'default', description: 'Content rendered inside the provider.' },
    ],
  },
]
