import type { App, SlotsType } from 'vue'
import type { ProLocale } from '../locale/types'
import type {
  CronClassNamesType,
  CronEditorMode,
  CronEmits,
  CronFieldMode,
  CronFieldName,
  CronFields,
  CronFormat,
  CronLocale,
  CronProps,
  CronSemanticClassNames,
  CronSemanticStyles,
  CronSize,
  CronSlots,
  CronStylesType,
  CronValidateResult,
} from './types'
import { clsx } from '@v-c/util'
import { Button, Input, InputNumber, RadioGroup, Segmented, Select, Tooltip, useConfig } from 'antdv-next'
import { useBaseConfig } from 'antdv-next/config-provider/context'
import useCSSVarCls from 'antdv-next/config-provider/hooks/useCSSVarCls'
import { useLocaleContext } from 'antdv-next/locale/index'
import dayjs from 'dayjs'
import { computed, defineComponent, nextTick, ref, watch } from 'vue'
import { useFormItemInputContext, useFormItemInputContextProvider } from '../_util'
import { useMergeSemantic } from '../_util/semantic'
import { useProComponentConfig } from '../config-provider'
import enUSLocale from '../locale/en_US'
import useStyle from './style'
import {
  describeExpression,
  describeField,
  formatCronMessage,
  formatExpression,
  getFieldMode,
  getFieldTemplate,
  getPreview,
  isStepEveryField,
  parseExpression,
  resolveValueLabels,
  updateField,
  validateExpression,
} from './utils'
import {
  createDefaultFields,
  getFieldLimits,
  getFieldNames,
  getWeekAliases,
  MONTH_VALUES,
  WEEK_VALUES,
  weekNumberToName,
} from './utils/format'
import { parseSpecial, serializeSpecial } from './utils/special'

let cronIdSeed = 0

const MODE_VALUES: CronEditorMode[] = ['every', 'interval', 'specified', 'range']
const enUS = enUSLocale.Cron!

const FORM_CONTROL_ATTR_KEYS = ['id', 'onBlur', 'onFocus', 'aria-describedby', 'aria-invalid', 'aria-required'] as const

function splitRootAndControlAttrs(attrs: Record<string, any>) {
  const rootAttrs = { ...attrs }
  delete rootAttrs.class
  delete rootAttrs.style
  const controlAttrs: Record<string, any> = {}
  for (const key of FORM_CONTROL_ATTR_KEYS) {
    if (rootAttrs[key] !== undefined) {
      controlAttrs[key] = rootAttrs[key]
      delete rootAttrs[key]
    }
  }
  return { rootAttrs, controlAttrs }
}

function getNumericParts(value: string, fallback: number, names?: readonly string[], format: CronFormat = 'quartz', field?: CronFieldName): number[] {
  return value.split(/[,/\-]/).map((item) => {
    const normalized = item.toUpperCase()
    if (normalized === '*')
      return fallback
    if (field === 'week') {
      const aliases = getWeekAliases(format)
      if (normalized in aliases)
        return aliases[normalized]!
    }
    const aliasIndex = names ? (names as readonly string[]).indexOf(normalized) : -1
    return aliasIndex >= 0 ? aliasIndex + 1 : Number(item)
  }).filter(Number.isFinite).concat(fallback)
}

function getSpecifiedSortValue(value: string, names?: readonly string[], format: CronFormat = 'quartz', field?: CronFieldName): number {
  const normalized = value.trim().toUpperCase()
  if (field === 'week') {
    const aliases = getWeekAliases(format)
    if (normalized in aliases)
      return aliases[normalized]!
  }
  const aliasIndex = names ? (names as readonly string[]).indexOf(normalized as never) : -1
  if (aliasIndex >= 0)
    return aliasIndex + 1
  const numeric = Number(normalized)
  return Number.isFinite(numeric) ? numeric : Number.POSITIVE_INFINITY
}

function sortSpecifiedValues(values: string[], names?: readonly string[], format: CronFormat = 'quartz', field?: CronFieldName): string[] {
  return [...values].sort((a, b) => getSpecifiedSortValue(a, names, format, field) - getSpecifiedSortValue(b, names, format, field))
}

