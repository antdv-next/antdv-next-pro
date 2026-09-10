<docs lang="zh-CN">
配合 Form.Item 做必填和格式校验。Unix 表达式必须把 `format: 'unix'` 传给 `validateCronExpression`。
</docs>

<docs lang="en-US">
Use Form.Item for required and format checks. Unix expressions must pass `{ format: 'unix' }` to `validateCronExpression`.
</docs>

<script setup lang="ts">
import { validateCronExpression } from '@antdv-next/pro'
import { reactive } from 'vue'

const model = reactive({
  quartz: '0 0 9 * * ?',
  unix: '0 9 * * 1-5',
})

const quartzRules = [
  { required: true, message: 'Enter a Quartz Cron expression' },
  {
    validator: async (_rule: unknown, value: string) => {
      if (value && validateCronExpression(value).status !== 'valid')
        throw new Error('Invalid Quartz Cron expression')
    },
  },
]

const unixRules = [
  { required: true, message: 'Enter a Unix Cron expression' },
  {
    validator: async (_rule: unknown, value: string) => {
      if (value && validateCronExpression(value, { format: 'unix' }).status !== 'valid')
        throw new Error('Invalid Unix Cron expression')
    },
  },
]
</script>

<template>
  <a-form :model="model" layout="vertical">
    <a-form-item name="quartz" label="Quartz" :rules="quartzRules">
      <a-cron v-model:value="model.quartz" />
    </a-form-item>
    <a-form-item name="unix" label="Unix" :rules="unixRules">
      <a-cron v-model:value="model.unix" format="unix" />
    </a-form-item>
  </a-form>
</template>
