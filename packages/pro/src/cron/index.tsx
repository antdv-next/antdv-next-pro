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
import { Button, Input, InputNumber, RadioGroup, Segmented, Select, useConfig } from 'antdv-next'
import { useBaseConfig } from 'antdv-next/config-provider/context'
import useCSSVarCls from 'antdv-next/config-provider/hooks/useCSSVarCls'
import { useFormItemInputContext, useFormItemInputContextProvider } from 'antdv-next/dist/form/context'
import { useLocaleContext } from 'antdv-next/locale/index'
import dayjs from 'dayjs'
import { computed, defineComponent, ref, watch } from 'vue'
import { useMergeSemantic } from '../_util/semantic'
import { useProComponentConfig } from '../config-provider'
import enUSLocale from '../locale/en_US'
import {
  createDefaultFields,
  getFieldLimits,
  getFieldNames,
  getWeekAliases,
  MONTH_VALUES,
  WEEK_VALUES,
  weekNumberToName,
} from './format'
import { parseSpecial, serializeSpecial } from './special'
import useStyle from './style'
import {
  describeField,
  formatCronMessage,
  formatExpression,
  getFieldMode,
  getPreview,
  parseExpression,
  updateField,
  validateExpression,
} from './utils'

let cronIdSeed = 0

const MODE_VALUES: CronEditorMode[] = ['every', 'interval', 'specified', 'range']
const enUS = enUSLocale.Cron!

function omitClassAndStyle(attrs: Record<string, any>) {
  const nextAttrs = { ...attrs }
  delete nextAttrs.class
  delete nextAttrs.style
  return nextAttrs
}

function getNumericParts(value: string, fallback: number, names?: readonly string[], format: CronFormat = 'quartz', field?: CronFieldName): number[] {
  return value.split(/[,/\-]/).map((item) => {
    const normalized = item.toUpperCase()
    if (field === 'week') {
      const aliases = getWeekAliases(format)
      if (normalized in aliases)
        return aliases[normalized]!
    }
    const aliasIndex = names ? (names as readonly string[]).indexOf(normalized) : -1
    return aliasIndex >= 0 ? aliasIndex + 1 : Number(item)
  }).filter(Number.isFinite).concat(fallback)
}

