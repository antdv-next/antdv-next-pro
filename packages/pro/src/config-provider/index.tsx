import type { App, SlotsType } from 'vue'
import type { ProConfigProviderEmits, ProConfigProviderProps, ProConfigProviderSlots } from './define'
import AntConfigProvider from 'antdv-next/config-provider'
import { computed, defineComponent } from 'vue'
import { useProConfigProvider } from './context'

const ProConfigProvider = defineComponent<
  ProConfigProviderProps,
  ProConfigProviderEmits,
  string,
  SlotsType<ProConfigProviderSlots>
>(
  (props, { slots }) => {
    const antProps = computed(() => {
      const rest = { ...props }
      delete rest.scrollbar
      return rest
    })
    const proConfig = computed(() => ({
      scrollbar: props.scrollbar,
    }))

    useProConfigProvider(proConfig)

    return () => <AntConfigProvider {...antProps.value} v-slots={slots as any} />
  },
  {
    name: 'ApConfigProvider',
  },
)

;(ProConfigProvider as any).install = (app: App) => {
  app.component(ProConfigProvider.name, ProConfigProvider)
}

export default ProConfigProvider
export { useProComponentConfig, useProConfig, useProConfigProvider } from './context'
export type {
  ProConfigProviderEmits,
  ProConfigProviderProps,
  ProConfigProviderSlots,
  ScrollbarConfig,
  ScrollbarMotion,
  ScrollbarVisibility,
} from './define'
