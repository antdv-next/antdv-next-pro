import type { InputRef } from 'antdv-next'
import type { App, ComputedRef, SlotsType } from 'vue'
import type { CategorySearchLocale, ProLocale } from '../locale/types'
import type {
  CategorySearchChangeInfo,
  CategorySearchClassNamesType,
  CategorySearchEmits,
  CategorySearchOption,
  CategorySearchOptionValue,
  CategorySearchPanelRenderInfo,
  CategorySearchProps,
  CategorySearchRef,
  CategorySearchSemanticClassNames,
  CategorySearchSemanticStyles,
  CategorySearchSlots,
  CategorySearchStylesType,
  CategorySearchValue,
  CategorySearchValueItem,
} from './types'
import { clsx, useMergedState } from '@v-c/util'
import useId from '@v-c/util/dist/hooks/useId'
import {
  Input as AInput,
  Button,
  Checkbox,
  CheckboxGroup,
  DateRangePicker,
  Empty,
  InputNumber,
  Popover,
  Tag,
} from 'antdv-next'
import { useBaseConfig } from 'antdv-next/config-provider/context'
import { useDisabledContext } from 'antdv-next/config-provider/DisabledContext'
import useCSSVarCls from 'antdv-next/config-provider/hooks/useCSSVarCls'
import { useLocaleContext } from 'antdv-next/locale/index'
import { computed, defineComponent, h, nextTick, ref, shallowRef, watch } from 'vue'
import { getSlotPropsFnRun, NoFormStyle, unwrapExposedElement, useFormItemProviderRest } from '../_util'
import { useMergeSemantic } from '../_util/semantic'
import { useProComponentConfig } from '../config-provider'
import enUSLocale from '../locale/en_US'
import useStyle from './style'
import {
  formatValue,
  getDraftValue,
  getOptionType,
  isEmptyValue,
  normalizeNumberRange,
  normalizeOptions,
  truncateNodes,
} from './utils'

const enUSCategorySearch = enUSLocale.CategorySearch!

type PopupMode
  = | { type: 'list' }
    | { type: 'panel', optionValue: CategorySearchOptionValue, fromList: boolean }

type SplitSemantic<T> = Omit<T, 'popup'> & { popup?: Record<string, any> }

function omitClassAndStyle(attrs: Record<string, any>) {
  const nextAttrs = { ...attrs }
  delete nextAttrs.class
  delete nextAttrs.style
  return nextAttrs
}

function resolveSemantic<T>(value: T | ((info: any) => T) | undefined, info: any): T | undefined {
  return typeof value === 'function' ? (value as (info: any) => T)(info) : value
}

/**
 * 浮层里的控件不应继承外层 Form.Item 的校验状态，也不应把自己注册成表单字段。
 *
 * Controls inside the popup must not inherit the Form.Item status or register as form fields.
 */
const PopupFormReset = defineComponent((_, { slots }) => {
  useFormItemProviderRest()
  return () => h(NoFormStyle, { status: true, override: true }, { default: () => slots.default?.() })
}, { name: 'ACategorySearchPopupFormReset' })

const CategorySearch = defineComponent<
  CategorySearchProps,
  CategorySearchEmits,
  string,
  SlotsType<CategorySearchSlots>
