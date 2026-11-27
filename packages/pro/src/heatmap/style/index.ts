import type { CSSObject } from '@antdv-next/cssinjs'
import type { FullToken, GenerateStyle } from 'antdv-next/theme/internal'
import { unit } from '@antdv-next/cssinjs'
import { genStyleHooks } from 'antdv-next/theme/internal'
import { HEATMAP_COLOR_THEMES } from '../types'
import { prepareComponentToken } from './token'

export type { ComponentToken } from './token'

interface HeatmapToken extends FullToken<'Heatmap'> {
  emptyCellColor: string
  minimumColor: string
  activeColor1: string
  activeColor2: string
  activeColor3: string
  activeColor4: string
  cellSizeSM: number
  cellSize: number
  cellSizeLG: number
  cellRadius: number
  labelColor: string
  labelFontSize: number
  labelLineHeight: number
  indicatorTextColor: string
  focusOutlineColor: string
}

function genActiveLevelStyle(colors: readonly [string, string, string, string]): CSSObject {
  return {
    '&[data-level="2"]': { backgroundColor: colors[0] },
    '&[data-level="3"]': { backgroundColor: colors[1] },
    '&[data-level="4"]': { backgroundColor: colors[2] },
    '&[data-level="5"]': { backgroundColor: colors[3] },
  }
}

const genHeatmapStyle: GenerateStyle<HeatmapToken, CSSObject> = (token) => {
  const { componentCls } = token
  const defaultLevelStyle = genActiveLevelStyle([
    token.activeColor1,
    token.activeColor2,
    token.activeColor3,
    token.activeColor4,
  ])
  // 内置主题取 Ant Design 预设色板的 3 / 5 / 7 / 9 档，全部来自全局 Token，
  // 暗色算法下色板会整体重算，这里不需要额外处理。
  const themeStyles: CSSObject = {}
  HEATMAP_COLOR_THEMES.forEach((name) => {
    const palette = token as unknown as Record<string, string>
    themeStyles[`&-theme-${name}`] = {
      [`${componentCls}-cell, ${componentCls}-indicator-color`]: genActiveLevelStyle([
        palette[`${name}3`]!,
        palette[`${name}5`]!,
        palette[`${name}7`]!,
        palette[`${name}9`]!,
      ]),
    }
  })

  return {
    [componentCls]: {
      display: 'inline-flex',
      flexDirection: 'column',
      maxWidth: '100%',
      color: token.labelColor,

      '&-rtl': {
        direction: 'rtl',
      },

      '&-table': {
        borderCollapse: 'separate',
        fontSize: token.labelFontSize,
      },

      '&-content': {
        maxWidth: '100%',
        minWidth: 0,
        overflowX: 'auto',
      },

      '&-content-inner': {
        display: 'inline-flex',
        flexDirection: 'column',
        width: 'fit-content',
      },

      '&-month-label, &-week-label': {
        color: token.labelColor,
        fontSize: token.labelFontSize,
        fontWeight: token.fontWeightStrong,
        lineHeight: token.labelLineHeight,
        whiteSpace: 'nowrap',
      },

      '&-month-label': {
        minWidth: token.cellSize,
        paddingBlockEnd: token.paddingXS,
        paddingInline: token.paddingXXS,
        textAlign: 'start',
        verticalAlign: 'bottom',
      },

      '&-month-label[data-colspan="1"]': {
        minWidth: 0,
        paddingInline: 0,
        height: token.labelLineHeight,
      },

      '&-week-label': {
        paddingInlineEnd: token.paddingXS,
        textAlign: 'end',
        verticalAlign: 'middle',
      },

      '&-cell-container': {
        padding: 0,
      },

      '&-cell': {
        display: 'block',
        width: token.cellSize,
        height: token.cellSize,
        border: 0,
        padding: 0,
        borderRadius: token.cellRadius,
        backgroundColor: token.emptyCellColor,
        cursor: 'default',
        outline: 'none',
        font: 'inherit',
        transition: `background-color ${token.motionDurationMid}`,

        '&[data-level="1"]': { backgroundColor: token.minimumColor },
        ...defaultLevelStyle,
        '&[data-empty="true"]': {
          backgroundColor: token.emptyCellColor,
        },
        '&[type="button"]': {
          cursor: 'pointer',
        },
        '&:focus-visible': {
          outline: `${unit(token.lineWidthBold)} solid ${token.focusOutlineColor}`,
          outlineOffset: token.lineWidthBold,
        },
      },

      '&-small &-cell': {
        width: token.cellSizeSM,
        height: token.cellSizeSM,
      },

      '&-large &-cell': {
        width: token.cellSizeLG,
        height: token.cellSizeLG,
      },

      '&-footer': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: token.marginSM,
        marginBlockStart: token.marginXS,
      },

      '&-indicator': {
        // 没有 footer 内容时不再渲染占位节点，靠 auto 外边距把指示器推到行尾。
        marginInlineStart: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: token.marginXXS,
        color: token.indicatorTextColor,
        fontSize: token.labelFontSize,
      },

      '&-indicator-colors': {
        display: 'flex',
        gap: token.marginXXS,
      },

      '&-indicator-color': {
        width: token.cellSize,
        height: token.cellSize,
        borderRadius: token.cellRadius,
        backgroundColor: token.emptyCellColor,

        '&[data-level="1"]': { backgroundColor: token.minimumColor },
        ...defaultLevelStyle,
      },

      ...themeStyles,
    },
  }
}

export default genStyleHooks('Heatmap', genHeatmapStyle, prepareComponentToken)
