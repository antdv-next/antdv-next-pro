<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const options = [
  { label: 'Status', value: 'status', children: [{ label: 'Open', value: 'open' }] },
  { label: 'Name', value: 'name', type: 'input' as const },
]

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.1.0' },
  { name: 'prefix', desc: t('prefix'), version: '1.1.0' },
  { name: 'content', desc: t('content'), version: '1.1.0' },
  { name: 'tag', desc: t('tag'), version: '1.1.0' },
  { name: 'input', desc: t('input'), version: '1.1.0' },
  { name: 'suffix', desc: t('suffix'), version: '1.1.0' },
  { name: 'clear', desc: t('clear'), version: '1.1.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="CategorySearch"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-category-search
        :options="options"
        :default-value="[{ key: 'status', value: 'open' }]"
        default-search-value="keyword"
        allow-clear
        :classes="classes"
      >
        <template #prefix>
          🔍
        </template>
      </a-category-search>
    </template>
  </SemanticPreview>
</template>
