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
import { Button, Input, InputNumber, Segmented, Select } from 'antdv-next'
import { useBaseConfig } from 'antdv-next/config-provider/context'
import useCSSVarCls from 'antdv-next/config-provider/hooks/useCSSVarCls'
import { useLocaleContext } from 'antdv-next/locale/index'
import dayjs from 'dayjs'
import { computed, defineComponent, ref, watch } from 'vue'
import { useMergeSemantic } from '../_util/semantic'
import { useProComponentConfig } from '../config-provider'
import enUS from './locale/en_US'
import zhCN from './locale/zh_CN'
import zhTW from './locale/zh_TW'
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

const FIELD_LIMITS: Record<CronFieldName, readonly [number, number]> = {
  second: [0, 59],
  minute: [0, 59],
  hour: [0, 23],
  day: [1, 31],
  month: [1, 12],
  week: [1, 7],
  year: [1, 9999],
}

const MONTH_OPTIONS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map(value => ({ label: value, value }))
const WEEK_OPTIONS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(value => ({ label: value, value }))
const MODE_VALUES: CronFieldMode[] = ['every', 'interval', 'specified', 'range', 'list']

function getDefaultLocale(localeCode?: string): CronLocale {
  const normalizedLocaleCode = localeCode?.toLowerCase().replace('_', '-')
  if (normalizedLocaleCode === 'zh-cn')
    return zhCN
  if (normalizedLocaleCode === 'zh-hk' || normalizedLocaleCode === 'zh-tw')
    return zhTW
  return enUS
}

function omitClassAndStyle(attrs: Record<string, any>) {
  const nextAttrs = { ...attrs }
  delete nextAttrs.class
  delete nextAttrs.style
  return nextAttrs
}

function getNumericParts(value: string, fallback: number): number[] {
  return value.split(/[,/\-]/).map(item => Number(item)).filter(Number.isFinite).concat(fallback)
}

function getNamedValues(value: string) {
  return value.split(',').filter(item => /^[A-Z]{3}$/.test(item))
}

