import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import Pro, { Code } from '../../index'
import CodeFromEntry from '../index'

describe('Code install', () => {
  it('is registered as a-code by app.use(pro)', () => {
    const app = createApp({ render: () => null })
    app.use(Pro)
    expect(app.component('ACode')).toBe(Code)
  })

  it('exports the same component from the package entry and the sub entry', () => {
    expect(Code).toBe(CodeFromEntry)
    expect(Code.name).toBe('ACode')
  })

  it('can be installed on its own', () => {
    const app = createApp({ render: () => null })
    app.use(Code as any)
    expect(app.component('ACode')).toBe(Code)
  })
})
