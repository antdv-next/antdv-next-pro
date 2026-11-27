import type { InputProps, InputRef, SizeType, TagProps } from 'antdv-next'
import type { Variant } from 'antdv-next/config-provider/context'
import type { App, ComputedRef, CSSProperties, ShallowRef, SlotsType } from 'vue'
import type { VueNode } from '../_util/node'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/semantic'
import type { InputTagLocale, ProLocale } from '../locale/types'
import { CloseCircleFilled } from '@antdv-next/icons'
import { clsx, useMergedState } from '@v-c/util'
import { Input as AInput, Tag as ATag, Tooltip as ATooltip } from 'antdv-next'
import { useBaseConfig } from 'antdv-next/config-provider/context'
import { useDisabledContext } from 'antdv-next/config-provider/DisabledContext'
import useCSSVarCls from 'antdv-next/config-provider/hooks/useCSSVarCls'
import { useLocaleContext } from 'antdv-next/locale/index'
import { computed, defineComponent, h, nextTick, ref, shallowRef, watch } from 'vue'
import { unwrapExposedElement } from '../_util'
import { filterEmpty, getSlotPropsFnRun } from '../_util/node'
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
  | 'onKeyup'
  | 'onCompositionstart'
  | 'onCompositionend'
  | 'onUpdate:value'
>
export type InputTagTagProps = Omit<TagProps, 'closable' | 'disabled' | 'onClose'> & {
  class?: string | Record<string, any> | Array<string | Record<string, any>>
  style?: CSSProperties | CSSProperties[] | string
}

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
/**
 * `allowClear` 的对象形式，与 antdv-next Input 一致。
 */
export interface InputTagAllowClearConfig {
  clearIcon?: VueNode
}

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
  /**
   * 是否显示清空按钮；传对象可以自定义清空图标。
   */
  allowClear?: boolean | InputTagAllowClearConfig
  /**
   * 前缀内容，显示在标签之前。同名插槽优先。
   */
  prefix?: VueNode
  /**
   * 后缀内容，显示在清空按钮之后。同名插槽优先。
   */
  suffix?: VueNode
  /**
   * 自定义清空图标。优先级：`#clearIcon` 插槽 > `clearIcon` > `allowClear.clearIcon` > 默认图标。
   */
  clearIcon?: VueNode
  trigger?: 'enter' | 'space'
  saveOnBlur?: boolean
  draggable?: boolean
  /**
   * 最多显示多少个标签，超出的折叠成一个占位标签（与 antdv-next Select 的 `maxTagCount` 一致）。
   * 不设置时显示全部。
   */
  maxTagCount?: number
  /**
   * 折叠占位标签的内容，可以是节点，或接收被折叠值的函数。默认显示 `+ N`。同名插槽优先。
   */
  maxTagPlaceholder?: VueNode | ((omittedValues: string[]) => VueNode)
  /**
   * 是否通过 Tooltip 展示被折叠的标签。开启后占位标签可聚焦，支持 hover / focus / click。
   * @default false
   */
  maxTagTooltip?: boolean
  inputProps?: InputTagInputProps
  tagProps?: InputTagTagProps
  classes?: InputTagClassNamesType
  styles?: InputTagStylesType
}

export type InputTagChangeTrigger = 'enter' | 'space' | 'blur' | 'drag' | 'token-separator' | 'tag-remove' | 'backspace' | 'clear'

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
  dragTag: (oldIndex: number, newIndex: number, value: string, event?: DragEvent | KeyboardEvent) => void
  focus: (event: FocusEvent) => void
  blur: (event: FocusEvent) => void
  compositionstart: (event: CompositionEvent) => void
  compositionend: (event: CompositionEvent) => void
  keydown: (event: KeyboardEvent) => void
  keyup: (event: KeyboardEvent) => void
  [key: string]: (...args: any[]) => void
}

export interface InputTagSlots {
  prefix?: () => any
  suffix?: () => any
  clearIcon?: () => any
  maxTagPlaceholder?: (props: { omittedValues: string[] }) => any
  tag?: (props: { value: string, index: number, closable: boolean, onClose: (event: MouseEvent) => void }) => any
}

/**
 * 可以通过 `ProConfigProvider` 的 `inputTag` 全局配置的默认值。
 */
