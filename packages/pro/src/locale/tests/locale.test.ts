import type { Locale as AntLocale } from 'antdv-next/locale/index'
import type { CronLocale } from '../../cron/types'
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

function flattenCronLocale(locale: CronLocale): Record<string, string> {
  const messages: Record<string, string> = {}
  for (const [key, value] of Object.entries(locale)) {
    if (typeof value === 'string') {
      messages[key] = value
      continue
    }
    for (const [nestedKey, message] of Object.entries(value)) {
      if (typeof message === 'string')
        messages[`${key}.${nestedKey}`] = message
    }
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

      const messages = flattenCronLocale(locale!.Cron!)
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

  it('is assignable to the antdv-next Locale type', () => {
    const proLocale: ProLocale = enUS
    const antLocale: AntLocale = proLocale

    expect(antLocale).toBe(enUS)
  })
})
