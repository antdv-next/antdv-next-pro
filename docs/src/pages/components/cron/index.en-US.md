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
| status | Set validation status explicitly; follows Form.Item by default | `'' \| 'error' \| 'success' \| 'validating' \| 'warning'` | - | - |
| preview | Show the description and future local execution times | `boolean` | `false` | ✓ |
| presets | Quick expression choices | `CronPreset[]` | `[]` | ✓ |
| classes | Semantic class customization | `CronClassNamesType` | - | ✓ |
| styles | Semantic style customization | `CronStylesType` | - | ✓ |

### Events

| Event | Description | Type |
| --- | --- | --- |
| update:value | Triggered when the expression changes, including temporary invalid and empty values | `(value: string) => void` |
| change | Triggered when a valid expression is entered or recovered after an invalid draft; repeated valid values do not trigger it | `(value: string) => void` |
| input | Triggered for every manual input, including invalid drafts | `(value: string) => void` |
| validate | Triggered after each expression validation and reports the current result | `(result: CronValidateResult) => void` |

### Form.Item

`v-model:value` always matches the content displayed in the input, so a Form.Item validator receives temporary invalid values. Cron provides Quartz syntax feedback, while Form.Item remains responsible for `required` and business rules:

Direct input keeps the text entered by the user, while validation and field parsing use its canonical form. `size` matches Antdv Next and accepts `'small' | 'medium' | 'large'`, defaulting to `'medium'`.

```vue
<script setup lang="ts">
import { validateCronExpression } from '@antdv-next/pro'

const rules = [
  { required: true, message: 'Enter a Cron expression' },
  {
    validator: async (_rule: unknown, value: string) => {
      if (value && validateCronExpression(value).status !== 'valid')
        throw new Error('Invalid Cron expression')
    },
  },
]
</script>

<template>
  <a-form-item name="cron" :rules="rules">
    <a-cron v-model:value="form.cron" />
  </a-form-item>
</template>
```

### Slots

| Slot | Description |
| --- | --- |
| field | Replace the active field editor |
| presets | Replace the preset area |
| preview | Replace the preview area |
| error | Replace validation error content |

## Quartz Format

Cron accepts exactly six fields by default: `second minute hour day month week`. Set `showYear` to use the required seventh `year` field. The V1 editor supports `*`, `?`, `/`, `-`, and `,`; day and week must contain exactly one `?`. `L`, `W`, and `#` are not supported yet.

It intentionally does not infer or accept the five-field Linux cron format.

The specified mode uses a full-width multi-select control for every field. The year field also accepts custom values through tags input, while month and weekday options display their standard names.

## Internationalization

Like DatePicker, Cron reads the locale from `ConfigProvider`; it does not need a separate locale prop. All 72 locales shipped by Antdv Next have matching Pro locale wrappers with Cron messages. Use a Pro locale wrapper to configure Antdv Next and Cron together, and import the matching dayjs locale in the application:

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

Valid expressions show a human-readable description below the input. With `preview`, the panel shows the next three execution times by default. The preview uses an instance-level dayjs locale and reuses `locale.DatePicker.lang.fieldDateTimeFormat`; the component never changes global `dayjs.locale()`. A plain Antdv Next locale without `Cron` messages falls back to English for the Cron interface.

## Semantic DOM

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Tokens

Customize Cron with `theme.components.Cron`.

<ComponentTokenTable component="Cron" />
