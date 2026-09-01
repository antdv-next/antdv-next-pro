<script setup lang="ts">
import { ref } from 'vue'

const tags = ref(['controlled'])
const inputValue = ref('')
</script>

<template>
  <a-input-tag v-model:value="tags" v-model:input-value="inputValue" allow-clear />
</template>
