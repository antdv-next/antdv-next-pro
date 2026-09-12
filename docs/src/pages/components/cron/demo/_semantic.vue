<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)
const value = ref('0 0 9 ? * MON,FRI')
const presets = [
  { label: 'Every hour', value: '0 0 * * * ?' },
  { label: 'Weekdays 09:00', value: '0 0 9 ? * MON-FRI' },
]

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.1.0' },
  { name: 'input', desc: t('input'), version: '1.1.0' },
  { name: 'fields', desc: t('fields'), version: '1.1.0' },
  { name: 'navigation', desc: t('navigation'), version: '1.1.0' },
  { name: 'editor', desc: t('editor'), version: '1.1.0' },
  { name: 'field', desc: t('field'), version: '1.1.0' },
  { name: 'presets', desc: t('presets'), version: '1.1.0' },
  { name: 'preview', desc: t('preview'), version: '1.1.0' },
  { name: 'error', desc: t('error'), version: '1.1.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Cron"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-cron
        v-model:value="value"
        preview
        :presets="presets"
        :classes="classes"
        style="width: 100%;"
      />
    </template>
  </SemanticPreview>
</template>
