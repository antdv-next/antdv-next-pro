<script setup lang="ts">
import { ref } from 'vue'

const tags = ref(['Vue', 'TypeScript'])
</script>

<template>
  <a-input-tag v-model:value="tags" placeholder="Add a tag" />
</template>