function getSelectedValues(value: string, names?: readonly string[], format: CronFormat = 'quartz', field?: CronFieldName): string[] {
  if (!value || value === '*' || value === '?')
    return []
  return sortSpecifiedValues(value.split(',').flatMap(item => item.split('/')[0]!.split('-')).map((item) => {
    const normalized = item.trim().toUpperCase()
    if (names?.includes(normalized as never))
      return normalized
    const numeric = Number(normalized)
    if (Number.isInteger(numeric) && field === 'week')
      return weekNumberToName(numeric, format) ?? normalized
    if (Number.isInteger(numeric))
      return names?.[numeric - 1] ?? normalized
    return normalized
  }).filter(Boolean), names, format, field)
}

function formatNamedValue(field: CronFieldName, value: string, locale?: CronLocale, format: CronFormat = 'quartz') {
  const numericValue = Number(value)
  const normalized = Number.isInteger(numericValue)
    ? (field === 'week' ? weekNumberToName(numericValue, format) : field === 'month' ? MONTH_VALUES[numericValue - 1] : undefined) ?? value
    : value
  return locale?.valueLabels?.[field]?.[normalized] ?? normalized
}

function formatFieldValue(field: CronFieldName, value: string, locale?: CronLocale, format: CronFormat = 'quartz') {
  const normalized = formatNamedValue(field, value, locale, format)
  return field === 'second' || field === 'minute' || field === 'hour' ? normalized.padStart(2, '0') : normalized
}

