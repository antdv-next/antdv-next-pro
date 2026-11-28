<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)
const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.1.0' },
  { name: 'header', desc: t('header'), version: '1.1.0' },
  { name: 'pre', desc: t('pre'), version: '1.1.0' },
  { name: 'line', desc: t('line'), version: '1.1.0' },
  { name: 'lineNumber', desc: t('lineNumber'), version: '1.1.0' },
  { name: 'marker', desc: t('marker'), version: '1.1.0' },
  { name: 'copy', desc: t('copy'), version: '1.1.0' },
])

const content = ` const total = 3
-const page = 1
+const page = 2
 const pageSize = 20`
</script>

<template>
  <SemanticPreview component-name="Code" :semantics="semantics">
    <template #default="{ classes }">
      <a-code
        :content="content"
        diff
        show-line-numbers
        copyable
        :classes="classes"
        style="width: 100%"
      />
    </template>
  </SemanticPreview>
</template>