const Cron = defineComponent<CronProps, CronEmits, string, SlotsType<CronSlots>>(
  (props, { attrs, emit, slots }) => {
    const { prefixCls, direction } = useBaseConfig('cron', props)
    const localeContext = useLocaleContext()
    const proConfig = useProComponentConfig('cron')
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)
    const mergedShowYear = computed(() => props.showYear ?? proConfig.value.showYear ?? false)
    const mergedDisabled = computed(() => props.disabled ?? proConfig.value.disabled ?? false)
    const mergedReadonly = computed(() => props.readonly ?? proConfig.value.readonly ?? false)
    const mergedSize = computed(() => props.size ?? proConfig.value.size ?? 'medium')
    const mergedPreview = computed(() => props.preview ?? proConfig.value.preview ?? false)
    const mergedPresets = computed(() => props.presets ?? proConfig.value.presets ?? [])
    const localeCode = computed(() => localeContext.locale.value?.locale ?? 'en')
    const locale = computed<CronLocale>(() => ({
      ...getDefaultLocale(localeCode.value),
      ...((localeContext.locale.value as ProLocale | undefined)?.Cron ?? {}),
    }))
    const dateTimeFormat = computed(() => {
      const pickerLocale = localeContext.locale.value?.DatePicker?.lang
      return pickerLocale?.fieldDateTimeFormat ?? pickerLocale?.dateTimeFormat ?? 'YYYY-MM-DD HH:mm:ss'
    })
    const modeOptions = computed(() => MODE_VALUES.map(value => ({ label: locale.value.modes[value], value })))
    const editable = computed(() => !mergedDisabled.value && !mergedReadonly.value)
    const draftExpression = ref(props.value ?? '')
    const fields = ref<CronFields>(createDefaultFields(mergedShowYear.value))
    const activeField = ref<CronFieldName>('minute')
    const validation = ref<CronValidateResult>({ status: draftExpression.value ? 'invalid' : 'empty' })

    const mergedSemanticProps = computed<CronProps>(() => ({
      ...props,
      showYear: mergedShowYear.value,
      disabled: mergedDisabled.value,
      readonly: mergedReadonly.value,
      size: mergedSize.value,
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
    const activeValue = computed(() => fields.value[activeField.value] ?? '')
    const activeMode = computed(() => getFieldMode(activeValue.value))
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
      draftExpression.value = expression
      if (source === 'input')
        emit('input', expression)
      const result = updateValidation(expression)
      if (result.status !== 'valid' || !result.expression)
        return
      const parsed = parseExpression(result.expression, mergedShowYear.value, locale.value)
      if (!parsed)
        return
      fields.value = parsed
      draftExpression.value = result.expression
      if (result.expression !== props.value) {
        emit('update:value', result.expression)
        emit('change', result.expression)
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
        every: activeField.value === 'day' || activeField.value === 'week' ? (current === '?' ? '?' : '*') : '*',
        interval: `${fallback === '*' ? min : getNumericParts(fallback, min)[0]}/${Math.min(5, max - min + 1)}`,
        specified: String(min),
        range: `${min}-${Math.min(min + 1, max)}`,
        list: `${min},${Math.min(min + 1, max)}`,
      }
      applyFieldValue(activeField.value, values[mode])
    }

    function renderFieldControls() {
      const field = activeField.value
      const [min, max] = FIELD_LIMITS[field]
      const value = activeValue.value
      const mode = activeMode.value
      const values = getNumericParts(value, min)
      const numberProps = { min, max, size: mergedSize.value, disabled: !editable.value, controls: false }
      if (mode === 'every') {
        if (field === 'day' || field === 'week') {
          return <Segmented options={[{ label: locale.value.any, value: '*' }, { label: locale.value.notSpecified, value: '?' }]} value={value} disabled={!editable.value} onUpdate:value={nextValue => applyFieldValue(field, String(nextValue))} />
        }
        return <span>{formatCronMessage(locale.value.everyField, { field: locale.value.fields[field] })}</span>
      }
      if (mode === 'interval') {
        return (
          <>
            <InputNumber {...numberProps} value={values[0]} aria-label={formatCronMessage(locale.value.fieldStart, { field: locale.value.fields[field] })} onUpdate:value={nextValue => applyFieldValue(field, `${nextValue ?? min}/${values[1] ?? 1}`)} />
            <span>{locale.value.every}</span>
            <InputNumber {...numberProps} min={1} max={max - min + 1} value={values[1] ?? 1} aria-label={formatCronMessage(locale.value.fieldInterval, { field: locale.value.fields[field] })} onUpdate:value={nextValue => applyFieldValue(field, `${values[0] ?? min}/${nextValue ?? 1}`)} />
          </>
        )
      }
      if (mode === 'range') {
        return (
          <>
            <InputNumber {...numberProps} value={values[0]} aria-label={formatCronMessage(locale.value.fieldRangeStart, { field: locale.value.fields[field] })} onUpdate:value={nextValue => applyFieldValue(field, `${nextValue ?? min}-${values[1] ?? max}`)} />
            <span>{locale.value.to}</span>
            <InputNumber {...numberProps} value={values[1] ?? max} aria-label={formatCronMessage(locale.value.fieldRangeEnd, { field: locale.value.fields[field] })} onUpdate:value={nextValue => applyFieldValue(field, `${values[0] ?? min}-${nextValue ?? max}`)} />
          </>
        )
      }
      if (mode === 'specified' && (field === 'month' || field === 'week')) {
        return <Select mode="multiple" value={getNamedValues(value)} options={field === 'month' ? MONTH_OPTIONS : WEEK_OPTIONS} size={mergedSize.value} disabled={!editable.value} aria-label={formatCronMessage(locale.value.fieldValues, { field: locale.value.fields[field] })} onUpdate:value={nextValue => applyFieldValue(field, Array.isArray(nextValue) ? nextValue.join(',') : String(nextValue ?? ''))} />
      }
      if (mode === 'specified') {
        return <InputNumber {...numberProps} value={values[0]} aria-label={formatCronMessage(locale.value.fieldValue, { field: locale.value.fields[field] })} onUpdate:value={nextValue => applyFieldValue(field, String(nextValue ?? min))} />
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
      <div class={rootClassName.value} style={rootStyle.value} data-size={mergedSize.value} data-disabled={mergedDisabled.value ? 'true' : 'false'} data-readonly={mergedReadonly.value ? 'true' : 'false'} aria-readonly={mergedReadonly.value || undefined} {...omitClassAndStyle(attrs as Record<string, any>)}>
        <Input value={draftExpression.value} size={mergedSize.value} readonly={mergedReadonly.value} disabled={mergedDisabled.value} status={validation.value.status === 'invalid' ? 'error' : undefined} class={mergedClassNames.value.input} style={mergedStyles.value.input} aria-label={locale.value.expression} onUpdate:value={handleExpressionInput} />
        <div class={clsx(`${prefixCls.value}-fields`, mergedClassNames.value.fields)} style={mergedStyles.value.fields}>
          <div class={`${prefixCls.value}-field-tabs`} role="tablist" aria-label={locale.value.fieldList}>
            {displayedFields.value.map(field => <Button key={field} type="text" size="small" disabled={mergedDisabled.value} class={clsx(`${prefixCls.value}-field-tab`, { [`${prefixCls.value}-field-tab-active`]: activeField.value === field })} data-field={field} aria-selected={activeField.value === field} onClick={() => (activeField.value = field)}>{locale.value.fields[field]}</Button>)}
          </div>
          <div class={clsx(`${prefixCls.value}-field`, mergedClassNames.value.field)} style={mergedStyles.value.field} data-field={activeField.value} data-mode={activeMode.value} data-disabled={mergedDisabled.value ? 'true' : 'false'} data-invalid={validation.value.status === 'invalid' ? 'true' : 'false'}>
            {slots.field?.({ field: activeField.value, value: activeValue.value, disabled: mergedDisabled.value, readonly: mergedReadonly.value }) ?? (
              <>
                <Segmented options={modeOptions.value} value={activeMode.value} size={mergedSize.value} disabled={!editable.value} onUpdate:value={nextValue => setFieldMode(nextValue as CronFieldMode)} />
                <div class={`${prefixCls.value}-controls`}>{renderFieldControls()}</div>
              </>
            )}
          </div>
        </div>
        {mergedPresets.value.length > 0 && <div class={clsx(`${prefixCls.value}-presets`, mergedClassNames.value.presets)} style={mergedStyles.value.presets}>{slots.presets?.() ?? mergedPresets.value.map(preset => <Button key={preset.value} size="small" disabled={!editable.value} onClick={() => applyExpression(preset.value, 'editor')}>{preset.label}</Button>)}</div>}
        {preview.value && (
          <div class={clsx(`${prefixCls.value}-preview`, mergedClassNames.value.preview)} style={mergedStyles.value.preview}>
            {slots.preview?.(preview.value) ?? (
              <>
                <span>{preview.value.description}</span>
                <span>{preview.value.nextRunAt ? formatCronMessage(locale.value.nextRun, { value: dayjs(preview.value.nextRunAt).locale(localeCode.value).format(dateTimeFormat.value) }) : locale.value.noFutureRun}</span>
              </>
            )}
          </div>
        )}
        {validation.value.status !== 'valid' && <div class={clsx(`${prefixCls.value}-error`, mergedClassNames.value.error)} style={mergedStyles.value.error} role="alert">{slots.error?.(validation.value) ?? validation.value.errors?.map(error => error.message).join('; ') ?? locale.value.required}</div>}
      </div>
    )
  },
  { name: 'ACron', inheritAttrs: false },
)

;(Cron as any).install = (app: App) => app.component(Cron.name, Cron)

export type { CronClassNamesType, CronConfig, CronEmits, CronError, CronFieldMode, CronFieldName, CronFields, CronFieldSlotProps, CronLocale, CronPreset, CronPreviewResult, CronProps, CronSemanticClassNames, CronSemanticName, CronSemanticStyles, CronSize, CronSlots, CronStylesType, CronValidateResult, CronValidateStatus } from './types'
export default Cron
export { Cron }
