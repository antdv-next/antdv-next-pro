import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import baseConfig from '../../../vitest-plugin.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../..')

async function run() {
  const [, , entry, exportName = 'main'] = process.argv
  if (!entry) {
    console.error('Usage: tsx ./scripts/vite-ssr-run.ts <module> [exportName]')
    process.exit(1)
  }

  const server = await createServer({
    ...baseConfig,
    configFile: false,
    root: repoRoot,
    logLevel: 'warn',
    optimizeDeps: { noDiscovery: true, include: [] },
    server: {
      middlewareMode: true,
      hmr: false,
      watch: null,
    },
  })

  try {
    const mod = await server.ssrLoadModule(path.resolve(process.cwd(), entry))
    const fn = mod[exportName]
    if (typeof fn !== 'function')
      throw new TypeError(`Export "${exportName}" of ${entry} is not a function`)
    await fn()
  }
  finally {
    await server.close()
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
