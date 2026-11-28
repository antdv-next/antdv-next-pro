import type { App, CSSProperties, SlotsType } from 'vue'
import type { CodeLocale, ProLocale } from '../locale/types'
import type { HighlightSource } from './hooks/useHighlight'
import type {
  CodeClassNamesType,
  CodeCopyConfig,
  CodeEmits,
  CodeExtraInfo,
  CodeNode,
  CodeProps,
  CodeSemanticClassNames,
  CodeSemanticStyles,
  CodeSlots,
  CodeStylesType,
  CodeToken,
} from './types'
import type { CodeLine } from './utils/diff'
import { CheckOutlined, CopyOutlined } from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { Button, theme, Tooltip } from 'antdv-next'
import { useBaseConfig } from 'antdv-next/config-provider/context'
import useCSSVarCls from 'antdv-next/config-provider/hooks/useCSSVarCls'
import { useLocaleContext } from 'antdv-next/locale/index'
import { computed, defineComponent, h, onBeforeUnmount, shallowRef } from 'vue'
import { copyToClipboard, devUseWarning, getSlotPropsFnRun } from '../_util'
import { useMergeSemantic } from '../_util/semantic'
import { useProComponentConfig } from '../config-provider'
import enUSLocale from '../locale/en_US'
import { useHighlight } from './hooks/useHighlight'
import useStyle from './style'
import { getCopyText } from './utils/copy'
import { parseDiff, parsePlain } from './utils/diff'
import { isDarkColor } from './utils/luminance'

const COPIED_DURATION = 3000

const enUSCode = enUSLocale.Code!
const enUSText = enUSLocale.Text!

function omitClassAndStyle(attrs: Record<string, any>) {
  const nextAttrs = { ...attrs }
  delete nextAttrs.class
  delete nextAttrs.style
  return nextAttrs
}

function toPair<T>(value: T | [T, T] | undefined): [T | undefined, T | undefined] {
  return Array.isArray(value) ? [value[0], value[1]] : [value, value]
}

/**
 * 取自定义节点；没有提供（`undefined` / `null` / `true`）时用默认节点。
 */
function resolveNode(node: CodeNode | (() => CodeNode), fallback: CodeNode): CodeNode {
  const resolved = typeof node === 'function' ? (node as () => CodeNode)() : node
  return resolved === undefined || resolved === null || resolved === true ? fallback : resolved
}

function getTokenStyle(token: CodeToken): CSSProperties | undefined {
  const style: Record<string, string> = {}
  if (token.color)
    style['--ant-code-c'] = token.color
  if (token.darkColor)
    style['--ant-code-c-dark'] = token.darkColor
  if (token.italic)
    style.fontStyle = 'italic'
  if (token.bold)
    style.fontWeight = 'bold'
  if (token.underline)
    style.textDecoration = 'underline'
  return Object.keys(style).length ? style as CSSProperties : undefined
}

const MARKERS = {
  normal: ' ',
  added: '+',
  removed: '-',
} as const

const Code = defineComponent<
  CodeProps,
  CodeEmits,
  string,
  SlotsType<CodeSlots>
