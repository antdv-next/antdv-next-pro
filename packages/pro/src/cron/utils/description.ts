import type { CronDescriptionLocale } from '../types'

/**
 * 把 `cronstrue/locales/<name>.js` 模块包装成 Cron 语言包可以携带的描述语言。
 *
 * cronstrue 的语言文件是 UMD：打包器里拿到的是带具名导出的命名空间，
 * Node 原生 ESM 里只有 `default`（即 `module.exports`），这里两种形态都兼容。
 *
 * 这个文件不引入 cronstrue 核心，语言包文件因此只会带上自己那一种语言。
 */
export function defineCronDescriptionLocale(name: string, localeModule: unknown): CronDescriptionLocale | undefined {
  const namespace = localeModule as Record<string, any> | undefined
  const LocaleClass = namespace?.[name] ?? namespace?.default?.[name]
  if (typeof LocaleClass !== 'function')
    return undefined
  return {
    name,
    create: () => new LocaleClass(),
  }
}
