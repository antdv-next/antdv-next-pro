<docs lang="zh-CN">
同时控制标签列表和输入框内容，适合需要同步管理两部分状态的场景。
</docs>

<docs lang="en-US">
Control both the tag list and input value for cases where both pieces of state need to be synchronized.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const tags = ref(['controlled'])
const inputValue = ref('')
</script>

<template>
  <a-input-tag v-model:value="tags" v-model:input-value="inputValue" allow-clear />
</template>