export interface InputTagConfig {
  size?: SizeType
  variant?: Variant
  maxCount?: number
  tokenSeparators?: string[]
  allowDuplicate?: boolean
  allowClear?: boolean | InputTagAllowClearConfig
  trigger?: 'enter' | 'space'
  saveOnBlur?: boolean
  class?: string
  style?: CSSProperties
  classes?: InputTagClassNamesType
  styles?: InputTagStylesType
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

/**
 * 渲染型 prop 允许传函数；布尔值（未传的 prop 会被 Vue 转成 `false`）和空串都视为没有内容。
 */
function resolveNode(value: unknown, ...args: any[]) {
  const node = typeof value === 'function' ? value(...args) : value
  return node == null || node === false || node === true || node === '' ? null : node
}

function resolveSemanticRecord<T extends object>(value: T | ((info: any) => T) | undefined) {
  return typeof value === 'function' ? undefined : value
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function createSeparatorRegExp(separators: string[]) {
  const values = separators.filter(Boolean).sort((a, b) => b.length - a.length)
  return values.length ? new RegExp(values.map(escapeRegExp).join('|'), 'g') : undefined
}

function splitInput(value: string, separators: string[]) {
  const regexp = createSeparatorRegExp(separators)
  if (!regexp)
    return value.trim() ? [value.trim()] : []

  return value.split(regexp).map(part => part.trim()).filter(Boolean)
}

// 语言包缺少 InputTag 字段时的英文兜底。直接写在组件里，避免为了两条文案把整份 en_US
// （antdv-next 的 en_US 加上 Cron 文案）带进 InputTag 的子路径产物。
const DEFAULT_LOCALE: InputTagLocale = {
  clear: 'Clear',
  showMore: 'Show all tags',
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
    const localeContext = useLocaleContext()
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)
    const inputRef = shallowRef<InputRef>()
    const nativeInputRef = shallowRef<HTMLInputElement | null>(null)
    const nativeElementRef = shallowRef<HTMLElement | null>(null)
    const composing = ref(false)
    const draggingIndex = ref<number | null>(null)
    const dragOverIndex = ref<number | null>(null)
    const dropPosition = ref<'before' | 'after' | null>(null)

    watch(
      () => ({
        input: unwrapExposedElement<HTMLInputElement>(inputRef.value?.input),
        nativeElement: unwrapExposedElement<HTMLElement>(inputRef.value?.nativeElement),
      }),
      ({ input, nativeElement }) => {
        nativeInputRef.value = input
        nativeElementRef.value = nativeElement
      },
      { immediate: true, flush: 'post' },
    )

    const localeText = computed<InputTagLocale>(() => ({
      ...DEFAULT_LOCALE,
      ...((localeContext.locale.value as ProLocale | undefined)?.InputTag ?? {}),
    }))
    const clearLabel = computed(() => localeText.value.clear)
    const showMoreLabel = computed(() => localeText.value.showMore)

    const mergedDisabled = computed(() => props.disabled ?? disabledContext.value ?? false)
    const mergedReadonly = computed(() => props.readonly ?? false)
    const mergedMaxCount = computed(() => props.maxCount ?? proConfig.value.maxCount)
    const mergedSeparators = computed(() => props.tokenSeparators ?? proConfig.value.tokenSeparators ?? [])
    const mergedAllowDuplicate = computed(() => props.allowDuplicate ?? proConfig.value.allowDuplicate ?? false)
    const mergedAllowClear = computed(() => props.allowClear ?? proConfig.value.allowClear ?? false)
    const mergedTrigger = computed(() => props.trigger ?? proConfig.value.trigger ?? 'enter')
    const mergedSaveOnBlur = computed(() => props.saveOnBlur ?? proConfig.value.saveOnBlur ?? false)
    const mergedSize = computed(() => props.size ?? proConfig.value.size)
    const mergedVariant = computed(() => props.variant ?? proConfig.value.variant)
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

    // 输入框只读：组件 readonly 或已达到 maxCount 上限
    const inputReadonly = computed(() => mergedReadonly.value
      || (mergedMaxCount.value !== undefined && mergedValue.value.length >= mergedMaxCount.value))

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

    function commitTokens(values: string[], trigger: InputTagChangeTrigger, event?: Event) {
      const accepted = acceptValues(values)
      if (accepted.length) {
        const next = [...mergedValue.value, ...accepted]
        updateTagValue(next, trigger, event)
        accepted.forEach((value, offset) => {
          emit('add', value, { index: mergedValue.value.length + offset, event })
        })
      }
      return accepted
    }

    function commitInput(trigger: InputTagChangeTrigger, event?: Event) {
      if (mergedDisabled.value || inputReadonly.value)
        return

      const input = mergedInputValue.value
      const values = splitInput(input, mergedSeparators.value)
      commitTokens(values, trigger, event)
      // 只要输入里有可提交的内容就清空草稿，即使全部被去重 / maxCount 拦下
      if (values.length)
        updateInputValue('', event, true)
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
      if (mergedDisabled.value || inputReadonly.value)
        return

      // 输入过程中遇到分隔符：立即拆分并提交，分隔符之后的内容保留在输入框
      const separators = mergedSeparators.value
      if (!composing.value && !(event as InputEvent).isComposing && separators.length && value) {
        const regexp = createSeparatorRegExp(separators)
        if (regexp) {
          const parts = value.split(regexp)
          if (parts.length > 1) {
            const rest = parts.pop() ?? ''
            const values = parts.map(part => part.trim()).filter(Boolean)
            commitTokens(values, 'token-separator', event)
            // 同步 DOM 值，避免内部 Input 后续基于旧值触发 update:value 覆盖
            target.value = rest
            updateInputValue(rest, event, true)
            return
          }
        }
      }

      updateInputValue(value, event, true)
    }

    function handleInputValueUpdate(value: string) {
      if (!composing.value)
        setMergedInputValue(value)
    }

    function handleCompositionStart(event: CompositionEvent) {
      composing.value = true
      emit('compositionstart', event)
    }

    function handleCompositionEnd(event: CompositionEvent) {
      composing.value = false
      emit('compositionend', event)
    }

    function handleKeydown(event: KeyboardEvent) {
      // 先透传给使用方，再做内部处理：内部的监听会覆盖 attrs 上的同名监听，不转发的话用户收不到
      emit('keydown', event)
      if (event.key === 'Backspace' && !mergedInputValue.value && mergedValue.value.length) {
        event.preventDefault()
        removeTag(mergedValue.value.length - 1, 'backspace', event)
      }
    }

    function handleKeyup(event: KeyboardEvent) {
      emit('keyup', event)
      if (event.isComposing || composing.value || mergedDisabled.value || mergedReadonly.value)
        return
      if (mergedTrigger.value !== 'space' || (event.key !== ' ' && event.code !== 'Space'))
        return
      event.preventDefault()
      event.stopPropagation()
      const input = mergedInputValue.value
      commitInput('space', event)
      if (!input.trim())
        updateInputValue('', event, true)
    }

    function handlePressEnter(event: KeyboardEvent) {
      if (event.isComposing || composing.value || mergedDisabled.value || mergedReadonly.value)
        return
      const input = mergedInputValue.value
      if (mergedTrigger.value === 'enter') {
        event.preventDefault()
        commitInput('enter', event)
      }
      emit('pressEnter', input, event)
    }

    function handleBlur(event: FocusEvent) {
      if (mergedSaveOnBlur.value)
        commitInput('blur', event)
      emit('blur', event)
    }

    function handleDragStart(index: number, event: DragEvent) {
      if (!props.draggable || mergedDisabled.value || mergedReadonly.value)
        return
      draggingIndex.value = index
      dragOverIndex.value = index
      dropPosition.value = null
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', String(index))
      }
    }

