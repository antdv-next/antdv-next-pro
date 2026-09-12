import { isRef } from 'vue'

// antdv-next has no first-class ./form/context export; isolate the dist wildcard import here.
export {
  useFormItemInputContext,
  useFormItemInputContextProvider,
} from 'antdv-next/dist/form/context'

export function unwrapExposedElement<T extends HTMLElement>(value: unknown): T | null {
  const resolved = isRef(value) ? value.value : value
  return resolved instanceof HTMLElement ? resolved as T : null
}