>(
  (props, { attrs, emit, expose, slots }) => {
    const { prefixCls, direction } = useBaseConfig('category-search', props)
    const disabledContext = useDisabledContext()
    const proConfig = useProComponentConfig('categorySearch')
    const localeContext = useLocaleContext()
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)
    const id = useId()
    const listId = `${id}-list`

    const rootRef = shallowRef<HTMLElement | null>(null)
    const inputRef = shallowRef<InputRef>()
    const panelRef = shallowRef<HTMLElement | null>(null)
    const nativeInputRef = shallowRef<HTMLInputElement | null>(null)
    const composing = ref(false)
    const activeIndex = ref(-1)
    const panelActiveIndex = ref(-1)
    const mode = shallowRef<PopupMode>({ type: 'list' })
    const draft = shallowRef<any>(undefined)
    const pending = ref(false)
    let pointerInRoot = false

    watch(
      () => unwrapExposedElement<HTMLInputElement>(inputRef.value?.input),
      (input) => {
        nativeInputRef.value = input
      },
      { immediate: true, flush: 'post' },
    )

    const localeText = computed<CategorySearchLocale>(() => ({
      ...enUSCategorySearch,
      ...((localeContext.locale.value as ProLocale | undefined)?.CategorySearch ?? {}),
    }))

    const mergedDisabled = computed(() => props.disabled ?? disabledContext.value ?? false)
    const mergedShowSearch = computed(() => props.showSearch ?? proConfig.value.showSearch ?? true)
    const mergedAllowClear = computed(() => props.allowClear ?? proConfig.value.allowClear ?? false)
    const mergedMaxTagCount = computed(() => props.maxTagCount ?? proConfig.value.maxTagCount)
    const mergedVariant = computed(() => props.variant ?? proConfig.value.variant)
    const mergedPlacement = computed(() => {
      const placement = props.placement ?? 'bottomLeft'
      if (direction.value !== 'rtl')
        return placement
      // RTL 下把 Left / Right 镜像，让浮层与输入框的起始边对齐。
      return placement.endsWith('Left')
        ? placement.replace('Left', 'Right') as typeof placement
        : placement.replace('Right', 'Left') as typeof placement
    })

    const normalized = computed(() => normalizeOptions(props.options, props.fieldNames))
    const selectableOptions = computed(() => normalized.value.options.filter(option => !option.disabled))

    const valueRef = computed(() => props.value) as ComputedRef<CategorySearchValue>
    const searchValueRef = computed(() => props.searchValue) as ComputedRef<string>
    const openRef = computed(() => props.open) as ComputedRef<boolean>
    const [mergedValue, setMergedValue] = useMergedState<CategorySearchValue>([], {
      value: valueRef,
      defaultValue: () => [...(props.defaultValue ?? [])],
    })
    const [mergedSearchValue, setMergedSearchValue] = useMergedState<string>('', {
      value: searchValueRef,
      defaultValue: () => props.defaultSearchValue ?? '',
    })
    const [mergedOpen, setMergedOpen] = useMergedState<boolean>(false, {
      value: openRef,
      defaultValue: () => props.defaultOpen ?? false,
    })
    const popupOpen = computed(() => mergedOpen.value && !mergedDisabled.value)

    const mergedSemanticProps = computed<CategorySearchProps>(() => ({
      ...props,
      value: mergedValue.value,
      searchValue: mergedSearchValue.value,
      disabled: mergedDisabled.value,
      showSearch: mergedShowSearch.value,
      allowClear: mergedAllowClear.value,
      maxTagCount: mergedMaxTagCount.value,
      variant: mergedVariant.value,
    }))
    const semanticInfo = computed(() => ({ props: mergedSemanticProps.value }))

    // `popup` 是嵌套的语义节点，拆开后分别合并，避免 clsx 把对象当成 class 名。
    const resolvedClasses = computed(() => [
      proConfig.value.classes as CategorySearchClassNamesType | undefined,
      props.classes,
    ].map(item => resolveSemantic<SplitSemantic<CategorySearchSemanticClassNames>>(item as any, semanticInfo.value)))
    const resolvedStyles = computed(() => [
      proConfig.value.styles as CategorySearchStylesType | undefined,
      props.styles,
    ].map(item => resolveSemantic<SplitSemantic<CategorySearchSemanticStyles>>(item as any, semanticInfo.value)))

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      Omit<CategorySearchSemanticClassNames, 'popup'>,
      Omit<CategorySearchSemanticStyles, 'popup'>,
      CategorySearchProps
    >(
      computed(() => resolvedClasses.value.map((item) => {
        if (!item)
          return item
        const { popup: _popup, ...rest } = item
        return rest
      })),
      computed(() => resolvedStyles.value.map((item) => {
        if (!item)
          return item
        const { popup: _popup, ...rest } = item
        return rest
      })),
      semanticInfo,
    )
    const [popupClassNames, popupStyles] = useMergeSemantic<
      NonNullable<CategorySearchSemanticClassNames['popup']>,
      NonNullable<CategorySearchSemanticStyles['popup']>,
      CategorySearchProps
    >(
      computed(() => resolvedClasses.value.map(item => item?.popup)),
      computed(() => resolvedStyles.value.map(item => item?.popup)),
      semanticInfo,
    )

    const mergedClassName = computed(() => clsx(
      prefixCls.value,
      hashId.value,
      cssVarCls.value,
      rootCls.value,
      {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-disabled`]: mergedDisabled.value,
        [`${prefixCls.value}-readonly-input`]: !mergedShowSearch.value,
        [`${prefixCls.value}-open`]: popupOpen.value,
      },
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

    const currentOption = computed(() => {
      const current = mode.value
      return current.type === 'panel' ? normalized.value.optionMap.get(current.optionValue) : undefined
    })

    function isClosable(item: CategorySearchValueItem) {
      const option = normalized.value.optionMap.get(item.key)
      return !mergedDisabled.value && option?.closable !== false
    }

    function focusInput(options?: FocusOptions) {
      inputRef.value?.focus?.(options)
    }

    function setOpen(next: boolean) {
      if (next && mergedDisabled.value)
        return
      if (mergedOpen.value === next)
        return
      setMergedOpen(next)
      emit('update:open', next)
      emit('openChange', next)
    }

    function closePopup() {
      setOpen(false)
    }

    function openList() {
      mode.value = { type: 'list' }
      activeIndex.value = -1
      setOpen(true)
    }

    function openPanel(optionValue: CategorySearchOptionValue, fromList = false) {
      const option = normalized.value.optionMap.get(optionValue)
      if (!option || option.disabled || mergedDisabled.value)
        return
      const existing = mergedValue.value.find(item => item.key === option.value)
      draft.value = getDraftValue(option, existing?.value)
      mode.value = { type: 'panel', optionValue: option.value, fromList }
      const type = getOptionType(option)
      if (type === 'select' && !option.multiple) {
        const children = option.children ?? []
        const selectedIndex = children.findIndex(child => child.value === existing?.value)
        panelActiveIndex.value = selectedIndex
      }
      else {
        panelActiveIndex.value = -1
      }
      setOpen(true)
      // 单选面板沿用输入框上的键盘导航；其余面板把焦点移进面板里的第一个控件。
      if (!(type === 'select' && !option.multiple)) {
        nextTick(() => {
          setTimeout(() => {
            const target = panelRef.value?.querySelector<HTMLElement>('input:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])')
            target?.focus()
          })
        })
      }
    }

    function backToList() {
      const current = mode.value
      if (current.type === 'panel' && current.fromList) {
        mode.value = { type: 'list' }
        activeIndex.value = selectableOptions.value.findIndex(option => option.value === current.optionValue)
      }
      else {
        closePopup()
      }
      focusInput()
    }

    async function applyChange(next: CategorySearchValue, info: CategorySearchChangeInfo) {
      if (props.beforeChange) {
        pending.value = true
        try {
          const result = await props.beforeChange(info)
          if (result === false)
            return false
        }
        catch {
          return false
        }
        finally {
          pending.value = false
        }
      }
      setMergedValue(next)
      emit('update:value', next)
      emit('change', next, info)
      return true
    }

    async function removeItem(item: CategorySearchValueItem) {
      if (!isClosable(item))
        return
      const option = normalized.value.optionMap.get(item.key)
      await applyChange(
        mergedValue.value.filter(current => current.key !== item.key),
        { type: 'remove', option, prevItem: item },
      )
    }

    async function commitValue(option: CategorySearchOption, raw: any) {
      if (pending.value)
        return
      const type = getOptionType(option)
      const value = type === 'numberRange' && Array.isArray(raw) ? normalizeNumberRange(raw as any) : raw
      const prevItem = mergedValue.value.find(item => item.key === option.value)

      if (isEmptyValue(value, type)) {
        if (prevItem && option.closable !== false) {
          const ok = await applyChange(
            mergedValue.value.filter(item => item.key !== option.value),
            { type: 'remove', option, prevItem },
          )
          if (!ok)
            return
        }
        closePopup()
        focusInput()
        return
      }

      const item: CategorySearchValueItem = { key: option.value, value }
      const next = prevItem
        ? mergedValue.value.map(current => (current.key === option.value ? item : current))
        : [...mergedValue.value, item]
      const ok = await applyChange(next, { type: prevItem ? 'update' : 'add', option, item, prevItem })
      if (!ok)
        return
      closePopup()
      focusInput()
    }

    async function handleClear(event: MouseEvent) {
      event.stopPropagation()
      if (mergedDisabled.value)
        return
      const kept = mergedValue.value.filter(item => !isClosable(item))
      if (kept.length !== mergedValue.value.length) {
        const ok = await applyChange(kept, { type: 'clear' })
        if (!ok)
          return
      }
      updateSearchValue('')
      emit('clear')
      closePopup()
      focusInput()
    }

    function updateSearchValue(value: string) {
      if (mergedSearchValue.value === value)
        return
      setMergedSearchValue(value)
      emit('update:searchValue', value)
    }

    function handleInput(event: Event) {
      if (!mergedShowSearch.value || mergedDisabled.value)
        return
      const target = event.target as HTMLInputElement
      updateSearchValue(target?.value ?? '')
    }

    function moveActive(offset: number) {
      if (!popupOpen.value) {
        openList()
        return
      }
      const current = mode.value
      if (current.type === 'list') {
        const total = selectableOptions.value.length
        if (!total)
          return
        activeIndex.value = (activeIndex.value + offset + total) % total
        if (activeIndex.value < 0)
          activeIndex.value = total - 1
        return
      }
      const option = currentOption.value
      if (option && getOptionType(option) === 'select' && !option.multiple) {
        const children = option.children ?? []
        const enabled = children.map((child, index) => ({ child, index })).filter(({ child }) => !child.disabled)
        if (!enabled.length)
          return
        const position = enabled.findIndex(({ index }) => index === panelActiveIndex.value)
        const nextPosition = position === -1
          ? (offset > 0 ? 0 : enabled.length - 1)
          : (position + offset + enabled.length) % enabled.length
        panelActiveIndex.value = enabled[nextPosition]!.index
      }
    }

    function handleKeydown(event: KeyboardEvent) {
      if (mergedDisabled.value || composing.value || event.isComposing)
        return
      const current = mode.value
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowUp':
          event.preventDefault()
          moveActive(event.key === 'ArrowDown' ? 1 : -1)
          return
        case 'Enter': {
          event.preventDefault()
          if (popupOpen.value && current.type === 'list' && activeIndex.value >= 0) {
            const option = selectableOptions.value[activeIndex.value]
            if (option)
              openPanel(option.value, true)
            return
          }
          const option = currentOption.value
          if (popupOpen.value && option && getOptionType(option) === 'select' && !option.multiple && panelActiveIndex.value >= 0) {
            const child = option.children?.[panelActiveIndex.value]
            if (child && !child.disabled)
              commitValue(option, child.value)
            return
          }
          closePopup()
          emit('search', mergedSearchValue.value, mergedValue.value)
          return
        }
        case 'Escape':
          if (!popupOpen.value)
            return
          event.preventDefault()
          event.stopPropagation()
          if (current.type === 'panel')
            backToList()
          else
            closePopup()
          return
        case 'Tab':
          closePopup()
          return
        case 'Backspace': {
          if (mergedSearchValue.value)
            return
          const last = [...mergedValue.value].reverse().find(isClosable)
          if (last) {
            event.preventDefault()
            removeItem(last)
          }
        }
      }
    }

    function handlePanelKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        backToList()
      }
    }

    function handleRootPointerDown() {
      pointerInRoot = true
      setTimeout(() => {
        pointerInRoot = false
      })
    }

    function handleRootClick() {
      if (mergedDisabled.value)
        return
      focusInput()
      if (!popupOpen.value)
        openList()
    }

    function handlePopoverOpenChange(next: boolean) {
      // 点击输入区域由 handleRootClick 处理，这里只负责点击外部时关闭。
      if (next || pointerInRoot)
        return
      closePopup()
    }

    function handleTagClick(event: MouseEvent, item: CategorySearchValueItem) {
      if (mergedDisabled.value)
        return
      event.stopPropagation()
      focusInput()
      openPanel(item.key)
    }

    const api: CategorySearchRef = {
      focus: options => focusInput(options),
      blur: () => inputRef.value?.blur?.(),
      open: (optionValue) => {
        if (optionValue === undefined)
          openList()
        else
          openPanel(optionValue)
        focusInput()
      },
      get nativeElement() {
        return rootRef.value
      },
    }
    expose(api)

    // ---------------------------------------------------------------- render

    function renderTagLabel(option: CategorySearchOption | undefined, item: CategorySearchValueItem) {
      if (!option)
        return String(item.key)
      const info = { option, item }
      const custom = getSlotPropsFnRun(
        { labelRender: slots.labelRender },
        { labelRender: props.labelRender },
        'labelRender',
        false,
        info,
      )
      const valueNodes = custom !== undefined && custom !== null
        ? [custom]
        : truncateNodes(formatValue(option, item.value, localeText.value), props.maxTagTextLength)
      return [
        h('span', { class: `${prefixCls.value}-tag-label` }, [option.label ?? String(option.value), ': ']),
        h('span', { class: `${prefixCls.value}-tag-value` }, valueNodes),
      ]
    }

    function renderTag(item: CategorySearchValueItem) {
      const option = normalized.value.optionMap.get(item.key)
      const closable = isClosable(item)
      const label = renderTagLabel(option, item)
      const onClose = (event?: MouseEvent) => {
        event?.stopPropagation()
        removeItem(item)
      }
      const tagCls = clsx(`${prefixCls.value}-tag`, mergedClassNames.value.tag)
      const custom = option && slots.tag?.({ option, item, label, closable, onClose })
      if (custom) {
        return h('span', {
          key: String(item.key),
          class: tagCls,
          style: mergedStyles.value.tag,
          onClick: (event: MouseEvent) => handleTagClick(event, item),
        }, custom)
      }
      return h(Tag, {
        key: String(item.key),
        class: tagCls,
        style: mergedStyles.value.tag,
        closable,
        disabled: mergedDisabled.value,
        onClick: (event: MouseEvent) => handleTagClick(event, item),
        onClose: (event: MouseEvent) => onClose(event),
      } as any, { default: () => h('span', { class: `${prefixCls.value}-tag-text` }, label) })
    }

    function renderMaxTagPlaceholder(omitted: CategorySearchValueItem[]) {
      const custom = slots.maxTagPlaceholder
        ? slots.maxTagPlaceholder({ omittedValues: omitted })
        : typeof props.maxTagPlaceholder === 'function'
          ? props.maxTagPlaceholder(omitted)
          : props.maxTagPlaceholder
      return h(Tag, {
        key: '__more__',
        class: clsx(`${prefixCls.value}-tag`, `${prefixCls.value}-tag-static`, mergedClassNames.value.tag),
        style: mergedStyles.value.tag,
        disabled: mergedDisabled.value,
      } as any, { default: () => custom ?? `+ ${omitted.length} ...` })
    }

    function renderContent() {
      const items = mergedValue.value
      const max = mergedMaxTagCount.value
      const visible = max !== undefined && max >= 0 ? items.slice(0, max) : items
      const omitted = max !== undefined && max >= 0 ? items.slice(max) : []
      const prefixNode = slots.prefix?.()
      return [
        prefixNode
          ? h('span', {
              key: 'prefix',
              class: clsx(`${prefixCls.value}-prefix`, mergedClassNames.value.prefix),
              style: mergedStyles.value.prefix,
            }, prefixNode)
          : null,
        h('span', {
          key: 'content',
          class: clsx(`${prefixCls.value}-content`, mergedClassNames.value.content),
          style: mergedStyles.value.content,
        }, [
          ...visible.map(renderTag),
          omitted.length ? renderMaxTagPlaceholder(omitted) : null,
        ]),
      ]
    }

    function renderOptionLabel(option: CategorySearchOption) {
      const custom = slots.optionRender?.({ option })
      return custom ?? option.label ?? String(option.value)
    }

    function renderEmpty() {
      return h('div', { class: `${prefixCls.value}-popup-empty` }, slots.notFoundContent?.() ?? h(Empty, { image: Empty.PRESENTED_IMAGE_SIMPLE }))
    }

    function renderList() {
      const popupCls = `${prefixCls.value}-popup`
      const entries = normalized.value.entries
      if (!entries.length)
        return renderEmpty()
      const activeOption = selectableOptions.value[activeIndex.value]
      const selectedKeys = new Set(mergedValue.value.map(item => item.key))
      return h('ul', {
        id: listId,
        role: 'listbox',
        class: clsx(`${popupCls}-list`, popupClassNames.value.list),
        style: popupStyles.value.list,
        onMousedown: (event: MouseEvent) => event.preventDefault(),
      }, entries.map((entry) => {
        if (entry.kind === 'group') {
          return h('li', { key: entry.key, role: 'presentation', class: `${popupCls}-group` }, entry.label)
        }
        const { option } = entry
        const active = activeOption?.value === option.value
        const selected = selectedKeys.has(option.value)
        return h('li', {
          key: entry.key,
          id: `${id}-option-${String(option.value)}`,
          role: 'option',
          'aria-selected': selected,
          'aria-disabled': option.disabled || undefined,
          class: clsx(`${popupCls}-item`, {
            [`${popupCls}-item-grouped`]: entry.grouped,
            [`${popupCls}-item-active`]: active,
            [`${popupCls}-item-selected`]: selected,
            [`${popupCls}-item-disabled`]: option.disabled,
          }),
          onMouseenter: () => {
            if (!option.disabled)
              activeIndex.value = selectableOptions.value.indexOf(option)
          },
          onClick: () => {
            if (!option.disabled)
              openPanel(option.value, true)
          },
        }, [h('span', { class: `${popupCls}-item-content` }, renderOptionLabel(option))])
      }))
    }

    function renderFooter(onConfirm: () => void) {
      const popupCls = `${prefixCls.value}-popup`
      return h('div', { class: `${popupCls}-footer` }, [
        h(Button, { size: 'small', onClick: () => backToList() }, { default: () => localeText.value.cancel }),
        h(Button, { size: 'small', type: 'primary', loading: pending.value, onClick: onConfirm }, { default: () => localeText.value.confirm }),
      ])
    }

    function renderSingleSelect(option: CategorySearchOption) {
      const popupCls = `${prefixCls.value}-popup`
      const children = option.children ?? []
      if (!children.length)
        return renderEmpty()
      return h('ul', {
        id: listId,
        role: 'listbox',
        'aria-label': typeof option.label === 'string' ? option.label : undefined,
        class: `${popupCls}-list`,
        onMousedown: (event: MouseEvent) => event.preventDefault(),
      }, children.map((child, index) => {
        const selected = child.value === draft.value
        return h('li', {
          key: String(child.value),
          id: `${id}-value-${String(child.value)}`,
          role: 'option',
          'aria-selected': selected,
          'aria-disabled': child.disabled || undefined,
          class: clsx(`${popupCls}-item`, {
            [`${popupCls}-item-active`]: panelActiveIndex.value === index,
            [`${popupCls}-item-selected`]: selected,
            [`${popupCls}-item-disabled`]: child.disabled,
          }),
          onMouseenter: () => {
            if (!child.disabled)
              panelActiveIndex.value = index
          },
          onClick: () => {
            if (!child.disabled)
              commitValue(option, child.value)
          },
        }, [h('span', { class: `${popupCls}-item-content` }, child.label ?? String(child.value))])
      }))
    }

    function renderPanelBody(option: CategorySearchOption) {
      const popupCls = `${prefixCls.value}-popup`
      const type = getOptionType(option)
      const componentProps = option.componentProps ?? {}
      const setDraft = (value: any) => {
        draft.value = value
      }
      const confirm = (value?: any) => commitValue(option, value === undefined ? draft.value : value)

      if (type === 'custom') {
        const info: CategorySearchPanelRenderInfo = {
          option,
          value: draft.value,
          setValue: setDraft,
          confirm,
          cancel: backToList,
        }
        return slots.panel?.(info) ?? renderEmpty()
      }

      if (type === 'select') {
        const children = option.children ?? []
        const values: any[] = Array.isArray(draft.value) ? draft.value : []
        const enabledValues = children.filter(child => !child.disabled).map(child => child.value)
        const allChecked = enabledValues.length > 0 && enabledValues.every(value => values.includes(value))
        const someChecked = enabledValues.some(value => values.includes(value))
        return [
          h('div', { key: 'body', class: `${popupCls}-panel-body` }, children.length
            ? [
                h(Checkbox as any, {
                  key: 'all',
                  class: `${popupCls}-select-all`,
                  checked: allChecked,
                  indeterminate: someChecked && !allChecked,
                  'onUpdate:checked': (checked: boolean) => {
                    // 读取调用时的草稿，避免使用渲染时捕获的旧值。
                    const latest: any[] = Array.isArray(draft.value) ? draft.value : []
                    const keep = latest.filter(value => !enabledValues.includes(value))
                    setDraft(checked ? [...keep, ...enabledValues] : keep)
                  },
                }, { default: () => localeText.value.selectAll }),
                h(CheckboxGroup as any, {
                  key: 'group',
                  ...componentProps,
                  class: clsx(`${popupCls}-checkbox-group`, componentProps.class),
                  style: [{ display: 'flex', flexDirection: 'column' }, componentProps.style],
                  value: values,
                  options: children.map(child => ({ label: child.label ?? String(child.value), value: child.value, disabled: child.disabled })),
                  'onUpdate:value': (next: any[]) => setDraft(next),
                }),
              ]
            : renderEmpty()),
          renderFooter(() => confirm()),
        ]
      }

      if (type === 'numberRange') {
        const readRange = (): [number | null, number | null] => (Array.isArray(draft.value) ? draft.value as any : [null, null])
        const range = readRange()
        return [
          h('div', { key: 'body', class: `${popupCls}-range` }, [
            h(InputNumber as any, {
              ...componentProps,
              value: range[0],
              placeholder: localeText.value.min,
              'aria-label': localeText.value.min,
              'onUpdate:value': (value: number | null) => setDraft([value ?? null, readRange()[1]]),
              onPressEnter: () => confirm(),
            }),
            h('span', { 'aria-hidden': 'true' }, localeText.value.rangeSeparator.trim() || '~'),
            h(InputNumber as any, {
              ...componentProps,
              value: range[1],
              placeholder: localeText.value.max,
              'aria-label': localeText.value.max,
              'onUpdate:value': (value: number | null) => setDraft([readRange()[0], value ?? null]),
              onPressEnter: () => confirm(),
            }),
          ]),
          renderFooter(() => confirm()),
        ]
      }

      if (type === 'dateRange') {
        return [
          h(DateRangePicker as any, {
            key: 'body',
            ...componentProps,
            style: [{ width: '100%' }, componentProps.style],
            value: draft.value,
            // 日期弹层挂在面板内部，点击日期不会被外层浮层当成“点击外部”。
            getPopupContainer: componentProps.getPopupContainer ?? (() => panelRef.value ?? document.body),
            'onUpdate:value': (value: any) => setDraft(value ?? null),
          }),
          renderFooter(() => confirm()),
        ]
      }

      // input
      return [
        h(AInput, {
          key: 'body',
          ...componentProps,
          value: draft.value ?? '',
          'aria-label': typeof option.label === 'string' ? option.label : undefined,
          'onUpdate:value': (value: string) => setDraft(value),
          onPressEnter: (event: KeyboardEvent) => {
            if (!event.isComposing)
              confirm()
          },
        } as any),
        renderFooter(() => confirm()),
      ]
    }

    function renderPanel(option: CategorySearchOption) {
      const popupCls = `${prefixCls.value}-popup`
      const type = getOptionType(option)
      const isSingleSelect = type === 'select' && !option.multiple
      return h('div', {
        ref: panelRef,
        class: clsx(`${popupCls}-panel`, { [`${popupCls}-panel-select`]: isSingleSelect }, popupClassNames.value.panel),
        style: popupStyles.value.panel,
        role: isSingleSelect ? undefined : 'dialog',
        'aria-label': typeof option.label === 'string' ? option.label : undefined,
        onKeydown: handlePanelKeydown,
      }, isSingleSelect
        ? renderSingleSelect(option)
        : [
            h('div', { key: 'title', class: `${popupCls}-panel-title` }, option.label ?? String(option.value)),
            renderPanelBody(option),
          ])
    }

    function renderPopup() {
      const option = currentOption.value
      return h(PopupFormReset, null, {
        default: () => (option ? renderPanel(option) : renderList()),
      })
    }

    return () => {
      const items = mergedValue.value
      const hasRemovable = items.some(isClosable)
      const allowClearConfig = mergedAllowClear.value
      const canClear = !!allowClearConfig && !mergedDisabled.value && (hasRemovable || !!mergedSearchValue.value)
      const clearIconNode = slots.clearIcon?.()
        ?? (typeof allowClearConfig === 'object' ? allowClearConfig.clearIcon : undefined)
        ?? h('span', { 'aria-hidden': 'true' }, '×')
      const clearButton = canClear
        ? h('button', {
            type: 'button',
            class: clsx(`${prefixCls.value}-clear`, mergedClassNames.value.clear),
            style: mergedStyles.value.clear,
            'aria-label': localeText.value.clear,
            onMousedown: (event: MouseEvent) => event.preventDefault(),
            onClick: handleClear,
          }, clearIconNode)
        : null
      const suffixContent = slots.suffix?.()
      const suffix = clearButton || suffixContent ? [clearButton, suffixContent] : undefined

      const current = mode.value
      let activeDescendant: string | undefined
      if (popupOpen.value && current.type === 'list') {
        const option = selectableOptions.value[activeIndex.value]
        activeDescendant = option ? `${id}-option-${String(option.value)}` : undefined
      }
      else if (popupOpen.value && currentOption.value && panelActiveIndex.value >= 0) {
        const child = currentOption.value.children?.[panelActiveIndex.value]
        activeDescendant = child ? `${id}-value-${String(child.value)}` : undefined
      }

      const placeholder = items.length || mergedSearchValue.value
        ? undefined
        : (props.placeholder ?? localeText.value.placeholder)

      const input = h(AInput, {
        ref: inputRef,
        class: `${prefixCls.value}-selector`,
        value: mergedSearchValue.value,
        prefix: renderContent(),
        suffix,
        placeholder,
        disabled: mergedDisabled.value,
        readonly: !mergedShowSearch.value,
        size: props.size,
        status: props.status,
        variant: mergedVariant.value,
        allowClear: false,
        role: 'combobox',
        'aria-haspopup': 'listbox',
        'aria-expanded': popupOpen.value,
        'aria-controls': popupOpen.value ? listId : undefined,
        'aria-activedescendant': activeDescendant,
        'aria-autocomplete': 'none',
        classes: {
          input: mergedClassNames.value.input,
          suffix: clsx(`${prefixCls.value}-suffix`, mergedClassNames.value.suffix),
        },
        styles: {
          input: mergedStyles.value.input,
          suffix: mergedStyles.value.suffix,
        },
        'onUpdate:value': (value: string) => {
          if (!composing.value && mergedShowSearch.value)
            updateSearchValue(value ?? '')
        },
        onInput: handleInput,
        onKeydown: handleKeydown,
        onCompositionstart: () => {
          composing.value = true
        },
        onCompositionend: (event: CompositionEvent) => {
          composing.value = false
          handleInput(event)
        },
        onFocus: (event: FocusEvent) => emit('focus', event),
        onBlur: (event: FocusEvent) => emit('blur', event),
      } as any)

      const root = h('div', {
        ...omitClassAndStyle(attrs as Record<string, any>),
        ref: rootRef,
        class: mergedClassName.value,
        style: mergedStyle.value,
        onMousedown: handleRootPointerDown,
        onClick: handleRootClick,
      }, [input])

      const popupRootCls = clsx(
        `${prefixCls.value}-popup`,
        hashId.value,
        cssVarCls.value,
        rootCls.value,
        { [`${prefixCls.value}-popup-rtl`]: direction.value === 'rtl' },
        popupClassNames.value.root,
      )
      const matchWidth = props.popupMatchSelectWidth
      const popupWidthStyle = typeof matchWidth === 'number'
        ? { width: `${matchWidth}px` }
        : matchWidth && rootRef.value
          ? { width: `${rootRef.value.offsetWidth}px` }
          : undefined

      return h(Popover, {
        open: popupOpen.value,
        trigger: 'click',
        arrow: false,
        placement: mergedPlacement.value,
        getPopupContainer: props.getPopupContainer,
        rootClass: popupRootCls,
        styles: {
          root: { ...popupStyles.value.root, ...popupWidthStyle },
          container: popupWidthStyle ? { width: '100%' } : undefined,
        },
        onOpenChange: handlePopoverOpenChange,
      } as any, {
        default: () => root,
        content: () => renderPopup(),
      })
    }
  },
  {
    name: 'ACategorySearch',
    inheritAttrs: false,
  },
)

;(CategorySearch as any).install = (app: App) => {
  app.component(CategorySearch.name, CategorySearch)
}

export type {
  CategorySearchChangeInfo,
  CategorySearchChangeType,
  CategorySearchClassNamesType,
  CategorySearchConfig,
  CategorySearchEmits,
  CategorySearchFieldNames,
  CategorySearchLabelRenderInfo,
  CategorySearchOption,
  CategorySearchOptionGroup,
  CategorySearchOptionValue,
  CategorySearchPanelRenderInfo,
  CategorySearchPlacement,
  CategorySearchProps,
  CategorySearchRef,
  CategorySearchSemanticClassNames,
  CategorySearchSemanticName,
  CategorySearchSemanticStyles,
  CategorySearchSlots,
  CategorySearchStylesType,
  CategorySearchTagRenderInfo,
  CategorySearchType,
  CategorySearchValue,
  CategorySearchValueItem,
  CategorySearchValueOption,
} from './types'
export default CategorySearch
export { CategorySearch }
