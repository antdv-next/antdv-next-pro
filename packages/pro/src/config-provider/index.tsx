import type { App, SlotsType } from 'vue'
import type { ProConfigContextProps, ProConfigProviderEmits, ProConfigProviderProps, ProConfigProviderSlots } from './define'
import AntConfigProvider from 'antdv-next/config-provider'
import { computed, defineComponent } from 'vue'
import { useProConfigProvider } from './context'
import { PRO_CONFIG_KEYS } from './define'

const ProConfigProvider = defineComponent<
  ProConfigProviderProps,
  ProConfigProviderEmits,
  string,
  SlotsType<ProConfigProviderSlots>
>(
  (props, { slots }) => {
    const proConfig = computed(() => Object.fromEntries(
      PRO_CONFIG_KEYS.map(key => [key, props[key]]),
    ) as ProConfigContextProps)

    useProConfigProvider(proConfig)

    return () => {
      const antProps = Object.fromEntries(
        Object.entries(props).filter(([key]) => !PRO_CONFIG_KEYS.includes(key as typeof PRO_CONFIG_KEYS[number])),
      )
      return <AntConfigProvider {...antProps} v-slots={slots as any} />
    }
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
  HeatmapConfig,
  ProConfigProviderEmits,
  ProConfigProviderProps,
  ProConfigProviderSlots,
  ScrollbarConfig,
  ScrollbarMotion,
  ScrollbarVisibility,
} from './define'
