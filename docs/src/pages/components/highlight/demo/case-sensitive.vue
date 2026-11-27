<docs lang="zh-CN">
`caseSensitive` 开启后区分大小写，只作用于字符串关键词。
</docs>

<docs lang="en-US">
Turn on `caseSensitive` to match case exactly. It only applies to string keywords.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const caseSensitive = ref(false)
</script>

<template>
  <a-flex vertical gap="small" align="flex-start">
    <a-switch v-model:checked="caseSensitive" checked-children="Aa" un-checked-children="aa" />
    <a-highlight content="Vue, vue and VUE are all the same word." keywords="vue" :case-sensitive="caseSensitive" />
  </a-flex>
</template>
