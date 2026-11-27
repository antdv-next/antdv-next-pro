/**
 * 语言加载器。返回 Shiki 的语言模块（`import('shiki/langs/xxx.mjs')`）或语言注册对象。
 *
 * A language loader. Returns a Shiki language module (`import('shiki/langs/xxx.mjs')`) or language registrations.
 */
export type ShikiLanguageLoader = () => Promise<unknown>

/**
 * 内置语言白名单。必须是静态可分析的 `import()`，打包器才能按语言拆分产物；
 * 不根据任意 `language` 字符串拼接模块路径。
 */
export const BUILTIN_LANGS: Record<string, ShikiLanguageLoader> = {
  javascript: () => import('shiki/langs/javascript.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  jsx: () => import('shiki/langs/jsx.mjs'),
  tsx: () => import('shiki/langs/tsx.mjs'),
  vue: () => import('shiki/langs/vue.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  scss: () => import('shiki/langs/scss.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  markdown: () => import('shiki/langs/markdown.mjs'),
  bash: () => import('shiki/langs/bash.mjs'),
  sql: () => import('shiki/langs/sql.mjs'),
  yaml: () => import('shiki/langs/yaml.mjs'),
  python: () => import('shiki/langs/python.mjs'),
}

export const BUILTIN_ALIASES: Record<string, string> = {
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  ts: 'typescript',
  mts: 'typescript',
  cts: 'typescript',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  yml: 'yaml',
  md: 'markdown',
  py: 'python',
}
