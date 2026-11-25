<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)
const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.1.0' },
  { name: 'highlight', desc: t('highlight'), version: '1.1.0' },
])
</script>

<template>
  <SemanticPreview component-name="Highlight" :semantics="semantics">
    <template #default="{ classes }">
      <a-highlight
        content="We supply a series of design principles, practical patterns and high quality design resources."
        :keywords="['design', 'patterns']"
        :classes="classes"
      />
    </template>
  </SemanticPreview>
</template>