    function handleDragOver(index: number, event: DragEvent) {
      if (draggingIndex.value === null || index === draggingIndex.value)
        return
      event.preventDefault()
      if (event.dataTransfer)
        event.dataTransfer.dropEffect = 'move'
      dragOverIndex.value = index
      const target = event.currentTarget as HTMLElement | null
      if (!target) {
        dropPosition.value = 'after'
        return
      }
      const rect = target.getBoundingClientRect()
      const inLeftHalf = event.clientX < rect.left + rect.width / 2
      dropPosition.value = (direction.value === 'rtl' ? !inLeftHalf : inLeftHalf) ? 'before' : 'after'
    }

    function handleDrop(index: number, event: DragEvent) {
      event.preventDefault()
      const oldIndex = draggingIndex.value
      if (oldIndex === null || oldIndex === index) {
        handleDragEnd()
        return
      }
      const next = [...mergedValue.value]
      const [value] = next.splice(oldIndex, 1)
      if (value === undefined) {
        handleDragEnd()
        return
      }
      // 拖到目标 Tag 左半区 -> 插入到目标之前；右半区 -> 插入到目标之后
      const newIndex = dropPosition.value === 'after'
        ? (oldIndex < index ? index : index + 1)
        : (oldIndex < index ? index - 1 : index)
      if (newIndex === oldIndex) {
        handleDragEnd()
        return
      }
      next.splice(newIndex, 0, value)
      updateTagValue(next, 'drag', event)
      emit('dragTag', oldIndex, newIndex, value, event)
      handleDragEnd()
    }

    function focusTag(index: number) {
      nativeElementRef.value?.querySelector<HTMLElement>(`[data-tag-index="${index}"]`)?.focus()
    }

