import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { ScrollbarConfig } from './define'
import { computed, inject, provide, ref } from 'vue'

export interface ProConfigContextProps {
  scrollbar?: ScrollbarConfig
}

const EMPTY_OBJECT = {}
const ProConfigKey: InjectionKey<Ref<ProConfigContextProps>> = Symbol('ProConfigContext')

export function useProConfigProvider(config: Ref<ProConfigContextProps>) {
  provide(ProConfigKey, config)
}

export function useProConfig() {
  return inject(ProConfigKey, ref({}) as Ref<ProConfigContextProps>)
}

export function useProComponentConfig<T extends keyof ProConfigContextProps>(propName: T): ComputedRef<NonNullable<ProConfigContextProps[T]> & {
  classes: Record<string, string>
  styles: Record<string, any>
}> {
  const config = useProConfig()
  return computed(() => {
    const value = config.value[propName] as Record<string, any> | undefined
    return {
      classes: EMPTY_OBJECT,
      styles: EMPTY_OBJECT,
      ...value,
    } as NonNullable<ProConfigContextProps[T]> & {
      classes: Record<string, string>
      styles: Record<string, any>
    }
  })
}
