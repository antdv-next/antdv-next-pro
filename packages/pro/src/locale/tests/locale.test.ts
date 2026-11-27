import type { Locale as AntLocale } from 'antdv-next/locale/index'
import type { ProLocale } from '../types'
import { readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { basename, dirname } from 'node:path'
import upstreamEnUS from 'antdv-next/locale/en_US'
import { describe, expect, it } from 'vitest'
import arEG from '../ar_EG'
import enUS from '../en_US'
import frFR from '../fr_FR'

const require = createRequire(import.meta.url)
const upstreamLocaleDirectory = dirname(require.resolve('antdv-next/locale/en_US'))
const expectedLocaleNames = readdirSync(upstreamLocaleDirectory)
  .filter(name => name.endsWith('.js') && !['index.js', 'useLocale.js'].includes(name))
  .map(name => basename(name, '.js'))
  .sort()
const proLocaleModules = import.meta.glob('../*.ts', { eager: true, import: 'default' }) as Record<string, ProLocale | undefined>

function flattenCronLocale(locale: unknown, prefix = ''): Record<string, string> {
  const messages: Record<string, string> = {}
  if (!locale || typeof locale !== 'object')
    return messages
  for (const [key, value] of Object.entries(locale)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') {
      messages[path] = value
      continue
    }
    Object.assign(messages, flattenCronLocale(value, path))
  }
  return messages
}

function getPlaceholders(message: string) {
  return [...message.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort()
}

describe('Pro locale', () => {
  it('matches the locale entry set shipped by antdv-next', () => {
    const proLocaleNames = Object.keys(proLocaleModules)
      .map(name => basename(name, '.ts'))
      .filter(name => expectedLocaleNames.includes(name))
      .sort()

    expect(proLocaleNames).toEqual(expectedLocaleNames)
    expect(proLocaleNames).toHaveLength(72)
  })

  it('preserves the upstream locale and adds complete Cron messages to every wrapper', () => {
    const englishMessages = flattenCronLocale(enUS.Cron!)
    const expectedMessageKeys = Object.keys(englishMessages).sort()

    for (const localeName of expectedLocaleNames) {
      const locale = proLocaleModules[`../${localeName}.ts`]
      expect(locale?.locale, localeName).toEqual(expect.any(String))
      expect(locale?.Cron, localeName).toBeDefined()
      expect(locale?.Code, localeName).toMatchObject({
        added: expect.any(String),
        removed: expect.any(String),
      })
      expect(locale?.Code?.added?.trim(), `${localeName}:Code.added`).not.toBe('')
      expect(locale?.Code?.removed?.trim(), `${localeName}:Code.removed`).not.toBe('')
      expect(locale?.Heatmap, localeName).toMatchObject({
        label: expect.any(String),
        less: expect.any(String),
        more: expect.any(String),
        noData: expect.any(String),
        level: expect.any(String),
      })
      expect(locale?.InputTag, localeName).toMatchObject({
        clear: expect.any(String),
        showMore: expect.any(String),
      })
      expect(locale?.CategorySearch, localeName).toBeDefined()
      for (const key of Object.keys(enUS.CategorySearch!) as (keyof NonNullable<ProLocale['CategorySearch']>)[]) {
        const message = locale?.CategorySearch?.[key]
        expect(message, `${localeName}:CategorySearch.${key}`).toEqual(expect.any(String))
        expect(message?.trim(), `${localeName}:CategorySearch.${key}`).not.toBe('')
      }
      expect(locale?.InputTag?.clear?.trim(), `${localeName}:InputTag.clear`).not.toBe('')
      expect(locale?.InputTag?.showMore?.trim(), `${localeName}:InputTag.showMore`).not.toBe('')

      // descriptionLocale 是 cronstrue 语言的载体，不是文案，不参与文案键的比对
      const { descriptionLocale: _descriptionLocale, ...cronMessages } = locale!.Cron!
      const messages = flattenCronLocale(cronMessages)
      expect(Object.keys(messages).sort(), localeName).toEqual(expectedMessageKeys)
      for (const key of expectedMessageKeys) {
        const message = messages[key]
        expect(message, `${localeName}:${key}`).toEqual(expect.any(String))
        expect(message?.trim(), `${localeName}:${key}`).not.toBe('')
        expect(getPlaceholders(message!), `${localeName}:${key}`).toEqual(getPlaceholders(englishMessages[key]!))
        expect(message, `${localeName}:${key}`).not.toMatch(/\{\d+\}|__\d{2}__|ZXQ(?:\d+|QUESTION)QXZ/)
      }
    }

    expect(enUS).toMatchObject(upstreamEnUS)
    expect(enUS).not.toBe(upstreamEnUS)
  })

  it('ships translated Cron messages for representative locales', () => {
    expect(arEG.Cron?.fields.second).toBe('الثانية')
    expect(frFR.Cron?.fields.second).toBe('Seconde')
    expect(proLocaleModules['../ja_JP.ts']?.Cron?.nextRun).toBe('次の実行: {value}')
  })

  it('ships Heatmap and InputTag messages for representative locales', () => {
    expect(enUS.Heatmap?.label).toBe('Heatmap')
    expect(frFR.Heatmap?.label).toBe('Carte thermique')
    expect(enUS.InputTag).toMatchObject({
      clear: 'Clear',
      showMore: 'Show all tags',
    })
    expect(frFR.InputTag).toMatchObject({
      clear: 'Effacer',
      showMore: 'Afficher toutes les étiquettes',
    })
    expect(proLocaleModules['../zh_TW.ts']?.InputTag).toMatchObject({
      clear: '清空',
      showMore: '展開全部標籤',
    })
  })

  it('ships CategorySearch messages for representative locales', () => {
    expect(enUS.CategorySearch).toMatchObject({ placeholder: 'Select a category or search', confirm: 'OK', cancel: 'Cancel' })
    expect(frFR.CategorySearch?.selectAll).toBe('Tout sélectionner')
    expect(proLocaleModules['../zh_CN.ts']?.CategorySearch).toMatchObject({ confirm: '确定', valueSeparator: '、' })
  })

  it('ships Code messages for representative locales', () => {
    expect(enUS.Code).toEqual({ added: 'Added', removed: 'Removed' })
    expect(proLocaleModules['../zh_CN.ts']?.Code).toEqual({ added: '新增', removed: '删除' })
    expect(proLocaleModules['../zh_TW.ts']?.Code).toEqual({ added: '新增', removed: '刪除' })
    expect(proLocaleModules['../ja_JP.ts']?.Code).toEqual({ added: '追加', removed: '削除' })
    // 其他语言先用英文兜底。
    expect(frFR.Code).toEqual({ added: 'Added', removed: 'Removed' })
  })

  it('is assignable to the antdv-next Locale type', () => {
    const proLocale: ProLocale = enUS
    const antLocale: AntLocale = proLocale

    expect(antLocale).toBe(enUS)
  })
})
