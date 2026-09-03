import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { theme } from 'antdv-next'
import { prepareComponentToken as prepareHeatmapToken } from '../../src/heatmap/style/token'
import { prepareComponentToken } from '../../src/scrollbar/style/token'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '../../../..')
const outputPath = path.resolve(repoRoot, 'docs/src/assets/token.json')

async function main() {
  const globalToken = theme.getDesignToken()
  const scrollbarToken = prepareComponentToken(globalToken)
  const heatmapToken = prepareHeatmapToken(globalToken)

  const output = {
    Scrollbar: {
      global: [
        'colorFillTertiary',
        'colorTextTertiary',
        'colorTextSecondary',
        'colorText',
        'borderRadiusSM',
        'paddingXXS',
        'motionDurationMid',
        'motionEaseOutCirc',
      ],
      component: scrollbarToken,
    },
    Heatmap: {
      global: [
        'colorFillTertiary',
        'colorFillSecondary',
        'colorTextSecondary',
        'colorPrimary',
        'borderRadiusSM',
        'fontSizeSM',
        'fontWeightStrong',
        'lineHeightSM',
        'marginSM',
        'marginXS',
        'marginXXS',
        'paddingXS',
        'paddingXXS',
        'motionDurationMid',
      ],
      component: heatmapToken,
    },
  }

  await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
  console.log(`Token statistics have been written to ${outputPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
