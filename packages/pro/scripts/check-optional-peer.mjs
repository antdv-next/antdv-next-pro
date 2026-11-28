// `shiki` is an optional peer dependency. This script runs after the build and fails it when the
// published output would force every consumer to install Shiki:
//
// 1. the static import graph of `dist/index.js` must not reach `shiki`;
// 2. the type graph of `dist/index.d.ts` must not reach `shiki`;
// 3. only files under `dist/code/shiki/` may import `shiki` at all (statically or dynamically).
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const OPTIONAL_PEER = 'shiki'
const ALLOWED_DIR = join('code', 'shiki')

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), '../dist')

if (!existsSync(distDir)) {
  console.error(`[check-optional-peer] ${distDir} does not exist. Run the build first.`)
  process.exit(1)
}

// Covers `import x from ''`, `export * from ''`, `import ''`, `import('')` and `import("").Type` in declarations.
const SPECIFIER_PATTERNS = [
  /\b(?:import|export)\s[^'"`;]*?from\s*['"]([^'"]+)['"]/g,
  /\bimport\s*['"]([^'"]+)['"]/g,
  /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
]

function getSpecifiers(file) {
  const code = readFileSync(file, 'utf8')
  const specifiers = new Set()
  for (const pattern of SPECIFIER_PATTERNS) {
    for (const match of code.matchAll(pattern))
      specifiers.add(match[1])
  }
  return [...specifiers]
}

function isOptionalPeer(specifier) {
  return specifier === OPTIONAL_PEER
    || specifier.startsWith(`${OPTIONAL_PEER}/`)
    || specifier.startsWith('@shikijs/')
}

function resolveRelative(from, specifier, extension) {
  const base = resolve(dirname(from), specifier)
  const candidates = [
    base,
    `${base}${extension}`,
    base.replace(/\.js$/, extension),
    join(base, `index${extension}`),
  ]
  return candidates.find(candidate => existsSync(candidate) && statSync(candidate).isFile())
}

/** Walk the import graph from an entry and return the first chain that reaches the optional peer. */
function findPeerChain(entry, extension) {
  const visited = new Set()
  const queue = [[entry]]
  while (queue.length) {
    const chain = queue.shift()
    const file = chain[chain.length - 1]
    if (visited.has(file))
      continue
    visited.add(file)

    for (const specifier of getSpecifiers(file)) {
      if (isOptionalPeer(specifier))
        return [...chain.map(item => relative(distDir, item)), specifier]
      if (!specifier.startsWith('.'))
        continue
      const next = resolveRelative(file, specifier, extension)
      if (next && !visited.has(next))
        queue.push([...chain, next])
    }
  }
  return null
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = join(dir, entry.name)
    return entry.isDirectory() ? walk(file) : [file]
  })
}

const errors = []

for (const [entry, extension] of [['index.js', '.js'], ['index.d.ts', '.d.ts']]) {
  const file = join(distDir, entry)
  if (!existsSync(file)) {
    errors.push(`dist/${entry} is missing.`)
    continue
  }
  const chain = findPeerChain(file, extension)
  if (chain)
    errors.push(`dist/${entry} reaches "${OPTIONAL_PEER}":\n    ${chain.join('\n    -> ')}`)
}

const adapterEntry = join(distDir, ALLOWED_DIR, 'index.js')
if (!existsSync(adapterEntry))
  errors.push(`dist/${ALLOWED_DIR.split(sep).join('/')}/index.js is missing: the Shiki adapter entry was not built.`)

let adapterImportsPeer = false
for (const file of walk(distDir)) {
  if (!/\.(?:js|d\.ts)$/.test(file))
    continue
  const importsPeer = getSpecifiers(file).some(isOptionalPeer)
  if (!importsPeer)
    continue
  const relativePath = relative(distDir, file)
  if (relativePath.startsWith(`${ALLOWED_DIR}${sep}`))
    adapterImportsPeer = true
  else
    errors.push(`dist/${relativePath.split(sep).join('/')} imports "${OPTIONAL_PEER}" outside dist/code/shiki/.`)
}

if (existsSync(adapterEntry) && !adapterImportsPeer)
  errors.push(`Nothing under dist/code/shiki/ imports "${OPTIONAL_PEER}": it may have been bundled instead of kept external.`)

if (errors.length) {
  console.error(`[check-optional-peer] ${errors.length} problem(s):\n`)
  for (const error of errors)
    console.error(`  - ${error}\n`)
  process.exit(1)
}

console.log(`[check-optional-peer] OK: only dist/code/shiki/ imports "${OPTIONAL_PEER}".`)
