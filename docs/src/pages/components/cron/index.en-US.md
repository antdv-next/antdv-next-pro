---
category: Pro Components
title: Cron
description: A panel editor for Quartz and Unix cron expressions.
demo:
  cols: 1
group:
  title: Data Entry
  order: 1
---

## When To Use {#when-to-use}

- Configure a recurring task, report, synchronization, or notification.
- Let users edit a Quartz or Unix cron expression without memorizing its syntax.

## Examples {#examples}

<demo-group>
  <demo src="./demo/basic.vue">Basic</demo>
  <demo src="./demo/format.vue">Cron format</demo>
  <demo src="./demo/dropdown.vue">Dropdown</demo>
  <demo src="./demo/form.vue">Form</demo>
  <demo src="./demo/presets.vue">Presets and preview</demo>
  <demo src="./demo/semantic.vue">Semantic styling</demo>
</demo-group>

## API {#api}

### Properties

| Property | Description | Type | Default | Global Config |
| --- | --- | --- | --- | --- |
| value | Controlled cron expression | `string` | - | - |
| format | Cron dialect | `'quartz' \| 'unix'` | `'quartz'` | ✓ |
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

### CronError

`validateCronExpression()` and the `validate` event return `errors` when the expression is invalid. Match `code`, not the localized `message`.

| Property | Description | Type |
| --- | --- | --- |
| field | The invalid field; omitted for expression-level errors | `CronFieldName` |
| code | Stable error code that does not change with locale | `CronErrorCode` |
| message | Localized explanation | `string` |

### Form.Item

`v-model:value` matches the input text, so Form.Item can validate the value being edited. Use `validateCronExpression` for format checks; keep `required` on Form.Item. Pass `{ format: 'unix' }` when validating Unix expressions.

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

## Cron Format

Default `format` is `quartz`. Quartz uses six fields: `second minute hour day month week`. Set `showYear` to require the seventh `year` field. Day and week must contain exactly one `?`.

Unix format uses five fields: `minute hour day month week`. It does not have seconds, year, or `?`. Day and week may both be specified; Croner treats that as OR. Unix Sunday can be written as `0`, `7`, or `SUN`. Direct input keeps the original token; editing the specified weekday in the visual editor canonicalizes it to `SUN`.

`validateCronExpression(value, { format: 'unix' })` must be used when validating Unix expressions.

## Special Syntax

Quartz day/week fields support Croner special syntax:

| Syntax | Field | Meaning |
| --- | --- | --- |
| `L` | Day | Last day of the month |
| `nW` | Day | Nearest weekday to day `n` |
| `LW` | Day | Last weekday of the month |
| `nL` | Week | Last weekday `n` of the month |
| `n#N` | Week | Nth weekday `n` of the month |

`L-n` is not supported. Unix format does not accept these tokens.

The specified mode uses a full-width multi-select control for every field. The year field also accepts custom values through tags input, while month and weekday options display their standard names.

## Semantic DOM {#semantic-dom}

<demo src="./demo/_semantic.vue" simplify></demo>

## Design Tokens {#design-tokens}

Customize Cron styles through `theme.components.Cron`:

<ComponentTokenTable component="Cron" />
