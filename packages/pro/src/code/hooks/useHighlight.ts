import type { ComputedRef, ShallowRef } from 'vue'
import type { CodeErrorInfo, CodeHighlighter, CodeHighlightInfo, CodeToken } from '../types'
import type { CodeLine } from '../utils/diff'
import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { validateTokens } from '../utils/validate-tokens'

export interface HighlightSource {
  /** 当前展示的行。Diff 解析失败时是按纯文本切出来的行 */
  lines: CodeLine[]
  /** Diff 解析错误；有值时整段按纯文本展示，不做高亮 */
  parseError?: Error
}

export interface HighlightedLine {
  /** 这份 token 对应的行源码，渲染时用来判断它是否还和当前行一致 */
  content: string
  tokens: CodeToken[]
}

export interface UseHighlightOptions {
  source: ComputedRef<HighlightSource>
  language: ComputedRef<string>
  highlighter: ComputedRef<CodeHighlighter | undefined>
  onHighlight: (info: CodeHighlightInfo) => void
  onError: (info: CodeErrorInfo) => void
  /** 设置了语言却没有高亮器时调用（只用于开发环境提示） */
  onMissingHighlighter?: (language: string) => void
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error))
}

function joinLines(lines: CodeLine[]) {
  return lines.map(line => line.content)
}

/**
 * 对一组行整段分词并校验。校验不通过时抛错，由调用方统一回退。
 */
function tokenizeLines(highlighter: CodeHighlighter, lines: CodeLine[], language: string): CodeToken[][] {
  if (lines.length === 0)
    return []
  const contents = joinLines(lines)
  const tokens = highlighter.tokenize(contents.join('\n'), language)
  if (!validateTokens(tokens, contents))
    throw new Error('[Code] The tokens returned by `highlighter.tokenize` do not match the source code.')
  return tokens
}

/**
 * 按行生成 token。
 *
 * 普通模式整段分词一次。Diff 模式把「未变化 + 删除」拼成旧文本、「未变化 + 新增」拼成新文本，
 * 各自整段分词，再按行映射回去：删除行取旧文本的 token，新增行和未变化行取新文本的 token。
 * 这样多行注释、模板字符串这类跨行语法状态不会被 Diff 标记打断。
 */
export function highlightLines(highlighter: CodeHighlighter, lines: CodeLine[], language: string): HighlightedLine[] {
  const hasRemoved = lines.some(line => line.type === 'removed')
  const newLines = hasRemoved ? lines.filter(line => line.type !== 'removed') : lines
  const newTokens = tokenizeLines(highlighter, newLines, language)
  const oldTokens = hasRemoved
    ? tokenizeLines(highlighter, lines.filter(line => line.type !== 'added'), language)
    : []

  let newIndex = 0
  let oldIndex = 0
  return lines.map((line) => {
    let tokens: CodeToken[]
    if (line.type === 'removed') {
      tokens = oldTokens[oldIndex]!
      oldIndex += 1
    }
    else {
      tokens = newTokens[newIndex]!
      newIndex += 1
      // 未变化行同时存在于旧文本里，旧文本的游标也要前进。
      if (hasRemoved && line.type === 'normal')
        oldIndex += 1
    }
    return { content: line.content, tokens }
  })
}

/**
 * 管理高亮任务：任务版本、提交和事件。
 *
 * - 服务端和客户端首帧都不高亮，`onMounted` 之后才开始，保证 hydration 一致；
 * - 每次输入变化生成新的任务版本，异步结果返回时只有最新任务可以提交；
 * - 卸载后不提交、不触发事件；
 * - 语言加载的单例、去重和重试由高亮器自己负责，这里只管任务版本。
 */
export function useHighlight(options: UseHighlightOptions): ShallowRef<HighlightedLine[] | null> {
  const { source, language, highlighter, onHighlight, onError, onMissingHighlighter } = options
  const result = shallowRef<HighlightedLine[] | null>(null)

  let taskId = 0
  let active = false

  function fallback(lang: string) {
    result.value = null
    onHighlight({ language: lang, highlighted: false })
  }

  function run() {
    const id = ++taskId
    const { lines, parseError } = source.value
    const lang = language.value
    const hl = highlighter.value
    const isStale = () => !active || id !== taskId

    if (parseError) {
      result.value = null
      onError({ stage: 'parse', error: parseError })
      onHighlight({ language: lang, highlighted: false })
      return
    }

    if (lang === 'text' || !hl || lines.length === 0) {
      if (lang !== 'text' && !hl)
        onMissingHighlighter?.(lang)
      fallback(lang)
      return
    }

    const commit = () => {
      try {
        result.value = highlightLines(hl, lines, lang)
      }
      catch (error) {
        result.value = null
        onError({ stage: 'highlight', error: toError(error) })
        onHighlight({ language: lang, highlighted: false })
        return
      }
      onHighlight({ language: lang, highlighted: true })
    }

    let ready: boolean
    try {
      ready = hl.hasLanguage(lang)
    }
    catch (error) {
      result.value = null
      onError({ stage: 'load', error: toError(error) })
      onHighlight({ language: lang, highlighted: false })
      return
    }

    // 语言已经可用时同步提交。内容频繁变化（流式输出）时不会每次闪一帧纯文本。
    if (ready) {
      commit()
      return
    }

    // 加载期间保留上一次的结果，渲染时只复用源码没变的行，变化的行先显示纯文本。
    let loading: Promise<boolean>
    try {
      loading = Promise.resolve(hl.loadLanguage(lang))
    }
    catch (error) {
      loading = Promise.reject(error)
    }
    loading.then(
      (supported) => {
        if (isStale())
          return
        if (!supported) {
          fallback(lang)
          return
        }
        commit()
      },
      (error) => {
        if (isStale())
          return
        result.value = null
        onError({ stage: 'load', error: toError(error) })
        onHighlight({ language: lang, highlighted: false })
      },
    )
  }

  const stop = watch([source, language, highlighter], () => {
    if (active)
      run()
  })

  onMounted(() => {
    active = true
    run()
  })

  onBeforeUnmount(() => {
    active = false
    taskId += 1
    stop()
  })

  return result
}
