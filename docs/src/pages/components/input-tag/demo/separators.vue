<script setup lang="ts">
import { ref } from 'vue'

const tags = ref<string[]>([])
</script>

<template>
  <a-input-tag v-model:value="tags" :token-separators="[',', ' ']" placeholder="Type comma or space" />
</template>
