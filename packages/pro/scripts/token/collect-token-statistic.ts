import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { theme } from 'antdv-next'
import { prepareComponentToken as prepareCronToken } from '../../src/cron/style/token'
import { prepareComponentToken as prepareHeatmapToken } from '../../src/heatmap/style/token'
import { prepareComponentToken as prepareInputTagToken } from '../../src/input-tag/style/token'
import { prepareComponentToken as prepareScrollbarToken } from '../../src/scrollbar/style/token'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '../../../..')
const outputPath = path.resolve(repoRoot, 'docs/src/assets/token.json')

async function main() {
  const globalToken = theme.getDesignToken()

  const output = {
    Cron: {
      global: [
        'colorBgContainer',
        'colorBorderSecondary',
        'padding',
        'controlItemBgActive',
        'colorFillTertiary',
        'colorError',
        'marginXS',
        'controlHeight',
        'paddingSM',
        'motionDurationMid',
      ],
      component: prepareCronToken(globalToken),
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
      component: prepareHeatmapToken(globalToken),
    },
    InputTag: {
      global: ['marginXXS', 'controlHeight', 'colorTextTertiary', 'colorText'],
      component: prepareInputTagToken(globalToken),
    },
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
      component: prepareScrollbarToken(globalToken),
    },
  }

  await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
  console.log(`Token statistics have been written to ${outputPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