function getSelectedValues(value: string, names?: readonly string[], format: CronFormat = 'quartz', field?: CronFieldName): string[] {
  if (!value || value === '*' || value === '?')
    return []
  return value.split(',').flatMap(item => item.split('/')[0]!.split('-')).map((item) => {
    const normalized = item.trim().toUpperCase()
    if (names?.includes(normalized as never))
      return normalized
    const numeric = Number(normalized)
    if (Number.isInteger(numeric) && field === 'week')
      return weekNumberToName(numeric, format) ?? normalized
    if (Number.isInteger(numeric))
      return names?.[numeric - 1] ?? normalized
    return normalized
  }).filter(Boolean)
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
    const fields = ref<CronFields>(createDefaultFields(cronOptions.value))
    const activeField = ref<CronFieldName>('minute')
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
      if (mode === 'interval' && activeValue.value.startsWith('*/') && activeField.value !== 'day' && activeField.value !== 'week')
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
      ? getPreview(draftExpression.value, cronOptions.value, locale.value)
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

    function applyExpression(expression: string, source: 'input' | 'editor') {
      const previousValidation = validation.value
      draftExpression.value = expression
      if (source === 'input')
        emit('input', expression)
      const result = updateValidation(expression)
      let nextExpression = expression
      if (result.status === 'valid' && result.expression) {
        const parsed = parseExpression(result.expression, cronOptions.value, locale.value)
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
      fields.value = updateField(fields.value, field, value, cronOptions.value)
      applyExpression(formatExpression(fields.value, cronOptions.value), 'editor')
    }

    function setFieldMode(mode: CronFieldMode) {
      const [min, max] = fieldLimits.value[activeField.value]
      const current = activeValue.value
      const fallback = current === '?' ? '*' : current
      const names = activeField.value === 'month' ? MONTH_VALUES : activeField.value === 'week' ? WEEK_VALUES : undefined
      const values: Record<CronFieldMode, string> = {
        every: '*',
        unspecified: '?',
        interval: `${fallback === '*' ? min : getNumericParts(fallback, min, names, mergedFormat.value, activeField.value)[0]}/${Math.min(5, max - min + 1)}`,
        specified: names?.[0] ?? String(min),
        range: `${min}-${Math.min(min + 1, max)}`,
        special: activeField.value === 'week' ? '6#1' : 'L',
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
      const [min, max] = fieldLimits.value[field]
      const names = field === 'month' ? MONTH_VALUES : field === 'week' ? WEEK_VALUES : undefined
      const values = getNumericParts(value, min, names, mergedFormat.value, field)
      const interval = Number(value.split('/')[1])
      const selectedValues = getSelectedValues(value, names, mergedFormat.value, field)
        .map(item => formatNamedValue(field, item, locale.value, mergedFormat.value))
        .join(locale.value.valueSeparator ?? ', ')
      return {
        start: formatNamedValue(field, String(values[0] ?? min), locale.value, mergedFormat.value),
        end: formatNamedValue(field, String(values[1] ?? max), locale.value, mergedFormat.value),
        step: Number.isFinite(interval) && interval > 0 ? interval : 1,
        values: selectedValues || formatNamedValue(field, String(min), locale.value, mergedFormat.value),
      }
    }

    function getModeDescription(mode: CronFieldMode) {
      const field = activeField.value
      if (mode === 'special')
        return describeField(field, activeValue.value, locale.value, 'preview', mergedFormat.value)
      return formatCronMessage(getFieldDescriptionTemplate(field, mode, 'preview'), getFieldDescriptionValues(field, activeValue.value))
    }

    function renderEditorTemplate(template: string, slots: Record<string, any>) {
      return template.split(/(\{(?:start|step|end)\})/).filter(Boolean).map((part, index) => {
        const slot = slots[part.slice(1, -1)]
        return <span key={`${part}-${index}`}>{slot ?? part}</span>
      })
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
          maxTagCount={3}
          tokenSeparators={field === 'year' ? [','] : undefined}
          class={`${prefixCls.value}-specific-select`}
          placeholder={formatCronMessage(locale.value.fieldValues, { field: locale.value.fields[field] })}
          aria-label={formatCronMessage(locale.value.fieldValues, { field: locale.value.fields[field] })}
          onUpdate:value={nextValue => applyFieldValue(field, Array.isArray(nextValue) ? nextValue.map(item => String(item)).join(',') : String(nextValue ?? ''))}
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
            {current.type === 'nearestWeekday' && (
              <InputNumber
                min={1}
                max={31}
                value={current.day}
                size={mergedSize.value}
                disabled={!editable.value}
                controls={false}
                aria-label={locale.value.specialNearestWeekday}
                onUpdate:value={nextValue => applySpecial({ type: 'nearestWeekday', day: Number(nextValue ?? 15) })}
              />
            )}
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
          {current.type === 'nthDayOfWeek' && (
            <InputNumber
              min={1}
              max={5}
              value={current.nth}
              size={mergedSize.value}
              disabled={!editable.value}
              controls={false}
              aria-label={locale.value.specialNth}
              onUpdate:value={nextValue => applySpecial({ type: 'nthDayOfWeek', week: current.week, nth: Number(nextValue ?? 1) })}
            />
          )}
        </div>
      )
    }

    function renderFieldControls() {
      const field = activeField.value
      const [min, max] = fieldLimits.value[field]
      const value = activeValue.value
      const mode = activeMode.value
      const names = field === 'month' ? MONTH_VALUES : field === 'week' ? WEEK_VALUES : undefined
      const values = getNumericParts(value, min, names, mergedFormat.value, field)
      const numberProps = { min, max, size: mergedSize.value, disabled: !editable.value, controls: false }
      const editorTemplate = getFieldDescriptionTemplate(field, mode, 'editor')
      if (mode === 'special' && (field === 'day' || field === 'week'))
        return renderSpecialControls(field)
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

    watch([() => props.value, mergedShowYear, mergedFormat, locale], ([value]) => {
      const expression = value ?? ''
      draftExpression.value = expression
      const result = updateValidation(expression)
      fields.value = (result.status === 'valid' ? parseExpression(expression, cronOptions.value, locale.value) : undefined) ?? createDefaultFields(cronOptions.value)
      if (!displayedFields.value.includes(activeField.value))
        activeField.value = 'minute'
    }, { immediate: true })

    return () => (
      <div class={rootClassName.value} style={rootStyle.value} data-size={mergedSize.value} data-format={mergedFormat.value} data-disabled={mergedDisabled.value ? 'true' : 'false'} data-readonly={mergedReadonly.value ? 'true' : 'false'} data-status={mergedStatus.value || undefined} aria-readonly={mergedReadonly.value || undefined} {...omitClassAndStyle(attrs as Record<string, any>)}>
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
  {
    name: 'ACron',
    inheritAttrs: false,
    props: {
      prefixCls: String,
      rootClass: String,
      value: String,
      format: String,
      showYear: { type: Boolean, default: undefined },
      disabled: { type: Boolean, default: undefined },
      readonly: { type: Boolean, default: undefined },
      size: String,
      status: String,
      preview: { type: Boolean, default: undefined },
      presets: Array,
      classes: [Object, Function],
      styles: [Object, Function],
    },
  },
)

;(Cron as any).install = (app: App) => app.component(Cron.name, Cron)

export type { CronClassNamesType, CronConfig, CronEditorMode, CronEmits, CronError, CronFieldDescriptions, CronFieldMode, CronFieldModeDescription, CronFieldName, CronFields, CronFieldSlotProps, CronFormat, CronLocale, CronOptions, CronPreset, CronPreviewResult, CronProps, CronSemanticClassNames, CronSemanticName, CronSemanticStyles, CronSize, CronSlots, CronStatus, CronStylesType, CronValidateResult, CronValidateStatus } from './types'
export default Cron
export { Cron }
export { validateExpression as validateCronExpression } from './utils'
