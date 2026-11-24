import { isRef } from 'vue'

// antdv-next has no first-class ./form/context export; isolate the dist wildcard import here.
export {
  useFormItemInputContext,
  useFormItemInputContextProvider,
} from 'antdv-next/dist/form/context'

export function unwrapExposedElement<T extends HTMLElement>(value: unknown): T | null {
  const resolved = isRef(value) ? value.value : value
  // SSR（Node）下没有 DOM 全局变量，直接返回 null，避免在渲染期抛 ReferenceError。
  if (typeof HTMLElement === 'undefined') {
    return null
  }
  return resolved instanceof HTMLElement ? resolved as T : null
}
