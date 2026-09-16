<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.1.0' },
  { name: 'viewport', desc: t('viewport'), version: '1.1.0' },
  { name: 'content', desc: t('content'), version: '1.1.0' },
  { name: 'rail', desc: t('rail'), version: '1.1.0' },
  { name: 'railItem', desc: t('railItem'), version: '1.1.0' },
  { name: 'railTick', desc: t('railTick'), version: '1.1.0' },
  { name: 'preview', desc: t('preview'), version: '1.1.0' },
  { name: 'backToBottom', desc: t('backToBottom'), version: '1.1.0' },
])

const messages = Array.from({ length: 10 }, (_, index) => ({
  id: `semantic-message-${index + 1}`,
  from: index % 2 === 0 ? 'user' : 'assistant',
  content: `Message ${index + 1}: observe the semantic structures of the conversation viewport.`,
}))
</script>

<template>
  <SemanticPreview
    component-name="MessageScroller"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-message-scroller
        navigation="rail"
        back-to-bottom
        :items="messages.map((message, index) => ({ id: message.id, title: `Message ${index + 1}`, description: message.content }))"
        :classes="classes"
        :style="{
          height: '280px',
          borderRadius: '14px',
          border: '1px solid var(--ant-color-border)',
        }"
      >
        <div
          v-for="message in messages"
          :key="message.id"
          :data-message-id="message.id"
          style="padding: 8px 16px;"
        >
          <div style="padding: 8px 12px; border-radius: 12px; background: var(--ant-color-fill-secondary);">
            {{ message.content }}
          </div>
        </div>
      </a-message-scroller>
    </template>
  </SemanticPreview>
</template>
