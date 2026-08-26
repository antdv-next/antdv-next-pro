import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { glob } from 'tinyglobby'
import ts from 'typescript'

interface TokenMetaItem {
  name?: string
  nameEn?: string
  source: string
  token: string
  type: string
  desc: string
  descEn: string
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '../../../..')
const packageRoot = path.resolve(repoRoot, 'packages/pro')
const sourcePath = path.resolve(packageRoot, 'src/scrollbar/style/token.ts')
const globalTokenSourceDir = path.resolve(
  packageRoot,
  'node_modules/antdv-next/dist/theme/interface',
)
const outputPath = path.resolve(repoRoot, 'docs/src/assets/token-meta.json')

const globalTokenNames = [
  'colorFillTertiary',
  'colorTextTertiary',
  'colorTextSecondary',
  'colorText',
  'borderRadiusSM',
  'paddingXXS',
  'motionDurationMid',
  'motionEaseOutCirc',
]

function getTagText(member: ts.Node, tagName: string) {
  return (ts.getJSDocTags(member).find(tag => tag.tagName.text === tagName)?.comment || '')
    .toString()
    .trim()
}

async function getGlobalTokenMeta() {
  const files = await glob('**/*.d.ts', { cwd: globalTokenSourceDir, absolute: true })
  const globalMeta = new Map<string, TokenMetaItem>()

  files.forEach((file) => {
    const source = ts.sys.readFile(file)
    if (!source)
      return

    const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true)
    const normalizedFile = file.replace(/\\/g, '/')
    const sourceType = normalizedFile.includes('/maps/')
      ? 'map'
      : path.basename(file) === 'alias.d.ts' ? 'alias' : 'seed'

    sourceFile.forEachChild((node) => {
      if (!ts.isInterfaceDeclaration(node))
        return

      node.members
        .filter(ts.isPropertySignature)
        .forEach((member) => {
          const token = member.name.getText(sourceFile)
          if (!globalTokenNames.includes(token) || globalMeta.has(token))
            return

          globalMeta.set(token, {
            source: sourceType,
            token,
            type: member.type?.getText(sourceFile) || 'any',
            desc: getTagText(member, 'desc'),
            descEn: getTagText(member, 'descEN'),
            name: getTagText(member, 'nameZH'),
            nameEn: getTagText(member, 'nameEN'),
          })
        })
    })
  })

  return Object.fromEntries(
    globalTokenNames
      .map(token => [token, globalMeta.get(token)])
      .filter(([, meta]) => meta),
  )
}

async function main() {
  const source = await fs.readFile(sourcePath, 'utf8')
  const sourceFile = ts.createSourceFile(sourcePath, source, ts.ScriptTarget.Latest, true)
  const component = sourceFile.statements.find(
    statement => ts.isInterfaceDeclaration(statement) && statement.name.text === 'ComponentToken',
  )

  if (!component || !ts.isInterfaceDeclaration(component))
    throw new Error(`ComponentToken interface not found in ${sourcePath}`)

  const tokens: TokenMetaItem[] = component.members
    .filter(ts.isPropertySignature)
    .map((member) => {
      const token = member.name.getText(sourceFile)
      return {
        source: 'Scrollbar',
        token,
        type: member.type?.getText(sourceFile) || 'any',
        desc: getTagText(member, 'desc'),
        descEn: getTagText(member, 'descEN'),
      }
    })

  const global = await getGlobalTokenMeta()

  const output = {
    global,
    components: {
      Scrollbar: tokens,
    },
  }

  await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
  console.log(`Token meta has been written to ${outputPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
