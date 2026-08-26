import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

interface TokenMetaItem {
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
const globalMetaPath = path.resolve(repoRoot, 'docs/src/assets/token-meta.json')
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

function getTagText(member: ts.PropertySignature, tagName: string, _sourceFile: ts.SourceFile) {
  return (ts.getJSDocTags(member).find(tag => tag.tagName.text === tagName)?.comment || '')
    .toString()
    .trim()
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
        desc: getTagText(member, 'desc', sourceFile),
        descEn: getTagText(member, 'descEN', sourceFile),
      }
    })

  const globalMeta = JSON.parse(await fs.readFile(globalMetaPath, 'utf8')) as {
    global?: Record<string, TokenMetaItem>
  }
  const global = Object.fromEntries(
    globalTokenNames
      .map(token => [token, globalMeta.global?.[token]])
      .filter(([, meta]) => meta),
  )

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
