<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)
const day = 86400000
const today = new Date()
const end = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
const start = end - 181 * day
const data = Array.from({ length: 182 }, (_, index) => ({
  timestamp: start + index * day,
  value: index % 5 === 0 ? 0 : (index % 10) + 1,
}))
const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.1.0' },
  { name: 'content', desc: t('content'), version: '1.1.0' },
  { name: 'cell', desc: t('cell'), version: '1.1.0' },
  { name: 'footer', desc: t('footer'), version: '1.1.0' },
  { name: 'indicator', desc: t('indicator'), version: '1.1.0' },
])
</script>

<template>
  <SemanticPreview component-name="Heatmap" :semantics="semantics">
    <template #default="{ classes }">
      <a-heatmap :data="data" :range="{ start, end }" :classes="classes" />
    </template>
  </SemanticPreview>
</template>
