import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

interface PackageJson {
  description?: string
  name: string
  version: string
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const packageDir = path.resolve(scriptDir, '..')
const packageJsonPath = path.join(packageDir, 'package.json')
const webTypesPath = path.join(packageDir, 'web-types.json')
const webTagsPath = path.join(packageDir, 'web-tags.json')

async function main() {
  const packageJson = JSON.parse(
    await readFile(packageJsonPath, 'utf8'),
  ) as PackageJson

  const description = packageJson.description ?? 'Ant Design Vue3 Pro component library.'

  const webTypes = {
    $schema: 'https://raw.githubusercontent.com/JetBrains/web-types/master/schema/web-types.json',
    name: packageJson.name,
    version: packageJson.version,
    'js-types-syntax': 'typescript',
    'description-markup': 'markdown',
    framework: 'vue',
    contributions: {
      html: {
        description,
        elements: [],
      },
    },
  }

  const webTags = {
    version: packageJson.version,
    tags: [],
  }

  await Promise.all([
    writeFile(webTypesPath, `${JSON.stringify(webTypes, null, 2)}\n`, 'utf8'),
    writeFile(webTagsPath, `${JSON.stringify(webTags, null, 2)}\n`, 'utf8'),
  ])
}

void main()
