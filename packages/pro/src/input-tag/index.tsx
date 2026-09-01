import type { InputProps, InputRef, SizeType, TagProps } from 'antdv-next'
import type { Variant } from 'antdv-next/config-provider/context'
import type { App, ComputedRef, CSSProperties, ShallowRef, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/semantic'
import type { InputTagConfig } from '../config-provider'
import { clsx, useMergedState } from '@v-c/util'
import { Input as AInput, Tag as ATag } from 'antdv-next'
import { useBaseConfig } from 'antdv-next/config-provider/context'
import { useDisabledContext } from 'antdv-next/config-provider/DisabledContext'
import useCSSVarCls from 'antdv-next/config-provider/hooks/useCSSVarCls'
import { computed, defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import { useMergeSemantic } from '../_util/semantic'
import { useProComponentConfig } from '../config-provider'
import useStyle from './style'

export type InputTagValue = string[]
export type InputTagInputProps = Omit<
  InputProps,
  | 'value'
  | 'defaultValue'
  | 'disabled'
  | 'readonly'
  | 'size'
  | 'status'
  | 'variant'
  | 'allowClear'
  | 'prefix'
  | 'suffix'
  | 'onChange'
  | 'onPressEnter'
  | 'onKeydown'
  | 'onCompositionstart'
  | 'onCompositionend'
  | 'onUpdate:value'
>
export type InputTagTagProps = Omit<TagProps, 'closable' | 'disabled' | 'onClose'>

export interface InputTagSemanticClassNames {
  root?: string
  content?: string
  tag?: string
  input?: string
  suffix?: string
  clear?: string
}

export interface InputTagSemanticStyles {
  root?: CSSProperties
  content?: CSSProperties
  tag?: CSSProperties
  input?: CSSProperties
  suffix?: CSSProperties
  clear?: CSSProperties
}

export type InputTagClassNamesType = SemanticClassNamesType<InputTagProps, InputTagSemanticClassNames>
export type InputTagStylesType = SemanticStylesType<InputTagProps, InputTagSemanticStyles>
export type InputTagSemanticName = keyof InputTagSemanticClassNames & keyof InputTagSemanticStyles
export type InputTagStatus = NonNullable<InputProps['status']>

export interface InputTagProps {
  prefixCls?: string
  rootClass?: string
  value?: InputTagValue
  defaultValue?: InputTagValue
  inputValue?: string
  defaultInputValue?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  autoFocus?: boolean
  size?: SizeType
  status?: InputTagStatus
  variant?: Variant
  maxCount?: number
  tokenSeparators?: string[]
  allowDuplicate?: boolean
  allowClear?: boolean
  inputProps?: InputTagInputProps
  tagProps?: InputTagTagProps
  classes?: InputTagClassNamesType
  styles?: InputTagStylesType
}

export type InputTagChangeTrigger = 'enter' | 'token-separator' | 'paste' | 'tag-remove' | 'backspace' | 'clear'

export interface InputTagChangeInfo {
  trigger: InputTagChangeTrigger
  event?: Event
}

export interface InputTagEmits {
  'update:value': (value: InputTagValue) => void
  change: (value: InputTagValue, info: InputTagChangeInfo) => void
  'update:inputValue': (value: string) => void
  inputChange: (value: string, event?: Event) => void
  add: (value: string, info: { index: number, event?: Event }) => void
  remove: (value: string, info: { index: number, trigger: 'tag-remove' | 'backspace', event?: Event }) => void
  clear: (event: MouseEvent) => void
  pressEnter: (inputValue: string, event: KeyboardEvent) => void
  focus: (event: FocusEvent) => void
  blur: (event: FocusEvent) => void
  [key: string]: (...args: any[]) => void
}

export interface InputTagSlots {
  prefix?: () => any
  suffix?: () => any
  clearIcon?: () => any
  tag?: (props: { value: string, index: number, closable: boolean, onClose: (event: MouseEvent) => void }) => any
}

export interface InputTagRef {
  focus: (options?: FocusOptions) => void
  blur: () => void
  input: ShallowRef<HTMLInputElement | null>
  nativeElement: ShallowRef<HTMLElement | null>
}

function omitClassAndStyle(attrs: Record<string, any>) {
  const nextAttrs = { ...attrs }
  delete nextAttrs.class
  delete nextAttrs.style
  return nextAttrs
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function createSeparatorRegExp(separators: string[]) {
  const values = separators.filter(Boolean).sort((a, b) => b.length - a.length)
  return values.length ? new RegExp(values.map(escapeRegExp).join('|'), 'g') : undefined
}

function splitInput(value: string, separators: string[], preserveTrailing: boolean) {
  const regexp = createSeparatorRegExp(separators)
  if (!regexp) {
    return { values: value.trim() ? [value.trim()] : [], rest: '' }
  }

  const parts = value.split(regexp)
  const endsWithSeparator = separators.some(separator => separator && value.endsWith(separator))
  const rest = preserveTrailing && !endsWithSeparator ? (parts.pop() ?? '') : ''
  return {
    values: parts.map(part => part.trim()).filter(Boolean),
    rest: rest.trimStart(),
  }
}

const InputTag = defineComponent<
  InputTagProps,
  InputTagEmits,
  string,
  SlotsType<InputTagSlots>
>(
  (props, { attrs, emit, expose, slots }) => {
    const { prefixCls, direction } = useBaseConfig('input-tag', props)
    const disabledContext = useDisabledContext()
    const proConfig = useProComponentConfig('inputTag')
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)
    const inputRef = shallowRef<InputRef>()
    const composing = ref(false)
    const pastePending = ref(false)
    const pendingInputUpdate = ref<string | null>(null)

    const mergedDisabled = computed(() => props.disabled ?? disabledContext.value ?? false)
    const mergedReadonly = computed(() => props.readonly ?? false)
    const mergedMaxCount = computed(() => props.maxCount ?? proConfig.value.maxCount)
    const mergedSeparators = computed(() => props.tokenSeparators ?? proConfig.value.tokenSeparators ?? [])
    const mergedAllowDuplicate = computed(() => props.allowDuplicate ?? proConfig.value.allowDuplicate ?? false)
    const mergedAllowClear = computed(() => props.allowClear ?? proConfig.value.allowClear ?? false)
    const mergedInputProps = computed(() => props.inputProps ?? {})

    const valueRef = computed(() => props.value) as ComputedRef<InputTagValue>
    const inputValueRef = computed(() => props.inputValue) as ComputedRef<string>
    const [mergedValue, setMergedValue] = useMergedState<InputTagValue>([], {
      value: valueRef,
      defaultValue: () => [...(props.defaultValue ?? [])],
    })
    const [mergedInputValue, setMergedInputValue] = useMergedState<string>('', {
      value: inputValueRef,
      defaultValue: () => props.defaultInputValue ?? '',
    })

    const mergedSemanticProps = computed<InputTagProps>(() => ({
      ...props,
      value: mergedValue.value,
      inputValue: mergedInputValue.value,
      disabled: mergedDisabled.value,
      readonly: mergedReadonly.value,
      maxCount: mergedMaxCount.value,
      tokenSeparators: mergedSeparators.value,
      allowDuplicate: mergedAllowDuplicate.value,
      allowClear: mergedAllowClear.value,
    }))
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      InputTagSemanticClassNames,
      InputTagSemanticStyles,
      InputTagProps
    >(
      computed(() => [proConfig.value.classes as InputTagClassNamesType | undefined, props.classes]),
      computed(() => [proConfig.value.styles as InputTagStylesType | undefined, props.styles]),
      computed(() => ({ props: mergedSemanticProps.value })),
    )

    const mergedClassName = computed(() => clsx(
      prefixCls.value,
      hashId.value,
      cssVarCls.value,
      rootCls.value,
      { [`${prefixCls.value}-rtl`]: direction.value === 'rtl' },
      proConfig.value.class,
      props.rootClass,
      mergedClassNames.value.root,
      (attrs as any).class,
    ))
    const mergedStyle = computed(() => [
      mergedStyles.value.root,
      proConfig.value.style,
      (attrs as any).style,
    ])

    function focusInput() {
      inputRef.value?.focus?.()
    }

    function updateInputValue(value: string, event?: Event, force = false) {
      const changed = mergedInputValue.value !== value
      if (changed)
        setMergedInputValue(value)
      if (changed || force) {
        emit('update:inputValue', value)
        emit('inputChange', value, event)
      }
    }

    function updateTagValue(value: InputTagValue, trigger: InputTagChangeTrigger, event?: Event) {
      setMergedValue(value)
      emit('update:value', value)
      emit('change', value, { trigger, event })
    }

    function acceptValues(values: string[]) {
      const existing = mergedValue.value
      const available = mergedMaxCount.value === undefined
        ? Number.POSITIVE_INFINITY
        : Math.max(0, mergedMaxCount.value - existing.length)
      const accepted: string[] = []
      for (const value of values) {
        if (!mergedAllowDuplicate.value && (existing.includes(value) || accepted.includes(value)))
          continue
        if (accepted.length >= available)
          break
        accepted.push(value)
      }
      return accepted
    }

    function commitInput(trigger: InputTagChangeTrigger, event?: Event, preserveTrailing = false, sourceValue?: string) {
      if (mergedDisabled.value || mergedReadonly.value)
        return

      const input = sourceValue ?? mergedInputValue.value
      const { values, rest } = splitInput(input, mergedSeparators.value, preserveTrailing)
      const accepted = acceptValues(values)
      if (accepted.length) {
        const next = [...mergedValue.value, ...accepted]
        updateTagValue(next, trigger, event)
        accepted.forEach((value, offset) => {
          emit('add', value, { index: mergedValue.value.length + offset, event })
        })
      }
      if (values.length && (accepted.length || rest !== input))
        updateInputValue(rest, event, true)
    }

    function removeTag(index: number, trigger: 'tag-remove' | 'backspace', event?: Event) {
      if (mergedDisabled.value || mergedReadonly.value)
        return
      const value = mergedValue.value[index]
      if (value === undefined)
        return
      updateTagValue(mergedValue.value.filter((_, currentIndex) => currentIndex !== index), trigger, event)
      emit('remove', value, { index, trigger, event })
      nextTick(focusInput)
    }

    function handleInput(event: Event) {
      const target = event.target as HTMLInputElement
      const value = target?.value ?? ''
      if (mergedDisabled.value || mergedReadonly.value)
        return
      if (composing.value) {
        updateInputValue(value, event, true)
        return
      }
      const hasSeparator = Boolean(createSeparatorRegExp(mergedSeparators.value)?.test(value))
      if (hasSeparator) {
        const trigger = pastePending.value ? 'paste' : 'token-separator'
        pastePending.value = false
        pendingInputUpdate.value = value
        commitInput(trigger, event, true, value)
      }
      else {
        pastePending.value = false
        updateInputValue(value, event, true)
      }
    }

    function handleInputValueUpdate(value: string) {
      if (pendingInputUpdate.value === value) {
        pendingInputUpdate.value = null
        return
      }
      if (!composing.value)
        setMergedInputValue(value)
    }

    function handlePaste() {
      pastePending.value = true
    }

    function handleCompositionStart(event: CompositionEvent) {
      composing.value = true
      emit('compositionstart' as any, event)
    }

    function handleCompositionEnd(event: CompositionEvent) {
      composing.value = false
      emit('compositionend' as any, event)
      const currentValue = (event.target as HTMLInputElement | null)?.value
      if (currentValue && createSeparatorRegExp(mergedSeparators.value)?.test(currentValue))
        commitInput('token-separator', event, true, currentValue)
    }

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Backspace' && !mergedInputValue.value && mergedValue.value.length) {
        event.preventDefault()
        removeTag(mergedValue.value.length - 1, 'backspace', event)
      }
    }

    function handlePressEnter(event: KeyboardEvent) {
      if (event.isComposing || composing.value || mergedDisabled.value || mergedReadonly.value)
        return
      event.preventDefault()
      const input = mergedInputValue.value
      commitInput('enter', event, false)
      emit('pressEnter', input, event)
    }

    function handleClear(event: MouseEvent) {
      if (mergedDisabled.value || mergedReadonly.value)
        return
      if (!mergedValue.value.length && !mergedInputValue.value)
        return
      updateTagValue([], 'clear', event)
      updateInputValue('', event, true)
      emit('clear', event)
      nextTick(focusInput)
    }

    function renderTag(value: string, index: number) {
      const closable = !mergedDisabled.value && !mergedReadonly.value
      const onClose = (event: MouseEvent) => removeTag(index, 'tag-remove', event)
      const slotProps = { value, index, closable, onClose }
      const custom = slots.tag?.(slotProps)
      if (custom) {
        return h('span', {
          key: `${value}-${index}`,
          class: mergedClassNames.value.tag,
          style: mergedStyles.value.tag,
        }, custom)
      }
      return h(ATag, {
        ...(props.tagProps ?? {}),
        key: `${value}-${index}`,
        closable,
        disabled: mergedDisabled.value,
        class: clsx((props.tagProps as any)?.class, mergedClassNames.value.tag),
        style: [((props.tagProps as any)?.style), mergedStyles.value.tag],
        onClose,
      } as any, { default: () => value })
    }

    const api: InputTagRef = {
      focus: options => inputRef.value?.focus?.(options),
      blur: () => inputRef.value?.blur?.(),
      input: computed(() => inputRef.value?.input ?? null) as unknown as ShallowRef<HTMLInputElement | null>,
      nativeElement: computed(() => inputRef.value?.nativeElement ?? null) as unknown as ShallowRef<HTMLElement | null>,
    }
    expose(api)

    return () => {
      const content = h('span', {
        class: clsx(`${prefixCls.value}-content`, mergedClassNames.value.content),
        style: mergedStyles.value.content,
      }, [
        slots.prefix?.(),
        ...mergedValue.value.map(renderTag),
      ])
      const canClear = mergedAllowClear.value && !mergedDisabled.value && !mergedReadonly.value
        && (mergedValue.value.length > 0 || Boolean(mergedInputValue.value))
      const clearButton = canClear
        ? h('button', {
            type: 'button',
            class: clsx(`${prefixCls.value}-clear`, mergedClassNames.value.clear),
            style: mergedStyles.value.clear,
            'aria-label': 'Clear',
            onMousedown: (event: MouseEvent) => event.preventDefault(),
            onClick: handleClear,
          }, slots.clearIcon?.() ?? h('span', { 'aria-hidden': 'true' }, '×'))
        : null
      const suffix = h('span', {
        class: clsx(`${prefixCls.value}-suffix`, mergedClassNames.value.suffix),
        style: mergedStyles.value.suffix,
      }, [clearButton, slots.suffix?.()])

      const inputAttrs = {
        ...omitClassAndStyle(attrs as Record<string, any>),
        ...mergedInputProps.value,
        ref: inputRef,
        value: mergedInputValue.value,
        prefix: content,
        suffix,
        class: mergedClassName.value,
        style: mergedStyle.value,
        placeholder: props.placeholder,
        autoFocus: props.autoFocus,
        disabled: mergedDisabled.value,
        readonly: mergedReadonly.value,
        size: props.size,
        status: props.status,
        variant: props.variant,
        allowClear: false,
        'data-readonly': mergedReadonly.value ? 'true' : undefined,
        classes: {
          ...((typeof mergedInputProps.value.classes === 'object' && mergedInputProps.value.classes) || {}),
          root: clsx((mergedInputProps.value.classes as any)?.root, mergedClassNames.value.root),
          input: clsx((mergedInputProps.value.classes as any)?.input, mergedClassNames.value.input),
          suffix: clsx((mergedInputProps.value.classes as any)?.suffix, mergedClassNames.value.suffix),
        },
        styles: {
          ...((typeof mergedInputProps.value.styles === 'object' && mergedInputProps.value.styles) || {}),
          root: { ...((mergedInputProps.value.styles as any)?.root), ...mergedStyles.value.root },
          input: { ...((mergedInputProps.value.styles as any)?.input), ...mergedStyles.value.input },
          suffix: { ...((mergedInputProps.value.styles as any)?.suffix), ...mergedStyles.value.suffix },
        },
        'onUpdate:value': handleInputValueUpdate,
        onInput: handleInput,
        onPaste: handlePaste,
        onKeydown: handleKeydown,
        onPressEnter: handlePressEnter,
        onCompositionstart: handleCompositionStart,
        onCompositionend: handleCompositionEnd,
        onFocus: (event: FocusEvent) => emit('focus', event),
        onBlur: (event: FocusEvent) => emit('blur', event),
      }

      return h(AInput, inputAttrs as any)
    }
  },
  {
    name: 'AInputTag',
    inheritAttrs: false,
  },
)

;(InputTag as any).install = (app: App) => {
  app.component(InputTag.name, InputTag)
}

export type { InputTagConfig }
export default InputTag
export { InputTag }