>(
  (props, { attrs, slots, emit, expose }) => {
    const { prefixCls, direction } = useBaseConfig('code', props)
    const proConfig = useProComponentConfig('code')
    const localeContext = useLocaleContext()
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)
    const { token } = theme.useToken()
    const warning = devUseWarning('Code')
    const rootRef = shallowRef<HTMLElement | null>(null)

    const mergedLanguage = computed(() => props.language || 'text')
    const mergedShowLineNumbers = computed(() => props.showLineNumbers ?? proConfig.value.showLineNumbers ?? false)
    const mergedWordWrap = computed(() => props.wordWrap ?? proConfig.value.wordWrap ?? false)
    const mergedCopyable = computed(() => props.copyable ?? proConfig.value.copyable ?? false)
    const mergedTheme = computed(() => props.theme ?? proConfig.value.theme ?? 'auto')
    const mergedHighlighter = computed(() => props.highlighter ?? proConfig.value.highlighter)
    const copyConfig = computed<CodeCopyConfig>(() => (
      typeof mergedCopyable.value === 'object' && mergedCopyable.value ? mergedCopyable.value : {}
    ))

    // 不读 `.dark` / `[data-theme]` 这类全局选择器：antdv-next 没有暗色标志位，按容器背景的亮度判断。
    const isDark = computed(() => {
      if (mergedTheme.value === 'auto')
        return isDarkColor(token.value.colorBgContainer)
      return mergedTheme.value === 'dark'
    })

    const localeText = computed<CodeLocale>(() => ({
      ...enUSCode,
      ...((localeContext.locale.value as ProLocale | undefined)?.Code ?? {}),
    }))
    const copyLocale = computed(() => ({
      copy: localeContext.locale.value?.Text?.copy ?? enUSText.copy,
      copied: localeContext.locale.value?.Text?.copied ?? enUSText.copied,
    }))

    // Diff 解析是同步、确定性的，服务端和客户端首帧结果一致。
    const parsed = computed(() => {
      const content = props.content ?? ''
      if (!props.diff)
        return { diff: false, ...parsePlain(content), error: undefined }

      const result = parseDiff(content)
      if (result.ok)
        return { diff: true, lines: result.lines, trailingNewline: result.trailingNewline, error: undefined }
      // 非法前缀：整段回退为原始纯文本，不做部分解析。
      return { diff: false, ...parsePlain(content), error: result.error }
    })

    const highlightSource = computed<HighlightSource>(() => ({
      lines: parsed.value.lines,
      parseError: parsed.value.error,
    }))

    let warnedMissingHighlighter = false
    const highlighted = useHighlight({
      source: highlightSource,
      language: mergedLanguage,
      highlighter: mergedHighlighter,
      onHighlight: info => emit('highlight', info),
      onError: info => emit('error', info),
      onMissingHighlighter: (language) => {
        if (warnedMissingHighlighter)
          return
        warnedMissingHighlighter = true
        warning(
          false,
          'usage',
          `\`language="${language}"\` is set but no \`highlighter\` is provided, so the code is rendered as plain text. Pass one through the \`highlighter\` prop or \`ProConfigProvider\`.`,
        )
      },
    })

    const copied = shallowRef(false)
    let copiedTimer: ReturnType<typeof setTimeout> | null = null
    function clearCopiedTimer() {
      if (copiedTimer) {
        clearTimeout(copiedTimer)
        copiedTimer = null
      }
    }
    let unmounted = false
    onBeforeUnmount(() => {
      unmounted = true
      clearCopiedTimer()
    })

    async function copy() {
      let text: string
      try {
        const customText = copyConfig.value.text
        if (typeof customText === 'function') {
          text = await customText()
        }
        else if (customText !== undefined) {
          text = customText
        }
        else {
          text = getCopyText({
            content: props.content ?? '',
            diffLines: parsed.value.diff ? parsed.value.lines : undefined,
            trailingNewline: parsed.value.trailingNewline,
          })
        }
        text = String(text ?? '')
        if (!await copyToClipboard(text))
          throw new Error('[Code] Failed to write to the clipboard.')
      }
      catch (error) {
        if (!unmounted)
          emit('error', { stage: 'copy', error: error instanceof Error ? error : new Error(String(error)) })
        return
      }

      // 写剪贴板是异步的，期间组件可能已经卸载：不再更新状态、不触发事件。
      if (unmounted)
        return

      copied.value = true
      clearCopiedTimer()
      copiedTimer = setTimeout(() => {
        copied.value = false
        copiedTimer = null
      }, COPIED_DURATION)
      emit('copy', { text })
    }

    const mergedSemanticProps = computed<CodeProps>(() => ({
      ...props,
      language: mergedLanguage.value,
      showLineNumbers: mergedShowLineNumbers.value,
      wordWrap: mergedWordWrap.value,
      copyable: mergedCopyable.value,
      theme: mergedTheme.value,
      highlighter: mergedHighlighter.value,
    }))
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      CodeSemanticClassNames,
      CodeSemanticStyles,
      CodeProps
    >(
      computed(() => [proConfig.value.classes as CodeClassNamesType | undefined, props.classes]),
      computed(() => [proConfig.value.styles as CodeStylesType | undefined, props.styles]),
      computed(() => ({ props: mergedSemanticProps.value })),
    )

    const mergedClassName = computed(() => clsx(
      prefixCls.value,
      hashId.value,
      cssVarCls.value,
      rootCls.value,
      {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-dark`]: isDark.value,
        [`${prefixCls.value}-word-wrap`]: mergedWordWrap.value,
        [`${prefixCls.value}-diff`]: parsed.value.diff,
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

    expose({
      copy,
      get nativeElement() {
        return rootRef.value
      },
    })

    function renderCopyButton() {
      const prefix = prefixCls.value
      const config = copyConfig.value
      const [copyIcon, copiedIcon] = toPair(config.icon)
      const tooltips = config.tooltips
      const systemText = copied.value ? copyLocale.value.copied : copyLocale.value.copy
      const title = tooltips === false
        ? null
        : resolveNode(tooltips?.[copied.value ? 1 : 0], systemText)
      const icon = copied.value
        ? resolveNode(copiedIcon, <CheckOutlined />)
        : resolveNode(copyIcon, <CopyOutlined />)

      const button = (
        <Button
          type="text"
          size="small"
          class={clsx(`${prefix}-copy`, { [`${prefix}-copy-success`]: copied.value }, mergedClassNames.value.copy)}
          style={mergedStyles.value.copy}
          {...{
            'aria-label': typeof title === 'string' ? title : systemText,
            'tabindex': config.tabIndex,
          } as Record<string, any>}
          onClick={copy}
          v-slots={{ icon: () => icon }}
        />
      )

      return tooltips === false
        ? button
        : <Tooltip title={title as any}>{button}</Tooltip>
    }

    function renderLine(line: CodeLine, index: number) {
      const prefix = prefixCls.value
      const classNames = mergedClassNames.value
      const styles = mergedStyles.value
      const isDiff = parsed.value.diff
      // 只复用源码没变的行的 token：内容变了而新结果还没回来时，这一行先显示纯文本，不显示旧内容。
      const cached = highlighted.value?.[index]
      const tokens = cached && cached.content === line.content ? cached.tokens : null

      const numberCls = clsx(`${prefix}-line-number`, classNames.lineNumber)
      const srText = line.type === 'added'
        ? localeText.value.added
        : line.type === 'removed'
          ? localeText.value.removed
          : null

      return (
        <span
          key={index}
          class={clsx(
            `${prefix}-line`,
            {
              [`${prefix}-line-added`]: isDiff && line.type === 'added',
              [`${prefix}-line-removed`]: isDiff && line.type === 'removed',
            },
            classNames.line,
          )}
          style={styles.line}
        >
          {mergedShowLineNumbers.value && isDiff && (
            <span class={numberCls} style={styles.lineNumber} aria-hidden="true">{line.oldNumber}</span>
          )}
          {mergedShowLineNumbers.value && (
            <span class={numberCls} style={styles.lineNumber} aria-hidden="true">{line.newNumber}</span>
          )}
          {isDiff && (
            <span class={clsx(`${prefix}-marker`, classNames.marker)} style={styles.marker} aria-hidden="true">
              {MARKERS[line.type]}
            </span>
          )}
          {isDiff && srText && <span class={`${prefix}-sr-only`}>{srText}</span>}
          <span class={`${prefix}-line-content`}>
            {tokens
              ? tokens.map((token, tokenIndex) => (
                  <span key={tokenIndex} class={`${prefix}-token`} style={getTokenStyle(token)}>{token.content}</span>
                ))
              : line.content}
          </span>
        </span>
      )
    }

    return () => {
      const prefix = prefixCls.value
      const classNames = mergedClassNames.value
      const styles = mergedStyles.value

      const extraInfo: CodeExtraInfo = { copy, copied: copied.value, language: mergedLanguage.value }
      // 插槽优先、prop 兜底；空节点清掉，不渲染空的 header。
      const extraNodes = filterEmpty(
        [getSlotPropsFnRun(slots, props, 'extra', true, extraInfo)].flat(),
      ).filter(node => node !== null && node !== undefined)
      const hasExtra = extraNodes.length > 0
      const hasCopy = !!mergedCopyable.value

      return (
        <div
          {...omitClassAndStyle(attrs as Record<string, any>)}
          ref={rootRef}
          class={mergedClassName.value}
          style={mergedStyle.value}
        >
          {(hasExtra || hasCopy) && (
            <div class={clsx(`${prefix}-header`, classNames.header)} style={styles.header}>
              {hasExtra && <div class={`${prefix}-extra`}>{extraNodes}</div>}
              {hasCopy && renderCopyButton()}
            </div>
          )}
          <pre class={clsx(`${prefix}-pre`, classNames.pre)} style={styles.pre} dir="ltr" tabindex={0}>
            {/* 用 h 直接传子节点数组：JSX 的数组子节点会多包一层 Fragment（带两个空文本锚点）。 */}
            {h('code', { class: `${prefix}-code` }, parsed.value.lines.map(renderLine))}
          </pre>
        </div>
      )
    }
  },
  {
    name: 'ACode',
    inheritAttrs: false,
  },
)

;(Code as any).install = (app: App) => {
  app.component(Code.name, Code)
}

export type {
  CodeClassNamesType,
  CodeConfig,
  CodeCopyConfig,
  CodeCopyInfo,
  CodeEmits,
  CodeErrorInfo,
  CodeErrorStage,
  CodeExtraInfo,
  CodeHighlighter,
  CodeHighlightInfo,
  CodeNode,
  CodeProps,
  CodeRef,
  CodeSemanticClassNames,
  CodeSemanticName,
  CodeSemanticStyles,
  CodeSlots,
  CodeStylesType,
  CodeTheme,
  CodeToken,
} from './types'
export default Code
export { Code }
