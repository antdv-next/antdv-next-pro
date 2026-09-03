import type { CSSObject } from '@antdv-next/cssinjs'
import type { FullToken, GenerateStyle } from 'antdv-next/theme/internal'
import type { HeatmapColorScale } from '../types'
import { genStyleHooks } from 'antdv-next/theme/internal'
import { HEATMAP_COLOR_THEMES, isHeatmapColorScale } from '../types'
import { prepareComponentToken } from './token'

export type { ComponentToken } from './token'

interface HeatmapToken extends FullToken<'Heatmap'> {
  emptyCellColor: string
  minimumColor: string
  colorScale: HeatmapColorScale
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

const genHeatmapStyle: GenerateStyle<HeatmapToken, CSSObject> = (token) => {
  const { componentCls } = token
  // CSS variables cannot represent color arrays, so use the default scale while rendering CSS-variable styles.
  const colorScale = isHeatmapColorScale(token.colorScale)
    ? token.colorScale
    : HEATMAP_COLOR_THEMES.green

  if (!isHeatmapColorScale(token.colorScale) && import.meta.env?.DEV) {
    console.warn('[Heatmap] `colorScale` token must contain four non-empty color strings. Falling back to the default color scale.')
  }

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
        '&[data-level="2"]': { backgroundColor: colorScale[0] },
        '&[data-level="3"]': { backgroundColor: colorScale[1] },
        '&[data-level="4"]': { backgroundColor: colorScale[2] },
        '&[data-level="5"]': { backgroundColor: colorScale[3] },
        '&[data-empty="true"]': {
          backgroundColor: token.emptyCellColor,
        },
        '&[type="button"]': {
          cursor: 'pointer',
        },
        '&:focus-visible': {
          outline: `2px solid ${token.focusOutlineColor}`,
          outlineOffset: 2,
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
        marginTop: token.marginXS,
      },

      '&-indicator': {
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
        '&[data-level="2"]': { backgroundColor: colorScale[0] },
        '&[data-level="3"]': { backgroundColor: colorScale[1] },
        '&[data-level="4"]': { backgroundColor: colorScale[2] },
        '&[data-level="5"]': { backgroundColor: colorScale[3] },
      },
    },
  }
}

export default genStyleHooks('Heatmap', genHeatmapStyle, prepareComponentToken)
