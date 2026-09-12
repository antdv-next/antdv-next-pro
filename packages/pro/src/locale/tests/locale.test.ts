import type { Locale as AntLocale } from 'antdv-next/locale/index'
import type { ProLocale } from '../types'
import { readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { basename, dirname } from 'node:path'
import arEG from 'antdv-next/locale/ar_EG'
import enUS from 'antdv-next/locale/en_US'
import frFR from 'antdv-next/locale/fr_FR'
import { describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)
const upstreamLocaleDirectory = dirname(require.resolve('antdv-next/locale/en_US'))
const expectedLocaleNames = readdirSync(upstreamLocaleDirectory)
  .filter(name => name.endsWith('.js') && !['index.js', 'useLocale.js'].includes(name))
  .map(name => basename(name, '.js'))
  .sort()
const proLocaleModules = import.meta.glob('../*.ts', { eager: true, import: 'default' }) as Record<string, ProLocale | undefined>

const selectedLocales = [
  ['ar_EG', arEG],
  ['en_US', enUS],
  ['fr_FR', frFR],
] as const

describe('Pro locale', () => {
  it('matches the locale entry set shipped by antdv-next', () => {
    const proLocaleNames = Object.keys(proLocaleModules)
      .map(name => basename(name, '.ts'))
      .filter(name => expectedLocaleNames.includes(name))
      .sort()

    expect(proLocaleNames).toEqual(expectedLocaleNames)
    expect(proLocaleNames).toHaveLength(72)
  })

  it('keeps every upstream locale value and adds Heatmap text', async () => {
    for (const localeName of expectedLocaleNames) {
      const locale = proLocaleModules[`../${localeName}.ts`]
      expect(locale?.locale).toEqual(expect.any(String))
      expect(locale?.Heatmap).toMatchObject({
        label: expect.any(String),
        less: expect.any(String),
        more: expect.any(String),
        noData: expect.any(String),
        level: expect.any(String),
      })
    }

    for (const [localeName, locale] of selectedLocales) {
      const proLocale = proLocaleModules[`../${localeName}.ts`]!
      expect(proLocale).toMatchObject(locale)
      expect(proLocale).not.toBe(locale)
    }
    const upstreamLocales = await Promise.all([
      import('antdv-next/locale/ar_EG'),
      import('antdv-next/locale/en_US'),
      import('antdv-next/locale/fr_FR'),
    ])

    expect(arEG).toBe(upstreamLocales[0].default)
    expect(enUS).toBe(upstreamLocales[1].default)
    expect(frFR).toBe(upstreamLocales[2].default)
    expect(enUS).toMatchObject(upstreamLocales[1].default)
  })

  it('is assignable to the antdv-next Locale type', () => {
    const proLocale: ProLocale = proLocaleModules['../en_US.ts']!
    const antLocale: AntLocale = proLocale

    expect(antLocale).toMatchObject(enUS)
  })
})