const Cron = defineComponent<CronProps, CronEmits, string, SlotsType<CronSlots>>(
  (props, { attrs, emit, slots }) => {
    const { prefixCls, direction } = useBaseConfig('cron', props)
    const { componentDisabled, componentSize } = useConfig()
    const formItemInputContext = useFormItemInputContext()
    const localeContext = useLocaleContext()
    const proConfig = useProComponentConfig('cron')
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)
    const mergedFormat = computed<CronFormat>(() => props.format ?? proConfig.value.format ?? 'quartz')
    const mergedShowYear = computed(() => mergedFormat.value === 'unix' ? false : props.showYear ?? proConfig.value.showYear ?? false)
    const cronOptions = computed(() => ({ format: mergedFormat.value, showYear: mergedShowYear.value }))
    const fieldLimits = computed(() => getFieldLimits(mergedFormat.value))
    const mergedDisabled = computed(() => props.disabled ?? proConfig.value.disabled ?? componentDisabled.value ?? false)
    const mergedReadonly = computed(() => props.readonly ?? proConfig.value.readonly ?? false)
    const mergedSize = computed<CronSize>(() => {
      const size = props.size ?? proConfig.value.size ?? componentSize.value ?? 'medium'
      return size === 'small' || size === 'medium' || size === 'large' ? size : 'medium'
    })
    const mergedPreview = computed(() => props.preview ?? proConfig.value.preview ?? false)
    const mergedPresets = computed(() => props.presets ?? proConfig.value.presets ?? [])
    const localeCode = computed(() => localeContext.locale.value?.locale ?? 'en')
    const proCronLocale = computed(() => (localeContext.locale.value as ProLocale | undefined)?.Cron)
    const cronLocaleCode = computed(() => proCronLocale.value ? localeCode.value : 'en')
    const locale = computed<CronLocale>(() => ({
      ...enUS,
      ...proCronLocale.value,
      valueLabels: resolveValueLabels(localeCode.value, localeContext.locale.value?.DatePicker?.lang, proCronLocale.value?.valueLabels),
    }))
    const dateTimeFormat = computed(() => {
      const pickerLocale = localeContext.locale.value?.DatePicker?.lang
      return pickerLocale?.fieldDateTimeFormat ?? 'YYYY-MM-DD HH:mm:ss'
    })
    const editable = computed(() => !mergedDisabled.value && !mergedReadonly.value)
    const draftExpression = ref(props.value ?? '')
    const fields = ref<CronFields>(createDefaultFields(cronOptions.value))
    const activeField = ref<CronFieldName>('minute')
    const fieldTabRefs: Partial<Record<CronFieldName, HTMLElement>> = {}
    const validation = ref<CronValidateResult>({ status: draftExpression.value ? 'invalid' : 'empty' })
    const mergedStatus = computed(() => validation.value.status === 'invalid'
      ? 'error'
      : props.status ?? formItemInputContext.value.status)

    const mergedSemanticProps = computed<CronProps>(() => ({
      ...props,
      format: mergedFormat.value,
      showYear: mergedShowYear.value,
      disabled: mergedDisabled.value,
      readonly: mergedReadonly.value,
      size: mergedSize.value,
      status: mergedStatus.value,
      preview: mergedPreview.value,
      presets: mergedPresets.value,
    }))
    const [mergedClassNames, mergedStyles] = useMergeSemantic<CronSemanticClassNames, CronSemanticStyles, CronProps>(
      computed(() => [proConfig.value.classes as CronClassNamesType | undefined, props.classes]),
      computed(() => [proConfig.value.styles as CronStylesType | undefined, props.styles]),
      computed(() => ({ props: mergedSemanticProps.value })),
    )
    const displayedFields = computed<CronFieldName[]>(() => getFieldNames(cronOptions.value))
    const cronId = `cron-${++cronIdSeed}`
    const activeValue = computed(() => fields.value[activeField.value] ?? '')
    const activeMode = computed<CronFieldMode>(() => {
      const mode = getFieldMode(activeValue.value, activeField.value)
      if (mode === 'interval' && activeValue.value.startsWith('*/') && isStepEveryField(activeField.value))
        return 'every'
      return mode
    })
    const modeOptions = computed(() => {
      const toOption = (value: CronFieldMode) => ({
        label: value === 'unspecified' ? locale.value.notSpecified : value === 'special' ? locale.value.modes.special : locale.value.modes[value as CronEditorMode],
        value,
      })
      if (activeField.value === 'day' || activeField.value === 'week') {
        const options = [toOption('every'), ...MODE_VALUES.filter(value => value !== 'every').map(toOption)]
        if (mergedFormat.value === 'quartz') {
          options.splice(1, 0, toOption('unspecified'))
          options.push(toOption('special'))
        }
        return options
      }
      return MODE_VALUES.map(toOption)
    })
    useFormItemInputContextProvider(computed(() => ({
      ...formItemInputContext.value,
      status: mergedStatus.value,
    })))
    const preview = computed(() => validation.value.status === 'valid' && mergedPreview.value
      ? getPreview(draftExpression.value, cronOptions.value, locale.value, cronLocaleCode.value)
      : undefined)
    const rootClassName = computed(() => clsx(
      prefixCls.value,
      `${prefixCls.value}-${mergedSize.value}`,
      hashId.value,
      cssVarCls.value,
      rootCls.value,
      { [`${prefixCls.value}-rtl`]: direction.value === 'rtl' },
      { [`${prefixCls.value}-status-${mergedStatus.value}`]: mergedStatus.value },
      proConfig.value.class,
      props.rootClass,
      mergedClassNames.value.root,
      (attrs as any).class,
    ))
    const rootStyle = computed(() => [mergedStyles.value.root, proConfig.value.style, (attrs as any).style])

    function updateValidation(expression: string) {
      const result = validateExpression(expression, cronOptions.value, locale.value)
      validation.value = result
      emit('validate', result)
      return result
    }

    function applyExpression(expression: string) {
      const previousValidation = validation.value
      draftExpression.value = expression
      const result = updateValidation(expression)
      let nextExpression = expression
      if (result.status === 'valid' && result.expression) {
        const parsed = parseExpression(result.expression, cronOptions.value, locale.value)
        if (parsed) {
          fields.value = parsed
          nextExpression = result.expression
          draftExpression.value = nextExpression
        }
      }
      if (nextExpression !== props.value) {
        emit('update:value', nextExpression)
        if (result.status === 'valid' && (previousValidation.status !== 'valid' || previousValidation.expression !== result.expression))
          emit('change', nextExpression)
      }
    }

    function applyFieldValue(field: CronFieldName, value: string) {
      if (!editable.value)
        return
      fields.value = updateField(fields.value, field, value, cronOptions.value)
      applyExpression(formatExpression(fields.value, cronOptions.value))
    }

    function setFieldMode(mode: CronFieldMode) {
      const [min, max] = fieldLimits.value[activeField.value]
      const defaultStart = activeField.value === 'year'
        ? Math.min(Math.max(new Date().getFullYear(), min), max)
        : min
      const current = activeValue.value
      const fallback = current === '?' ? '*' : current
      const names = activeField.value === 'month' ? MONTH_VALUES : activeField.value === 'week' ? WEEK_VALUES : undefined
      const values: Record<CronFieldMode, string> = {
        every: '*',
        unspecified: '?',
        interval: `${fallback === '*' ? defaultStart : getNumericParts(fallback, defaultStart, names, mergedFormat.value, activeField.value)[0]}/${Math.min(5, max - min + 1)}`,
        specified: names?.[0] ?? String(defaultStart),
        range: `${defaultStart}-${Math.min(defaultStart + 1, max)}`,
        special: activeField.value === 'week' ? '6#1' : 'L',
      }
      applyFieldValue(activeField.value, values[mode])
    }

    function setActiveField(field: CronFieldName) {
      activeField.value = field
      nextTick(() => {
        fieldTabRefs[field]?.focus()
      })
    }

    function handleFieldTabKeydown(field: CronFieldName, event: KeyboardEvent) {
      if (mergedDisabled.value)
        return

      const tabFields = displayedFields.value
      const index = tabFields.indexOf(field)
      if (index < 0)
        return

      let nextIndex = -1
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
        nextIndex = (index + 1) % tabFields.length
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
        nextIndex = (index - 1 + tabFields.length) % tabFields.length
      else if (event.key === 'Home')
        nextIndex = 0
      else if (event.key === 'End')
        nextIndex = tabFields.length - 1
      else
        return

      event.preventDefault()
      const nextField = tabFields[nextIndex]
      if (nextField)
        setActiveField(nextField)
    }

    function getModeDescription(mode: CronFieldMode) {
      const field = activeField.value
      const fallback = describeField(field, activeValue.value, locale.value, mergedFormat.value)
      if (mode === 'specified' || mode === 'range') {
        try {
          return describeExpression(
            formatExpression(fields.value, cronOptions.value),
            cronLocaleCode.value,
            cronOptions.value,
          )
        }
        catch {
          return fallback
        }
      }
      return fallback
    }

    function renderEditorTemplate(template: string, slots: Record<string, any>) {
      return template.split(/(\{(?:start|step|end)\})/).filter(Boolean).map((part, index) => {
        const slot = slots[part.slice(1, -1)]
        return <span key={`${part}-${index}`}>{slot ?? part}</span>
      })
    }

    function renderNumberSelect(field: CronFieldName, value: number, min: number, max: number, ariaLabel: string, onUpdate: (value: number) => void, formatOption?: (value: number) => string) {
      return (
        <Select
          value={String(value)}
          options={Array.from({ length: max - min + 1 }, (_, index) => {
            const optionValue = index + min
            const label = formatOption?.(optionValue) ?? formatFieldValue(field, String(optionValue), locale.value, mergedFormat.value)
            return { value: String(optionValue), label }
          })}
          size={mergedSize.value}
          disabled={!editable.value}
          aria-label={ariaLabel}
          onUpdate:value={nextValue => onUpdate(Number(nextValue ?? min))}
        />
      )
    }

    function renderNumberControl(field: CronFieldName, value: number, min: number, max: number, ariaLabel: string, onUpdate: (value: number) => void) {
      if (field !== 'year')
        return renderNumberSelect(field, value, min, max, ariaLabel, onUpdate)
      return <InputNumber min={min} max={max} value={value} size={mergedSize.value} disabled={!editable.value} controls={false} aria-label={ariaLabel} onUpdate:value={nextValue => onUpdate(Number(nextValue ?? min))} />
    }

    function renderSpecifiedSelect(field: CronFieldName, value: string, names?: readonly string[]) {
      const [min, max] = fieldLimits.value[field]
      const optionValues = names ?? (field === 'year' ? [] : Array.from({ length: max - min + 1 }, (_, index) => String(index + min)))
      const options = optionValues.map(item => ({ value: item, label: formatFieldValue(field, item, locale.value, mergedFormat.value) }))
      const mode = field === 'year' ? 'tags' : 'multiple'
      return (
        <Select
          mode={mode}
          value={getSelectedValues(value, names, mergedFormat.value, field)}
          options={options}
          size={mergedSize.value}
          disabled={!editable.value}
          showSearch
          tokenSeparators={field === 'year' ? [','] : undefined}
          class={`${prefixCls.value}-specific-select`}
          placeholder={formatCronMessage(locale.value.fieldValues, { field: locale.value.fields[field] })}
          aria-label={formatCronMessage(locale.value.fieldValues, { field: locale.value.fields[field] })}
          onUpdate:value={nextValue => applyFieldValue(field, Array.isArray(nextValue) ? sortSpecifiedValues(nextValue.map(item => String(item)), names, mergedFormat.value, field).join(',') : String(nextValue ?? ''))}
        />
      )
    }

    function applySpecial(next: Parameters<typeof serializeSpecial>[0]) {
      applyFieldValue(activeField.value, serializeSpecial(next))
    }

    function renderSpecialControls(field: 'day' | 'week') {
      const special = parseSpecial(activeValue.value, field)
      if (field === 'day') {
        const current = special && (special.type === 'last' || special.type === 'lastWeekday' || special.type === 'nearestWeekday')
          ? special
          : { type: 'last' as const }
        return (
          <div class={`${prefixCls.value}-special`}>
            <RadioGroup
              value={current.type}
              disabled={!editable.value}
              options={[
                { label: locale.value.specialLastDay, value: 'last' },
                { label: locale.value.specialLastWeekday, value: 'lastWeekday' },
                { label: formatCronMessage(locale.value.specialNearestWeekday, { day: current.type === 'nearestWeekday' ? current.day : 15 }), value: 'nearestWeekday' },
              ]}
              onUpdate:value={(nextValue) => {
                const type = String(nextValue)
                if (type === 'last')
                  applySpecial({ type: 'last' })
                else if (type === 'lastWeekday')
                  applySpecial({ type: 'lastWeekday' })
                else
                  applySpecial({ type: 'nearestWeekday', day: current.type === 'nearestWeekday' ? current.day : 15 })
              }}
            />
            {current.type === 'nearestWeekday' && renderNumberSelect('day', current.day, 1, 31, locale.value.specialNearestWeekday, day => applySpecial({ type: 'nearestWeekday', day }))}
          </div>
        )
      }

      const current = special && (special.type === 'lastDayOfWeek' || special.type === 'nthDayOfWeek')
        ? special
        : { type: 'nthDayOfWeek' as const, week: 6, nth: 1 }
      const weekName = weekNumberToName(current.week, 'quartz') ?? 'FRI'
      return (
        <div class={`${prefixCls.value}-special`}>
          <Select
            value={weekName}
            options={WEEK_VALUES.map(item => ({ value: item, label: formatFieldValue('week', item, locale.value, 'quartz') }))}
            size={mergedSize.value}
            disabled={!editable.value}
            class={`${prefixCls.value}-special-week`}
            aria-label={locale.value.fields.week}
            onUpdate:value={(nextValue) => {
              const week = WEEK_VALUES.indexOf(String(nextValue).toUpperCase() as typeof WEEK_VALUES[number]) + 1
              if (current.type === 'lastDayOfWeek')
                applySpecial({ type: 'lastDayOfWeek', week })
              else
                applySpecial({ type: 'nthDayOfWeek', week, nth: current.nth })
            }}
          />
          <RadioGroup
            value={current.type === 'lastDayOfWeek' ? 'last' : 'nth'}
            disabled={!editable.value}
            options={[
              { label: locale.value.specialLast, value: 'last' },
              { label: locale.value.specialNth, value: 'nth' },
            ]}
            onUpdate:value={(nextValue) => {
              if (String(nextValue) === 'last')
                applySpecial({ type: 'lastDayOfWeek', week: current.week })
              else
                applySpecial({ type: 'nthDayOfWeek', week: current.week, nth: current.type === 'nthDayOfWeek' ? current.nth : 1 })
            }}
          />
          {current.type === 'nthDayOfWeek' && renderNumberSelect('week', current.nth, 1, 5, locale.value.specialNth, nth => applySpecial({ type: 'nthDayOfWeek', week: current.week, nth }), nth => String(nth))}
        </div>
      )
    }

    function wrapControls(content: any) {
      return content == null ? null : <div class={`${prefixCls.value}-controls`}>{content}</div>
    }

    function renderFieldControls() {
      const field = activeField.value
      const [min, max] = fieldLimits.value[field]
      const value = activeValue.value
      const mode = activeMode.value
      const names = field === 'month' ? MONTH_VALUES : field === 'week' ? WEEK_VALUES : undefined
      const values = getNumericParts(value, min, names, mergedFormat.value, field)
      const editorTemplate = formatCronMessage(getFieldTemplate(field, mode, locale.value), { field: locale.value.fields[field] })
      if (mode === 'special' && (field === 'day' || field === 'week'))
        return wrapControls(renderSpecialControls(field))
      if (mode === 'unspecified' || (mode === 'every' && (field === 'day' || field === 'week')))
        return null
      if (mode === 'every') {
        const interval = value.startsWith('*/') ? Number(value.slice(2)) : 1
        return wrapControls(renderEditorTemplate(editorTemplate, {
          step: renderNumberControl(field, Number.isFinite(interval) && interval > 0 ? interval : 1, 1, max - min + 1, formatCronMessage(locale.value.fieldInterval, { field: locale.value.fields[field] }), nextValue => applyFieldValue(field, nextValue === 1 ? '*' : `*/${nextValue}`)),
        }))
      }
      if (mode === 'interval') {
        return wrapControls(renderEditorTemplate(editorTemplate, {
          start: renderNumberControl(field, values[0] ?? min, min, max, formatCronMessage(locale.value.fieldStart, { field: locale.value.fields[field] }), nextValue => applyFieldValue(field, `${nextValue}/${values[1] ?? 1}`)),
          step: renderNumberControl(field, values[1] ?? 1, 1, max - min + 1, formatCronMessage(locale.value.fieldInterval, { field: locale.value.fields[field] }), nextValue => applyFieldValue(field, `${values[0] ?? min}/${nextValue}`)),
        }))
      }
      if (mode === 'range') {
        return wrapControls(renderEditorTemplate(editorTemplate, {
          start: renderNumberControl(field, values[0] ?? min, min, max, formatCronMessage(locale.value.fieldRangeStart, { field: locale.value.fields[field] }), nextValue => applyFieldValue(field, `${nextValue}-${values[1] ?? max}`)),
          end: renderNumberControl(field, values[1] ?? max, min, max, formatCronMessage(locale.value.fieldRangeEnd, { field: locale.value.fields[field] }), nextValue => applyFieldValue(field, `${values[0] ?? min}-${nextValue}`)),
        }))
      }
      if (mode === 'specified') {
        return wrapControls(renderSpecifiedSelect(field, value, names))
      }
      return wrapControls(<Input value={value} size={mergedSize.value} disabled={!editable.value} aria-label={formatCronMessage(locale.value.fieldValues, { field: locale.value.fields[field] })} onUpdate:value={nextValue => applyFieldValue(field, String(nextValue ?? ''))} />)
    }

    watch([() => props.value, mergedShowYear, mergedFormat, locale], ([value]) => {
      const expression = value ?? ''
      draftExpression.value = expression
      const result = updateValidation(expression)
      fields.value = (result.status === 'valid' ? parseExpression(expression, cronOptions.value, locale.value) : undefined) ?? createDefaultFields(cronOptions.value)
      if (!displayedFields.value.includes(activeField.value))
        activeField.value = 'minute'
    }, { immediate: true })

    return () => {
      const { rootAttrs, controlAttrs } = splitRootAndControlAttrs(attrs as Record<string, any>)
      return (
        <div class={rootClassName.value} style={rootStyle.value} data-size={mergedSize.value} data-format={mergedFormat.value} data-disabled={mergedDisabled.value ? 'true' : 'false'} data-readonly={mergedReadonly.value ? 'true' : 'false'} data-status={mergedStatus.value || undefined} aria-readonly={mergedReadonly.value || undefined} {...rootAttrs}>
          <Input value={draftExpression.value} size={mergedSize.value} readonly disabled={mergedDisabled.value} class={mergedClassNames.value.input} style={mergedStyles.value.input} aria-label={locale.value.expression} {...controlAttrs} />
          <div class={clsx(`${prefixCls.value}-fields`, mergedClassNames.value.fields)} style={mergedStyles.value.fields}>
            <div class={clsx(`${prefixCls.value}-field-tabs`, mergedClassNames.value.navigation)} style={mergedStyles.value.navigation} role="tablist" aria-orientation="vertical" aria-label={locale.value.fieldList}>
              {displayedFields.value.map((field) => {
                const tabId = `${cronId}-tab-${field}`
                const panelId = `${cronId}-panel-${field}`
                const active = activeField.value === field
                return (
                  <span
                    key={field}
                    id={tabId}
                    ref={(el) => {
                      if (el)
                        fieldTabRefs[field] = el as HTMLElement
                      else
                        delete fieldTabRefs[field]
                    }}
                    role="tab"
                    class={clsx(`${prefixCls.value}-field-tab`, `${prefixCls.value}-field-tab-label`, { [`${prefixCls.value}-field-tab-active`]: active })}
                    data-field={field}
                    aria-selected={active}
                    aria-controls={panelId}
                    aria-disabled={mergedDisabled.value || undefined}
                    tabindex={mergedDisabled.value || !active ? -1 : 0}
                    onClick={() => {
                      if (!mergedDisabled.value)
                        setActiveField(field)
                    }}
                    onKeydown={(event: KeyboardEvent) => handleFieldTabKeydown(field, event)}
                  >
                    {locale.value.fields[field]}
                  </span>
                )
              })}
            </div>
            <div class={clsx(`${prefixCls.value}-editor`, mergedClassNames.value.editor)} style={mergedStyles.value.editor}>
              <div id={`${cronId}-panel-${activeField.value}`} class={clsx(`${prefixCls.value}-field`, mergedClassNames.value.field)} style={mergedStyles.value.field} role="tabpanel" aria-labelledby={`${cronId}-tab-${activeField.value}`} data-field={activeField.value} data-mode={activeMode.value} data-disabled={mergedDisabled.value ? 'true' : 'false'} data-invalid={validation.value.status === 'invalid' ? 'true' : 'false'}>
                {slots.field?.({ field: activeField.value, value: activeValue.value, disabled: mergedDisabled.value, readonly: mergedReadonly.value }) ?? (
                  <>
                    <div class={`${prefixCls.value}-field-title`}>{locale.value.fields[activeField.value]}</div>
                    <div class={`${prefixCls.value}-field-modes`}><Segmented options={modeOptions.value} value={activeMode.value} size={mergedSize.value} disabled={!editable.value} onUpdate:value={nextValue => setFieldMode(nextValue as CronFieldMode)} /></div>
                    {renderFieldControls()}
                    <div class={`${prefixCls.value}-field-control-summary`}>{getModeDescription(activeMode.value)}</div>
                  </>
                )}
              </div>
            </div>
          </div>
          {mergedPresets.value.length > 0 && (
            <div class={clsx(`${prefixCls.value}-presets`, mergedClassNames.value.presets)} style={mergedStyles.value.presets}>
              {slots.presets?.() ?? mergedPresets.value.map((preset) => {
                const button = <Button size="small" disabled={!editable.value} onClick={() => applyExpression(preset.value)}>{preset.label}</Button>
                return preset.description
                  ? <Tooltip key={preset.value} title={preset.description}>{button}</Tooltip>
                  : <Button key={preset.value} size="small" disabled={!editable.value} onClick={() => applyExpression(preset.value)}>{preset.label}</Button>
              })}
            </div>
          )}
          {preview.value && (
            <div class={clsx(`${prefixCls.value}-preview`, mergedClassNames.value.preview)} style={mergedStyles.value.preview}>
              {slots.preview?.(preview.value) ?? (
                <>
                  {preview.value.nextRuns?.length
                    ? (
                        <div class={`${prefixCls.value}-preview-runs`}>
                          {preview.value.nextRuns.map(run => (
                            <div key={run.getTime()} class={`${prefixCls.value}-preview-run`}>
                              {formatCronMessage(locale.value.nextRun, { value: dayjs(run).locale(localeCode.value).format(dateTimeFormat.value) })}
                            </div>
                          ))}
                        </div>
                      )
                    : <div class={`${prefixCls.value}-preview-empty`}>{locale.value.noFutureRun}</div>}
                  {preview.value.description
                    ? <div class={`${prefixCls.value}-preview-description`}>{preview.value.description}</div>
                    : null}
                </>
              )}
            </div>
          )}
          {validation.value.status === 'invalid' && <div class={clsx(`${prefixCls.value}-error`, mergedClassNames.value.error)} style={mergedStyles.value.error} role="alert">{slots.error?.(validation.value) ?? validation.value.errors?.map(error => error.message).join('; ') ?? locale.value.validation.invalidExpression}</div>}
        </div>
      )
    }
  },
  { name: 'ACron', inheritAttrs: false },
)

;(Cron as any).install = (app: App) => app.component(Cron.name, Cron)

export type { CronClassNamesType, CronConfig, CronEditorMode, CronEmits, CronError, CronErrorCode, CronFieldMode, CronFieldName, CronFields, CronFieldSlotProps, CronFormat, CronLocale, CronOptions, CronPreset, CronPreviewResult, CronProps, CronSemanticClassNames, CronSemanticName, CronSemanticStyles, CronSize, CronSlots, CronStatus, CronStylesType, CronValidateResult, CronValidateStatus } from './types'
export default Cron
export { Cron }
export { validateExpression as validateCronExpression } from './utils'