    /**
     * 拖拽排序的键盘等价操作：焦点在标签上时 Alt + ←/→ 把它向前 / 向后移动一位。
     * 方向键按视觉方向解释，RTL 下自动镜像，与拖拽时的左右半区判断保持一致。
     */
    function handleTagKeydown(index: number, event: KeyboardEvent) {
      if (!event.altKey || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight'))
        return
      if (!props.draggable || mergedDisabled.value || mergedReadonly.value)
        return
      event.preventDefault()
      event.stopPropagation()
      const forward = (event.key === 'ArrowRight') !== (direction.value === 'rtl')
      const newIndex = index + (forward ? 1 : -1)
      if (newIndex < 0 || newIndex >= mergedValue.value.length)
        return
      const next = [...mergedValue.value]
      const [value] = next.splice(index, 1)
      if (value === undefined)
        return
      next.splice(newIndex, 0, value)
      updateTagValue(next, 'drag', event)
      emit('dragTag', index, newIndex, value, event)
      // 标签以 value + index 为 key，移动后节点会重建，需要把焦点带到新位置
      nextTick(() => focusTag(newIndex))
    }

    function handleDragEnd() {
      draggingIndex.value = null
      dragOverIndex.value = null
      dropPosition.value = null
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
      const draggable = Boolean(props.draggable && closable)
      const dragClass = {
        [`${prefixCls.value}-tag-dragging`]: draggingIndex.value === index,
        [`${prefixCls.value}-tag-drag-before`]: dragOverIndex.value === index && dropPosition.value === 'before',
        [`${prefixCls.value}-tag-drag-after`]: dragOverIndex.value === index && dropPosition.value === 'after',
      }
      const dragAttrs = draggable
        ? {
            draggable: true,
            tabindex: 0,
            'data-tag-index': index,
            'aria-keyshortcuts': 'Alt+ArrowLeft Alt+ArrowRight',
            onKeydown: (event: KeyboardEvent) => handleTagKeydown(index, event),
            onDragstart: (event: DragEvent) => handleDragStart(index, event),
            onDragover: (event: DragEvent) => handleDragOver(index, event),
            onDrop: (event: DragEvent) => handleDrop(index, event),
            onDragend: handleDragEnd,
          }
        : {}
      const slotProps = { value, index, closable, onClose }
      const custom = slots.tag?.(slotProps)
      if (custom) {
        return h('span', {
          key: `${value}-${index}`,
          class: clsx(mergedClassNames.value.tag, dragClass),
          style: mergedStyles.value.tag,
          ...dragAttrs,
        }, custom)
      }
      return h(ATag, {
        ...(props.tagProps ?? {}),
        key: `${value}-${index}`,
        closable,
        disabled: mergedDisabled.value,
        class: clsx(props.tagProps?.class, mergedClassNames.value.tag, dragClass),
        style: [props.tagProps?.style, mergedStyles.value.tag],
        ...dragAttrs,
        onClose,
      } as any, { default: () => value })
    }

    /**
     * 纯展示版本的 Tag，仅用于 collapse 展开的 Tooltip 内容。
     * 与 renderTag 不同，不包含 closable / draggable / slots.tag 等交互逻辑，
     * 避免 Tooltip 内出现删除按钮、拖拽等可交互元素。
     */
    function renderStaticTag(value: string, index: number) {
      return h(ATag, {
        ...(props.tagProps ?? {}),
        key: `${value}-${index}`,
        class: clsx(props.tagProps?.class, mergedClassNames.value.tag),
        style: [props.tagProps?.style, mergedStyles.value.tag],
      } as any, { default: () => value })
    }

    const api: InputTagRef = {
      focus: options => inputRef.value?.focus?.(options),
      blur: () => inputRef.value?.blur?.(),
      input: nativeInputRef,
      nativeElement: nativeElementRef,
    }
    expose(api)

    return () => {
      const maxTagCount = typeof props.maxTagCount === 'number' && props.maxTagCount >= 0
        ? Math.floor(props.maxTagCount)
        : undefined
      const visibleValues = maxTagCount === undefined
        ? mergedValue.value
        : mergedValue.value.slice(0, maxTagCount)
      const collapsedValues = maxTagCount === undefined
        ? []
        : mergedValue.value.slice(maxTagCount)
      const showTooltip = Boolean(props.maxTagTooltip)
      const renderPlaceholder = () => {
        const fromSlot = slots.maxTagPlaceholder ? filterEmpty(slots.maxTagPlaceholder({ omittedValues: collapsedValues })) : []
        if (fromSlot.length)
          return fromSlot
        return resolveNode(props.maxTagPlaceholder, collapsedValues) ?? `+ ${collapsedValues.length}`
      }
      const collapsedTag = collapsedValues.length
        ? h(ATag, {
            closable: false,
            disabled: mergedDisabled.value,
            class: `${prefixCls.value}-collapse`,
            // 只有开启 Tooltip 时占位标签才可交互；否则它只是数量提示，不应进入 Tab 序列
            ...(showTooltip
              ? {
                  tabindex: 0,
                  role: 'button',
                  'aria-label': showMoreLabel.value,
                  // role=button 的键盘契约：Enter/Space 与 click 等效
                  onKeydown: (event: KeyboardEvent) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      ;(event.currentTarget as HTMLElement | null)?.click()
                    }
                  },
                }
              : {}),
          } as any, { default: renderPlaceholder })
        : null
      const collapseContent = collapsedValues.length
        ? h('div', { class: `${prefixCls.value}-collapse-content` }, collapsedValues.map((value, index) => renderStaticTag(value, index + visibleValues.length)))
        : null
      const content = h('span', {
        class: clsx(`${prefixCls.value}-content`, mergedClassNames.value.content),
        style: mergedStyles.value.content,
      }, [
        resolveNode(getSlotPropsFnRun(slots, props, 'prefix')),
        ...visibleValues.map(renderTag),
        collapseContent && showTooltip
          ? h(ATooltip, { title: collapseContent, placement: 'top', trigger: ['hover', 'focus', 'click'] }, { default: () => collapsedTag })
          : collapsedTag,
      ])
      const allowClear = mergedAllowClear.value
      const canClear = Boolean(allowClear) && !mergedDisabled.value && !mergedReadonly.value
        && (mergedValue.value.length > 0 || Boolean(mergedInputValue.value))
      const clearButton = canClear
        ? h('button', {
            type: 'button',
            class: clsx(`${prefixCls.value}-clear`, mergedClassNames.value.clear),
            style: mergedStyles.value.clear,
            'aria-label': clearLabel.value,
            onMousedown: (event: MouseEvent) => event.preventDefault(),
            onClick: handleClear,
          }, resolveNode(getSlotPropsFnRun(slots, props, 'clearIcon'))
          ?? resolveNode(typeof allowClear === 'object' ? allowClear.clearIcon : undefined)
          // 默认图标与 antdv-next Input 的 allowClear 保持一致
          ?? h(CloseCircleFilled, { 'aria-hidden': 'true' }))
        : null
      const suffixContent = resolveNode(getSlotPropsFnRun(slots, props, 'suffix'))
      const suffix = clearButton || suffixContent ? [clearButton, suffixContent] : undefined
      const inputClassNames = resolveSemanticRecord(mergedInputProps.value.classes)
      const inputStyles = resolveSemanticRecord(mergedInputProps.value.styles)

