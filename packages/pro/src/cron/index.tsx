import type { App, SlotsType } from 'vue'
import type { ProLocale } from '../locale/types'
import type {
  CronClassNamesType,
  CronEmits,
  CronFieldMode,
  CronFieldName,
  CronFields,
  CronLocale,
  CronProps,
  CronSemanticClassNames,
  CronSemanticStyles,
  CronSlots,
  CronStylesType,
  CronValidateResult,
} from './types'
import { clsx } from '@v-c/util'
import { Button, Input, InputNumber, Segmented, Select, useConfig } from 'antdv-next'
import { useBaseConfig } from 'antdv-next/config-provider/context'
import useCSSVarCls from 'antdv-next/config-provider/hooks/useCSSVarCls'
import { useFormItemInputContext, useFormItemInputContextProvider } from 'antdv-next/dist/form/context'
import { useLocaleContext } from 'antdv-next/locale/index'
import dayjs from 'dayjs'
import { computed, defineComponent, ref, watch } from 'vue'
import { useMergeSemantic } from '../_util/semantic'
import { useProComponentConfig } from '../config-provider'
import enUSLocale from '../locale/en_US'
import useStyle from './style'
import {
  createDefaultFields,
  formatCronMessage,
  formatExpression,
  getFieldMode,
  getPreview,
  parseExpression,
  updateField,
  validateExpression,
} from './utils'

let cronIdSeed = 0

const FIELD_LIMITS: Record<CronFieldName, readonly [number, number]> = {
  second: [0, 59],
  minute: [0, 59],
  hour: [0, 23],
  day: [1, 31],
  month: [1, 12],
  week: [1, 7],
  year: [1, 9999],
}

const MONTH_VALUES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
const WEEK_VALUES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MODE_VALUES: Exclude<CronFieldMode, 'unspecified'>[] = ['every', 'interval', 'specified', 'range']
const enUS = enUSLocale.Cron!

function omitClassAndStyle(attrs: Record<string, any>) {
  const nextAttrs = { ...attrs }
  delete nextAttrs.class
  delete nextAttrs.style
  return nextAttrs
}

function getNumericParts(value: string, fallback: number, names?: string[]): number[] {
  return value.split(/[,/\-]/).map((item) => {
    const aliasIndex = names?.indexOf(item.toUpperCase()) ?? -1
    return aliasIndex >= 0 ? aliasIndex + 1 : Number(item)
  }).filter(Number.isFinite).concat(fallback)
}

function getSelectedValues(value: string, names?: string[]): string[] {
  if (!value || value === '*' || value === '?')
    return []
  return value.split(',').flatMap(item => item.split('/')[0]!.split('-')).map((item) => {
    const normalized = item.trim().toUpperCase()
    if (names?.includes(normalized))
      return normalized
    const numeric = Number(normalized)
    if (Number.isInteger(numeric))
      return names?.[numeric - 1] ?? normalized
    return normalized
  }).filter(Boolean)
}

function formatFieldValue(field: CronFieldName, value: string, locale?: CronLocale) {
  const numericValue = Number(value)
  const aliases = field === 'month' ? MONTH_VALUES : field === 'week' ? WEEK_VALUES : undefined
  const normalized = aliases && Number.isInteger(numericValue) ? aliases[numericValue - 1] ?? value : value
  return locale?.valueLabels?.[field]?.[normalized] ?? (field === 'second' || field === 'minute' || field === 'hour' ? normalized.padStart(2, '0') : normalized)
}

