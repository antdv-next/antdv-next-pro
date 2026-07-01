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
    const proConfig = computed(() => ({
      scrollbar: props.scrollbar,
    }))

    useProConfigProvider(proConfig)

    return () => (
      <AntConfigProvider
        prefixCls={props.prefixCls}
        iconPrefixCls={props.iconPrefixCls}
        direction={props.direction}
        theme={props.theme}
        componentSize={props.componentSize as any}
        componentDisabled={props.componentDisabled}
        getPopupContainer={props.getPopupContainer}
        getTargetContainer={props.getTargetContainer}
        csp={props.csp}
        renderEmpty={props.renderEmpty as any}
        virtual={props.virtual}
        popupMatchSelectWidth={props.popupMatchSelectWidth}
        popupOverflow={props.popupOverflow}
      >
        {slots.default?.()}
      </AntConfigProvider>
    )
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
  ScrollbarVisibility,
} from './define'
