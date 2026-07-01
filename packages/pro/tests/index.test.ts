import { describe, expect, it } from 'vitest'
import * as Pro from '../src/index'

describe('@antdv-next/pro', () => {
  it('exposes the plugin and public components from the package entry', () => {
    expect(Object.keys(Pro).sort()).toEqual(['ProConfigProvider', 'Scrollbar', 'default'])
  })
})
