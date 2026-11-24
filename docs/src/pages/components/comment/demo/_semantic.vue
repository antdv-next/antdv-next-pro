<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)
const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.1.0' },
  { name: 'inner', desc: t('inner'), version: '1.1.0' },
  { name: 'avatar', desc: t('avatar'), version: '1.1.0' },
  { name: 'content', desc: t('content'), version: '1.1.0' },
  { name: 'header', desc: t('header'), version: '1.1.0' },
  { name: 'author', desc: t('author'), version: '1.1.0' },
  { name: 'datetime', desc: t('datetime'), version: '1.1.0' },
  { name: 'body', desc: t('body'), version: '1.1.0' },
  { name: 'actions', desc: t('actions'), version: '1.1.0' },
  { name: 'children', desc: t('children'), version: '1.1.0' },
])
</script>

<template>
  <SemanticPreview component-name="Comment" :semantics="semantics">
    <template #default="{ classes }">
      <a-comment
        author="Zhang San"
        avatar="https://api.dicebear.com/7.x/miniavs/svg?seed=ZhangSan"
        datetime="5 minutes ago"
        content="We supply a series of design principles, practical patterns and high quality design resources."
        :classes="classes"
      >
        <template #actions>
          <a-button type="text" size="small">
            回复
          </a-button>
        </template>
        <a-comment
          author="Li Si"
          avatar="https://api.dicebear.com/7.x/miniavs/svg?seed=LiSi"
          content="Nested comments are wrapped by the children container, which is styleable on its own."
        />
      </a-comment>
    </template>
  </SemanticPreview>
</template>
