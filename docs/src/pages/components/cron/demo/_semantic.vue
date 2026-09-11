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
  { name: 'root', desc: t('root') },
  { name: 'input', desc: t('input') },
  { name: 'fields', desc: t('fields') },
  { name: 'navigation', desc: t('navigation') },
  { name: 'editor', desc: t('editor') },
  { name: 'field', desc: t('field') },
  { name: 'presets', desc: t('presets') },
  { name: 'preview', desc: t('preview') },
  { name: 'error', desc: t('error') },
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
