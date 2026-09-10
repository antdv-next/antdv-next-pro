<docs lang="zh-CN">
Quartz 六字段、七字段和 Unix 五字段是三种独立格式。切换 `format` 或 `showYear` 不会自动改写表达式。
</docs>

<docs lang="en-US">
Quartz six-field, seven-field, and Unix five-field cron are independent formats. Switching `format` or `showYear` does not rewrite the expression.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const quartz = ref('0 0 9 * * ?')
const quartzYear = ref('0 0 9 * * ? *')
const unix = ref('0 9 * * 1-5')
</script>

<template>
  <div style="display: grid; gap: 24px;">
    <div>
      <div style="margin-bottom: 8px;">
        Quartz · 6 fields
      </div>
      <a-cron v-model:value="quartz" />
    </div>
    <div>
      <div style="margin-bottom: 8px;">
        Quartz · 7 fields
      </div>
      <a-cron v-model:value="quartzYear" show-year />
    </div>
    <div>
      <div style="margin-bottom: 8px;">
        Unix · 5 fields
      </div>
      <a-cron v-model:value="unix" format="unix" />
    </div>
  </div>
</template>
