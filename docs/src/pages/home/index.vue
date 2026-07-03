<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@/composables/use-locale'
import Footer from '@/layouts/base/components/footer.vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const { t } = useLocale()

const startLink = computed(() =>
  appStore.locale === 'zh-CN' ? '/components/overview-cn' : '/components/overview',
)
</script>

<template>
  <div class="antdv-home-page min-h-100vh flex flex-col">
    <section class="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
      <img
        src="/antdv-next.svg"
        alt="Antdv Next Pro"
        class="w-24 h-24 mb-8"
        draggable="false"
      >
      <h1 class="text-5xl font-bold mb-6">
        Antdv Next Pro
      </h1>
      <p class="text-lg opacity-65 max-w-xl mb-10">
        {{ t('home.slogan') }}
      </p>
      <div class="flex gap-4 justify-center">
        <router-link :to="startLink">
          <a-button type="primary" size="large">
            {{ t('home.start') }}
          </a-button>
        </router-link>
        <a href="https://github.com/antdv-next/antdv-next-pro" target="_blank" rel="noopener">
          <a-button size="large">
            {{ t('home.designLanguage') }}
          </a-button>
        </a>
      </div>
    </section>

    <Footer />
  </div>
</template>