      const inputAttrs = {
        ...omitClassAndStyle(attrs as Record<string, any>),
        ...mergedInputProps.value,
        ref: inputRef,
        value: mergedInputValue.value,
        prefix: content,
        suffix,
        class: mergedClassName.value,
        style: mergedStyle.value,
        placeholder: mergedValue.value.length || mergedInputValue.value ? undefined : props.placeholder,
        autoFocus: props.autoFocus,
        disabled: mergedDisabled.value,
        readonly: inputReadonly.value,
        size: mergedSize.value,
        status: props.status,
        variant: mergedVariant.value,
        allowClear: false,
        'data-readonly': inputReadonly.value ? 'true' : undefined,
        classes: {
          ...inputClassNames,
          // root 的语义 class / style 已经通过上面的 class / style 落到根节点，这里不再重复传一次
          root: inputClassNames?.root,
          input: clsx(inputClassNames?.input, mergedClassNames.value.input),
          suffix: clsx(`${prefixCls.value}-suffix`, inputClassNames?.suffix, mergedClassNames.value.suffix),
        },
        styles: {
          ...inputStyles,
          root: inputStyles?.root,
          input: { ...inputStyles?.input, ...mergedStyles.value.input },
          suffix: { ...inputStyles?.suffix, ...mergedStyles.value.suffix },
        },
        'onUpdate:value': handleInputValueUpdate,
        onInput: handleInput,
        onKeydown: handleKeydown,
        onPressEnter: handlePressEnter,
        onCompositionstart: handleCompositionStart,
        onCompositionend: handleCompositionEnd,
        onFocus: (event: FocusEvent) => emit('focus', event),
        onKeyup: handleKeyup,
        onBlur: handleBlur,
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

export default InputTag
export { InputTag }