function formatDescriptionValue(field: CronFieldName, value: string, locale: CronLocale) {
  const numericValue = Number(value)
  const aliases = field === 'month' ? MONTH_VALUES : field === 'week' ? WEEK_VALUES : undefined
  const normalized = aliases && Number.isInteger(numericValue) ? aliases[numericValue - 1] ?? value : value
  return locale.valueLabels?.[field]?.[normalized] ?? normalized
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
    const mergedShowYear = computed(() => props.showYear ?? proConfig.value.showYear ?? false)
    const mergedDisabled = computed(() => props.disabled ?? proConfig.value.disabled ?? componentDisabled.value ?? false)
    const mergedReadonly = computed(() => props.readonly ?? proConfig.value.readonly ?? false)
    const mergedSize = computed(() => props.size ?? proConfig.value.size ?? componentSize.value ?? 'middle')
    const mergedPreview = computed(() => props.preview ?? proConfig.value.preview ?? false)
    const mergedPresets = computed(() => props.presets ?? proConfig.value.presets ?? [])
    const localeCode = computed(() => localeContext.locale.value?.locale ?? 'en')
    const locale = computed<CronLocale>(() => ({
      ...enUS,
      ...((localeContext.locale.value as ProLocale | undefined)?.Cron ?? {}),
    }))
    const dateTimeFormat = computed(() => {
      const pickerLocale = localeContext.locale.value?.DatePicker?.lang
      return pickerLocale?.fieldDateTimeFormat ?? 'YYYY-MM-DD HH:mm:ss'
    })
    const editable = computed(() => !mergedDisabled.value && !mergedReadonly.value)
    const draftExpression = ref(props.value ?? '')
    const fields = ref<CronFields>(createDefaultFields(mergedShowYear.value))
    const activeField = ref<CronFieldName>('minute')
    const validation = ref<CronValidateResult>({ status: draftExpression.value ? 'invalid' : 'empty' })
    const mergedStatus = computed(() => validation.value.status === 'invalid'
      ? 'error'
      : props.status ?? formItemInputContext.value.status)

    const mergedSemanticProps = computed<CronProps>(() => ({
      ...props,
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
    const displayedFields = computed<CronFieldName[]>(() => mergedShowYear.value
      ? ['second', 'minute', 'hour', 'day', 'month', 'week', 'year']
      : ['second', 'minute', 'hour', 'day', 'month', 'week'])
    const cronId = `cron-${++cronIdSeed}`
    const activeValue = computed(() => fields.value[activeField.value] ?? '')
    const activeMode = computed<CronFieldMode>(() => {
      const mode = getFieldMode(activeValue.value)
      if (mode === 'interval' && activeValue.value.startsWith('*/') && activeField.value !== 'day' && activeField.value !== 'week')
        return 'every'
      return mode
    })
    const modeOptions = computed(() => {
      const toOption = (value: CronFieldMode) => ({
        label: value === 'unspecified' ? locale.value.notSpecified : locale.value.modes[value],
        value,
      })
      if (activeField.value === 'day' || activeField.value === 'week')
        return [toOption('every'), toOption('unspecified'), ...MODE_VALUES.filter(value => value !== 'every').map(toOption)]
      return MODE_VALUES.map(toOption)
    })
    useFormItemInputContextProvider(computed(() => ({
      ...formItemInputContext.value,
      status: mergedStatus.value,
    })))
    const preview = computed(() => validation.value.status === 'valid' && mergedPreview.value
      ? getPreview(draftExpression.value, mergedShowYear.value, locale.value)
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
      const result = validateExpression(expression, mergedShowYear.value, locale.value)
      validation.value = result
      emit('validate', result)
      return result
    }

    function applyExpression(expression: string, source: 'input' | 'editor') {
      const previousValidation = validation.value
      draftExpression.value = expression
      if (source === 'input')
        emit('input', expression)
      const result = updateValidation(expression)
      let nextExpression = expression
      if (result.status === 'valid' && result.expression) {
        const parsed = parseExpression(result.expression, mergedShowYear.value, locale.value)
        if (parsed) {
          fields.value = parsed
          if (source === 'editor') {
            nextExpression = result.expression
            draftExpression.value = nextExpression
          }
        }
      }
      if (nextExpression !== props.value) {
        emit('update:value', nextExpression)
        if (result.status === 'valid' && (previousValidation.status !== 'valid' || previousValidation.expression !== result.expression))
          emit('change', nextExpression)
      }
    }

    function handleExpressionInput(value: unknown) {
      if (editable.value)
        applyExpression(String(value ?? ''), 'input')
    }

    function applyFieldValue(field: CronFieldName, value: string) {
      if (!editable.value)
        return
      fields.value = updateField(fields.value, field, value)
      applyExpression(formatExpression(fields.value, mergedShowYear.value), 'editor')
    }

    function setFieldMode(mode: CronFieldMode) {
      const [min, max] = FIELD_LIMITS[activeField.value]
      const current = activeValue.value
      const fallback = current === '?' ? '*' : current
      const values: Record<CronFieldMode, string> = {
        every: '*',
        unspecified: '?',
        interval: `${fallback === '*' ? min : getNumericParts(fallback, min)[0]}/${Math.min(5, max - min + 1)}`,
        specified: String(min),
        range: `${min}-${Math.min(min + 1, max)}`,
      }
      applyFieldValue(activeField.value, values[mode])
    }

    function handleFieldTabKeydown(field: CronFieldName, event: KeyboardEvent) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
        return
      event.preventDefault()
      const index = displayedFields.value.indexOf(field)
      const offset = event.key === 'ArrowRight' ? 1 : -1
      activeField.value = displayedFields.value[(index + offset + displayedFields.value.length) % displayedFields.value.length]!
    }

    function getFieldDescriptionTemplate(field: CronFieldName, mode: CronFieldMode, type: 'editor' | 'preview') {
      return locale.value.fieldDescriptions?.[field]?.[mode]?.[type] ?? enUS.fieldDescriptions![field]?.[mode]?.[type] ?? ''
    }

    function getFieldDescriptionValues(field: CronFieldName, value: string) {
      const [min, max] = FIELD_LIMITS[field]
      const names = field === 'month' ? MONTH_VALUES : field === 'week' ? WEEK_VALUES : undefined
      const values = getNumericParts(value, min, names)
      const interval = Number(value.split('/')[1])
      const selectedValues = getSelectedValues(value, names)
        .map(item => formatDescriptionValue(field, item, locale.value))
        .join(locale.value.valueSeparator ?? ', ')
      return {
        start: formatDescriptionValue(field, String(values[0] ?? min), locale.value),
        end: formatDescriptionValue(field, String(values[1] ?? max), locale.value),
        step: Number.isFinite(interval) && interval > 0 ? interval : 1,
        values: selectedValues || formatDescriptionValue(field, String(min), locale.value),
      }
    }

    function getModeDescription(mode: CronFieldMode) {
      const field = activeField.value
      return formatCronMessage(getFieldDescriptionTemplate(field, mode, 'preview'), getFieldDescriptionValues(field, activeValue.value))
    }

    function renderEditorTemplate(template: string, slots: Record<string, any>) {
      return template.split(/(\{(?:start|step|end)\})/).filter(Boolean).map((part, index) => {
        const slot = slots[part.slice(1, -1)]
        return <span key={`${part}-${index}`}>{slot ?? part}</span>
      })
    }

    function renderSpecifiedSelect(field: CronFieldName, value: string, names?: string[]) {
      const [min, max] = FIELD_LIMITS[field]
      const optionValues = names ?? (field === 'year' ? [] : Array.from({ length: max - min + 1 }, (_, index) => String(index + min)))
      const options = optionValues.map(item => ({ value: item, label: formatFieldValue(field, item, locale.value) }))
      const mode = field === 'year' ? 'tags' : 'multiple'
      return (
        <Select
          mode={mode}
          value={getSelectedValues(value, names)}
          options={options}
          size={mergedSize.value}
          disabled={!editable.value}
          showSearch
          maxTagCount={3}
          tokenSeparators={field === 'year' ? [','] : undefined}
          class={`${prefixCls.value}-specific-select`}
          placeholder={formatCronMessage(locale.value.fieldValues, { field: locale.value.fields[field] })}
          aria-label={formatCronMessage(locale.value.fieldValues, { field: locale.value.fields[field] })}
          onUpdate:value={nextValue => applyFieldValue(field, Array.isArray(nextValue) ? nextValue.map(item => String(item)).join(',') : String(nextValue ?? ''))}
        />
      )
    }

    function renderFieldControls() {
      const field = activeField.value
      const [min, max] = FIELD_LIMITS[field]
      const value = activeValue.value
      const mode = activeMode.value
      const names = field === 'month' ? MONTH_VALUES : field === 'week' ? WEEK_VALUES : undefined
      const values = getNumericParts(value, min, names)
      const numberProps = { min, max, size: mergedSize.value, disabled: !editable.value, controls: false }
      const editorTemplate = getFieldDescriptionTemplate(field, mode, 'editor')
      if (mode === 'unspecified' || (mode === 'every' && (field === 'day' || field === 'week')))
        return formatCronMessage(editorTemplate, getFieldDescriptionValues(field, value))
      if (mode === 'every') {
        const interval = value.startsWith('*/') ? Number(value.slice(2)) : 1
        return renderEditorTemplate(editorTemplate, {
          step: <InputNumber {...numberProps} min={1} max={max - min + 1} value={Number.isFinite(interval) && interval > 0 ? interval : 1} aria-label={formatCronMessage(locale.value.fieldInterval, { field: locale.value.fields[field] })} onUpdate:value={nextValue => applyFieldValue(field, Number(nextValue ?? 1) === 1 ? '*' : `*/${nextValue ?? 1}`)} />,
        })
      }
      if (mode === 'interval') {
        return renderEditorTemplate(editorTemplate, {
          start: <InputNumber {...numberProps} value={values[0]} aria-label={formatCronMessage(locale.value.fieldStart, { field: locale.value.fields[field] })} onUpdate:value={nextValue => applyFieldValue(field, `${nextValue ?? min}/${values[1] ?? 1}`)} />,
          step: <InputNumber {...numberProps} min={1} max={max - min + 1} value={values[1] ?? 1} aria-label={formatCronMessage(locale.value.fieldInterval, { field: locale.value.fields[field] })} onUpdate:value={nextValue => applyFieldValue(field, `${values[0] ?? min}/${nextValue ?? 1}`)} />,
        })
      }
      if (mode === 'range') {
        return renderEditorTemplate(editorTemplate, {
          start: <InputNumber {...numberProps} value={values[0]} aria-label={formatCronMessage(locale.value.fieldRangeStart, { field: locale.value.fields[field] })} onUpdate:value={nextValue => applyFieldValue(field, `${nextValue ?? min}-${values[1] ?? max}`)} />,
          end: <InputNumber {...numberProps} value={values[1] ?? max} aria-label={formatCronMessage(locale.value.fieldRangeEnd, { field: locale.value.fields[field] })} onUpdate:value={nextValue => applyFieldValue(field, `${values[0] ?? min}-${nextValue ?? max}`)} />,
        })
      }
      if (mode === 'specified') {
        return (
          <>
            {formatCronMessage(editorTemplate, getFieldDescriptionValues(field, value))}
            {renderSpecifiedSelect(field, value, names)}
          </>
        )
      }
      return <Input value={value} size={mergedSize.value} disabled={!editable.value} aria-label={formatCronMessage(locale.value.fieldValues, { field: locale.value.fields[field] })} onUpdate:value={nextValue => applyFieldValue(field, String(nextValue ?? ''))} />
    }

    watch([() => props.value, mergedShowYear, locale], ([value, showYear]) => {
      const expression = value ?? ''
      draftExpression.value = expression
      const result = updateValidation(expression)
      fields.value = (result.status === 'valid' ? parseExpression(expression, showYear, locale.value) : undefined) ?? createDefaultFields(showYear)
      if (!showYear && activeField.value === 'year')
        activeField.value = 'minute'
    }, { immediate: true })

    return () => (
      <div class={rootClassName.value} style={rootStyle.value} data-size={mergedSize.value} data-disabled={mergedDisabled.value ? 'true' : 'false'} data-readonly={mergedReadonly.value ? 'true' : 'false'} data-status={mergedStatus.value || undefined} aria-readonly={mergedReadonly.value || undefined} {...omitClassAndStyle(attrs as Record<string, any>)}>
        <Input value={draftExpression.value} size={mergedSize.value} readonly={mergedReadonly.value} disabled={mergedDisabled.value} class={mergedClassNames.value.input} style={mergedStyles.value.input} aria-label={locale.value.expression} onUpdate:value={handleExpressionInput} />
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
                  role="tab"
                  class={clsx(`${prefixCls.value}-field-tab`, `${prefixCls.value}-field-tab-label`, { [`${prefixCls.value}-field-tab-active`]: active })}
                  data-field={field}
                  aria-selected={active}
                  aria-controls={panelId}
                  aria-disabled={mergedDisabled.value || undefined}
                  tabindex={mergedDisabled.value || !active ? -1 : 0}
                  onClick={() => {
                    if (!mergedDisabled.value)
                      activeField.value = field
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
                  <div class={`${prefixCls.value}-controls`}>{renderFieldControls()}</div>
                  <div class={`${prefixCls.value}-field-control-summary`}>{getModeDescription(activeMode.value)}</div>
                </>
              )}
            </div>
          </div>
        </div>
        {mergedPresets.value.length > 0 && <div class={clsx(`${prefixCls.value}-presets`, mergedClassNames.value.presets)} style={mergedStyles.value.presets}>{slots.presets?.() ?? mergedPresets.value.map(preset => <Button key={preset.value} size="small" disabled={!editable.value} onClick={() => applyExpression(preset.value, 'editor')}>{preset.label}</Button>)}</div>}
        {preview.value && (
          <div class={clsx(`${prefixCls.value}-preview`, mergedClassNames.value.preview)} style={mergedStyles.value.preview}>
            {slots.preview?.(preview.value) ?? (
              <>
                <span>{preview.value.description}</span>
                {preview.value.nextRuns?.length
                  ? <ul class={`${prefixCls.value}-preview-list`}>{preview.value.nextRuns.map(run => <li key={run.getTime()}>{formatCronMessage(locale.value.nextRun, { value: dayjs(run).locale(localeCode.value).format(dateTimeFormat.value) })}</li>)}</ul>
                  : <span>{locale.value.noFutureRun}</span>}
              </>
            )}
          </div>
        )}
        {validation.value.status === 'invalid' && <div class={clsx(`${prefixCls.value}-error`, mergedClassNames.value.error)} style={mergedStyles.value.error} role="alert">{slots.error?.(validation.value) ?? validation.value.errors?.map(error => error.message).join('; ') ?? locale.value.validation.invalidExpression}</div>}
      </div>
    )
  },
  { name: 'ACron', inheritAttrs: false },
)

;(Cron as any).install = (app: App) => app.component(Cron.name, Cron)

export type { CronClassNamesType, CronConfig, CronEmits, CronError, CronFieldDescriptions, CronFieldMode, CronFieldModeDescription, CronFieldName, CronFields, CronFieldSlotProps, CronLocale, CronPreset, CronPreviewResult, CronProps, CronSemanticClassNames, CronSemanticName, CronSemanticStyles, CronSize, CronSlots, CronStatus, CronStylesType, CronValidateResult, CronValidateStatus } from './types'
export default Cron
export { Cron }
export { validateExpression as validateCronExpression } from './utils'
