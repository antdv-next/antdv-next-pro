---
category: Pro Components
title: ProConfigProvider
description: Shared theme, locale, and interaction configuration for Antdv Next and Pro components.
demo:
  cols: 1
group:
  title: Other
  order: 99
---

## When To Use {#when-to-use}

`ProConfigProvider` wraps the `antdv-next` `ConfigProvider`. It forwards the complete Antdv ConfigProvider surface and adds a shared configuration entry for Pro components.

- Set locale, direction, theme, and default component state once at the application root.
- Nest providers for page-level overrides while inheriting values from the outer provider.

After global installation the component is registered as `ap-config-provider`. You can also import `ProConfigProvider` from `@antdv-next/pro` and register it locally.

## Usage {#usage}

```vue
<script setup lang="ts">
import enUS from '@antdv-next/pro/locale/en_US'
</script>

<template>
  <ap-config-provider
    :locale="enUS"
    direction="ltr"
    component-size="middle"
  >
    <router-view />
  </ap-config-provider>
</template>
```

Locale wrappers mirror the objects from `antdv-next/locale/*` and can be imported from `@antdv-next/pro/locale/*`. `ProConfigProvider` does not change the public behavior of the Antdv ConfigProvider.

## Relationship With ConfigProvider {#relationship-with-configprovider}

`ProConfigProvider` composes the `antdv-next` `ConfigProvider`, so it accepts and forwards the complete Antdv ConfigProvider prop surface. When Pro components are used, place `ap-config-provider` at the application root so Antdv base components and Pro components share one configuration.

If the project already uses `a-config-provider`, nest `ap-config-provider` inside it. Outer values are inherited, while explicitly set inner props apply only to that subtree:

```vue
<a-config-provider :theme="theme" direction="ltr">
  <ap-config-provider component-size="large">
    <App />
  </ap-config-provider>
</a-config-provider>
```

You can also nest them in the opposite order to override Antdv values for a local subtree. The Pro context provided by ProConfigProvider remains available there:

```vue
<ap-config-provider component-size="middle">
  <a-config-provider direction="rtl">
    <SettingsPanel />
  </a-config-provider>
</ap-config-provider>
```

Usually you do not need two providers at the application root. Nest them when a page or subtree needs a local override.

## Example Code {#examples}

Most applications need one provider at the root. Locale, theme, and component defaults can be combined:

```vue
<script setup lang="ts">
import enUS from '@antdv-next/pro/locale/en_US'
</script>

<template>
  <ap-config-provider
    :locale="enUS"
    :theme="{ token: { colorPrimary: '#1677ff' } }"
    component-size="middle"
    variant="outlined"
  >
    <router-view />
  </ap-config-provider>
</template>
```

Nest a provider for a page-level override and change only the values that differ:

```vue
<ap-config-provider component-size="large">
  <ap-config-provider component-size="small">
    <SettingsPanel />
  </ap-config-provider>
</ap-config-provider>
```

Customize empty content with a slot:

```vue
<ap-config-provider>
  <template #renderEmpty>
    <a-empty description="No data" />
  </template>
  <a-table :data-source="[]" :columns="columns" />
</ap-config-provider>
```

## API {#api}

### ProConfigProvider Props {#proconfigprovider-props}

All properties are identical to the `antdv-next` `ConfigProvider`. See [Antdv ConfigProvider](https://www.antdv-next.com/components/config-provider) for the complete component configuration surface (`button`, `table`, `input`, `select`, and more).

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| locale | Locale object. Pro locale wrappers have the same shape as Antdv locale objects | `ProLocale` | - |
| direction | Layout direction | `'ltr' \| 'rtl'` | `'ltr'` |
| theme | Theme tokens, algorithms, and component-level configuration | `ThemeConfig` | - |
| componentSize | Default size for descendant components | `'small' \| 'middle' \| 'large'` | `'middle'` |
| componentDisabled | Disable descendant components by default | `boolean` | `false` |
| variant | Default variant for input-like components | `'outlined' \| 'borderless' \| 'filled' \| 'underlined'` | `'outlined'` |
| prefixCls / iconPrefixCls | CSS and icon prefixes | `string` | `'ant'` / `'anticon'` |
| getPopupContainer | Container for popup elements | `(triggerNode?: HTMLElement) => HTMLElement` | - |
| getTargetContainer | Container for fixed and scrolling elements | `() => HTMLElement \| Window` | - |
| csp | Content Security Policy configuration | `{ nonce?: string }` | - |
| virtual | Enable virtual scrolling | `boolean` | `true` |
| popupMatchSelectWidth | Match popup width to Select width | `boolean` | `true` |
| popupOverflow | Popup overflow strategy | `'viewport' \| 'scroll'` | `'viewport'` |

### Slots {#slots}

| Slot | Description |
| --- | --- |
| default | Content wrapped by the provider |
| renderEmpty | Custom empty state for Table, List, and other components; receives the component name |
| transformCellText | Transform Table cell text as a prop or named slot; receives `{ text, column, record, index }` |

### Nesting Rules {#nesting-rules}

Providers follow the Antdv ConfigProvider inheritance rules: values omitted by an inner provider are resolved from an outer provider or defaults, while explicitly set inner values apply only to that subtree.
