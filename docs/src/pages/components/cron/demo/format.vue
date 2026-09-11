<docs lang="zh-CN">
Quartz 六字段、七字段和 Unix 五字段是三种独立格式。切换 `format` 或 `showYear` 不会自动改写表达式。
</docs>

<docs lang="en-US">
Quartz six-field, seven-field, and Unix five-field cron are independent formats. Switching `format` or `showYear` does not rewrite the expression.
</docs>

<script setup lang="ts">
import { computed, ref } from 'vue'

const mode = ref<'quartz' | 'quartz-year' | 'unix'>('quartz')
const size = ref<'small' | 'medium' | 'large'>('medium')
const quartz = ref('0 0 9 * * ?')
const quartzYear = ref('0 0 9 * * ? *')
const unix = ref('0 9 * * 1-5')
const options = [
  { label: 'Quartz · 6 fields', value: 'quartz' },
  { label: 'Quartz · 7 fields', value: 'quartz-year' },
  { label: 'Unix · 5 fields', value: 'unix' },
]
const sizes = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
]

const value = computed({
  get: () => {
    if (mode.value === 'unix')
      return unix.value
    if (mode.value === 'quartz-year')
      return quartzYear.value
    return quartz.value
  },
  set: (next: string) => {
    if (mode.value === 'unix')
      unix.value = next
    else if (mode.value === 'quartz-year')
      quartzYear.value = next
    else
      quartz.value = next
  },
})
</script>

<template>
  <div>
    <a-flex vertical gap="middle" style="margin-bottom: 16px;">
      <a-radio-group v-model:value="mode" option-type="button" :options="options" />
      <a-radio-group v-model:value="size" option-type="button" :options="sizes" />
    </a-flex>
    <a-cron
      :key="mode"
      v-model:value="value"
      :format="mode === 'unix' ? 'unix' : 'quartz'"
      :show-year="mode === 'quartz-year'"
      :size="size"
    />
  </div>
</template>
