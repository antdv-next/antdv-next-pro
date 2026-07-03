<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'container', desc: t('container'), version: '1.0.0' },
  { name: 'content', desc: t('content'), version: '1.0.0' },
  { name: 'track', desc: t('track'), version: '1.0.0' },
  { name: 'trackX', desc: t('trackX'), version: '1.0.0' },
  { name: 'trackY', desc: t('trackY'), version: '1.0.0' },
  { name: 'thumb', desc: t('thumb'), version: '1.0.0' },
  { name: 'thumbX', desc: t('thumbX'), version: '1.0.0' },
  { name: 'thumbY', desc: t('thumbY'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Scrollbar"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-scrollbar
        visibility-x="always"
        visibility-y="always"
        style="height: 220px; border-radius: 14px;"
        :classes="classes"
      >
        <div style="min-width: 640px; padding: 16px;">
          <a-flex justify="space-between" align="center" style="margin-bottom: 12px;">
            <a-typography-title :level="5" style="margin: 0;">
              Semantic Scroll Area
            </a-typography-title>
            <a-tag color="processing">
              8 rows
            </a-tag>
          </a-flex>

          <a-flex vertical gap="small">
            <div
              v-for="index in 8"
              :key="index"
              style="display: grid; grid-template-columns: 120px 1fr 120px; gap: 12px; min-width: 600px; padding: 12px 14px; border-radius: 10px; background: color-mix(in srgb, var(--ant-color-fill-secondary), transparent 12%);"
            >
              <strong>Block {{ index }}</strong>
              <span>Observe semantic highlights for root, container, content, track, and thumbs.</span>
              <a-tag :color="index % 2 === 0 ? 'success' : 'default'">
                {{ index % 2 === 0 ? 'Visible' : 'Queued' }}
              </a-tag>
            </div>
          </a-flex>
        </div>
      </a-scrollbar>
    </template>
  </SemanticPreview>
</template>
