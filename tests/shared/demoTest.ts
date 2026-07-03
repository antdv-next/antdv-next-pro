import { readdirSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { beforeAll, describe, expect, it } from 'vitest'
import { mount } from '../utils'

const testDir = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(testDir, '../..')

interface DemoTestOptions {
  /** Skip all demos or specific demo names (without .vue extension) */
  skip?: boolean | string[]
}

export default function demoTest(component: string, options: DemoTestOptions = {}) {
  const demoDir = resolve(rootDir, 'docs/src/pages/components', component, 'demo')

  let files: string[] = []
  try {
    // `_*.vue` demos rely on docs-site framework helpers (e.g. SemanticPreview),
    // so they are only rendered by the docs app, not unit tests.
    files = readdirSync(demoDir).filter(f => f.endsWith('.vue') && !f.startsWith('_')).sort()
  }
  catch {
    // No demo directory found
  }

  if (options.skip === true || files.length === 0) {
    describe.skip(`${component} demo`, () => {
      it('skipped', () => {})
    })
    return
  }

  describe(`${component} demo`, () => {
    let antd: any
    let pro: any
    beforeAll(async () => {
      antd = (await import('antdv-next')).default
      pro = (await import('../../packages/pro/src/index')).default
    }, 60000)

    files.forEach((file) => {
      const name = basename(file, '.vue')
      const shouldSkip = Array.isArray(options.skip) && options.skip.includes(name)
      const testFn = shouldSkip ? it.skip : it

      testFn(`renders ${name} correctly`, async () => {
        const { default: Demo } = await import(/* @vite-ignore */ resolve(demoDir, file))

        const wrapper = mount(Demo, {
          global: {
            plugins: [antd, pro],
          },
          attachTo: document.body,
        })

        expect(wrapper.element).toMatchSnapshot()
        wrapper.unmount()
      }, 30000)
    })
  })
}
