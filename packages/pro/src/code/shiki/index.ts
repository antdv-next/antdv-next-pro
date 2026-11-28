import type { HighlighterCore, LanguageRegistration } from 'shiki/core'
import type { CodeHighlighter } from '../types'
import type { ShikiLanguageLoader } from './languages'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import { markRaw } from 'vue'
import { BUILTIN_ALIASES, BUILTIN_LANGS } from './languages'
import { DARK_KEY, LIGHT_KEY, toCodeTokens } from './tokens'

const LIGHT_THEME = 'github-light'
const DARK_THEME = 'github-dark'

export interface ShikiCodeHighlighterOptions {
  /**
   * 追加或覆盖内置语言，键是语言名（小写）。
   *
   * Add or override built-in languages. Keys are (lowercase) language names.
   * @example { toml: () => import('shiki/langs/toml.mjs') }
   */
  langs?: Record<string, ShikiLanguageLoader>
  /**
   * 追加别名，键是别名（小写），值是语言名。
   *
   * Extra aliases. Keys are (lowercase) aliases, values are language names.
   */
  aliases?: Record<string, string>
}

function toRegistrations(input: unknown): LanguageRegistration[] {
  const value = (input as any)?.default ?? input
  const list = Array.isArray(value) ? value : [value]
  return list.filter(Boolean) as LanguageRegistration[]
}

/**
 * 创建基于 Shiki 的高亮器，传给 Code 的 `highlighter` 或 `ProConfigProvider` 的 `code.highlighter`。
 *
 * 请在模块级创建一次并复用：每个实例各自持有一个懒创建的 Shiki 高亮器，
 * 第一次需要高亮时才初始化，语言按需加载、并发去重，失败后可以重试。
 *
 * Create a Shiki based highlighter for the `highlighter` prop of Code or `code.highlighter` of `ProConfigProvider`.
 *
 * Create it once at module level and reuse it: every instance owns a lazily created Shiki highlighter
 * that is initialized on first use; languages are loaded on demand, de-duplicated and retryable.
 */
export function createShikiCodeHighlighter(options: ShikiCodeHighlighterOptions = {}): CodeHighlighter {
  const langs: Record<string, ShikiLanguageLoader> = { ...BUILTIN_LANGS, ...options.langs }
  const aliases: Record<string, string> = { ...BUILTIN_ALIASES, ...options.aliases }

  let core: HighlighterCore | undefined
  let corePromise: Promise<HighlighterCore> | undefined
  /** 语言名 → Shiki 里注册的语法名 */
  const loaded = new Map<string, string>()
  const loading = new Map<string, Promise<boolean>>()

  function resolveName(language: string) {
    const name = String(language).toLowerCase()
    return aliases[name] ?? name
  }

  function getCore() {
    if (!corePromise) {
      const task = createHighlighterCore({
        themes: [
          import('shiki/themes/github-light.mjs'),
          import('shiki/themes/github-dark.mjs'),
        ],
        langs: [],
        // JavaScript 正则引擎：不需要加载 WASM，产物更小，SSR 和 CSP 环境都能用。
        engine: createJavaScriptRegexEngine({ forgiving: true }),
      }).then((instance) => {
        core = instance
        return instance
      })
      corePromise = task
      // 初始化失败后不保留 rejected Promise，下次重新创建。
      task.catch(() => {
        if (corePromise === task)
          corePromise = undefined
      })
    }
    return corePromise
  }

  async function load(name: string, loader: ShikiLanguageLoader) {
    const [instance, module] = await Promise.all([getCore(), loader()])
    const registrations = toRegistrations(module)
    if (registrations.length === 0)
      throw new Error(`[Code] The loader of language "${name}" did not return a Shiki language.`)
    await instance.loadLanguage(...registrations)
    // Shiki 的语言模块把依赖的嵌入语言排在前面，主语言在最后。
    loaded.set(name, registrations[registrations.length - 1]!.name)
    return true
  }

  const highlighter: CodeHighlighter = {
    hasLanguage(language) {
      return !!core && loaded.has(resolveName(language))
    },

    loadLanguage(language) {
      const name = resolveName(language)
      if (loaded.has(name) && core)
        return Promise.resolve(true)

      const loader = Object.prototype.hasOwnProperty.call(langs, name) ? langs[name] : undefined
      if (!loader)
        return Promise.resolve(false)

      let task = loading.get(name)
      if (!task) {
        task = load(name, loader)
        loading.set(name, task)
        // 无论成功失败都移除：成功后走 `loaded`，失败后下次可以重试。
        const clear = () => {
          if (loading.get(name) === task)
            loading.delete(name)
        }
        task.then(clear, clear)
      }
      return task
    },

    tokenize(code, language) {
      const lang = loaded.get(resolveName(language))
      if (!core || !lang)
        throw new Error(`[Code] Language "${language}" is not loaded. Call \`loadLanguage\` first.`)

      return toCodeTokens(core.codeToTokensWithThemes(code, {
        lang,
        themes: { [LIGHT_KEY]: LIGHT_THEME, [DARK_KEY]: DARK_THEME },
      }))
    },
  }

  // 避免被放进 reactive 对象后，整个 Shiki 实例被深度代理。
  return markRaw(highlighter)
}

export type { CodeHighlighter, CodeToken } from '../types'
export type { ShikiLanguageLoader } from './languages'
