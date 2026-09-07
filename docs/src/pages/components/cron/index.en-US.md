---
category: Pro Components
title: Cron
description: A panel editor for Quartz cron expressions.
demo:
  cols: 1
group:
  title: Data Entry
  order: 1
---

## When To Use

- Configure a recurring task, report, synchronization, or notification.
- Let users edit a Quartz six-field expression without memorizing its syntax.

## Examples

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/presets.vue">Presets and preview</demo>
  <demo src="./demo/semantic.vue">Semantic styling</demo>
</demo-group>

## API

### Properties

| Property | Description | Type | Default | Global Config |
| --- | --- | --- | --- | --- |
| value | Controlled Quartz expression | `string` | - | - |
| showYear | Use the seven-field Quartz format | `boolean` | `false` | ✓ |
| disabled | Disable all interaction | `boolean` | `false` | ✓ |
| readonly | Keep the expression selectable but prevent edits | `boolean` | `false` | ✓ |
| size | Control size | `'small' \| 'medium' \| 'large'` | `'medium'` | ✓ |
| preview | Show the description and next local execution time | `boolean` | `false` | ✓ |
| presets | Quick expression choices | `CronPreset[]` | `[]` | ✓ |
| classes | Semantic class customization | `CronClassNamesType` | - | ✓ |
| styles | Semantic style customization | `CronStylesType` | - | ✓ |

### Events

| Event | Description | Type |
| --- | --- | --- |
| update:value | Triggered only after a valid expression is produced | `(value: string) => void` |
| change | Triggered with an effective valid change | `(value: string) => void` |
| input | Triggered for every manual input, including invalid drafts | `(value: string) => void` |
| validate | Triggered when validation state changes | `(result: CronValidateResult) => void` |

### Slots

| Slot | Description |
| --- | --- |
| field | Replace the active field editor |
| presets | Replace the preset area |
| preview | Replace the preview area |
| error | Replace validation error content |

## Quartz Format

Cron accepts exactly six fields by default: `second minute hour day month week`. Set `showYear` to use the required seventh `year` field. The V1 editor supports `*`, `?`, `/`, `-`, and `,`; day and week must contain exactly one `?`.

It intentionally does not infer or accept the five-field Linux cron format.

## Internationalization

Like DatePicker, Cron reads the locale from `ConfigProvider`; it does not need a separate locale prop. Use a Pro locale wrapper to configure Antdv Next and Cron together, and import the matching dayjs locale in the application:

```vue
<script setup lang="ts">
import enUS from '@antdv-next/pro/locale/en_US'
import 'dayjs/locale/en'
</script>

<template>
  <ap-config-provider :locale="enUS">
    <a-cron v-model:value="value" preview />
  </ap-config-provider>
</template>
```

The preview uses an instance-level dayjs locale and reuses `locale.DatePicker.lang.fieldDateTimeFormat`; the component never changes global `dayjs.locale()`.

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Tokens

Customize Cron with `theme.components.Cron`.

<ComponentTokenTable component="Cron" />
