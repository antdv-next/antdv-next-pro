<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'content', desc: t('content'), version: '1.0.0' },
  { name: 'tag', desc: t('tag'), version: '1.0.0' },
  { name: 'input', desc: t('input'), version: '1.0.0' },
  { name: 'suffix', desc: t('suffix'), version: '1.0.0' },
  { name: 'clear', desc: t('clear'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="InputTag"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-input-tag
        :default-value="['Vue', 'TypeScript']"
        default-input-value="draft"
        allow-clear
        :classes="classes"
      />
    </template>
  </SemanticPreview>
</template>
