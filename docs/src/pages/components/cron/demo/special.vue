<docs lang="zh-CN">
Quartz 日/周字段支持 L、LW、nW、nL 和 n#N。下面两个例子分别是每月最后一个工作日，以及每月第三个星期五。
</docs>

<docs lang="en-US">
Quartz day and week fields support L, LW, nW, nL, and n#N. These examples run on the last weekday of the month, and on the third Friday.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const lastWeekday = ref('0 0 9 LW * ?')
const thirdFriday = ref('0 0 9 ? * 6#3')
</script>

<template>
  <div style="display: grid; gap: 24px;">
    <div>
      <div style="margin-bottom: 8px;">
        {{ 'Last weekday · 0 0 9 LW * ?' }}
      </div>
      <a-cron v-model:value="lastWeekday" preview />
    </div>
    <div>
      <div style="margin-bottom: 8px;">
        {{ 'Third Friday · 0 0 9 ? * 6#3' }}
      </div>
      <a-cron v-model:value="thirdFriday" preview />
    </div>
  </div>
</template>
