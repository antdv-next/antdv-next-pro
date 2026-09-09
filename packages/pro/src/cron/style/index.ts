import type { CSSObject } from '@antdv-next/cssinjs'
import type { FullToken, GenerateStyle } from 'antdv-next/theme/internal'
import { genStyleHooks } from 'antdv-next/theme/internal'
import { prepareComponentToken } from './token'

export type { ComponentToken } from './token'

interface CronToken extends FullToken<'Cron'> {
  containerBg: string
  containerBorderColor: string
  panelPadding: number
  fieldBg: string
  fieldActiveBg: string
  previewBg: string
  errorColor: string
  fieldGap: number
  fieldTabHeight: number
  fieldTabPaddingInline: number
  fieldPanelPadding: number
}

const genCronStyle: GenerateStyle<CronToken, CSSObject> = token => ({
  [token.componentCls]: {
    boxSizing: 'border-box',
    display: 'grid',
    gap: token.fieldGap,
    padding: token.panelPadding,
    color: token.colorText,
    background: token.containerBg,
    border: `${token.lineWidth}px ${token.lineType} ${token.containerBorderColor}`,
    borderRadius: token.borderRadius,

    '&-status-error': {
      borderColor: token.colorError,
    },

    '&-status-warning': {
      borderColor: token.colorWarning,
    },

    '&-small': {
      padding: token.paddingSM,
      gap: token.marginXXS,
    },

    '&-large': {
      padding: token.paddingLG,
      gap: token.marginSM,
    },

    '&-fields': {
      display: 'grid',
      gridTemplateColumns: 'minmax(96px, 160px) minmax(0, 1fr)',
      gap: token.fieldGap,
      alignItems: 'stretch',
      background: token.containerBg,
      border: `${token.lineWidth}px ${token.lineType} ${token.containerBorderColor}`,
      borderRadius: token.borderRadiusSM,
    },

    '&-field': {
      display: 'grid',
      gap: token.marginXS,
      padding: token.fieldPanelPadding,
      background: token.fieldBg,
      borderRadius: token.borderRadiusSM,
      boxSizing: 'border-box',
      height: '100%',
    },

    '&-field-tabs': {
      display: 'grid',
      alignContent: 'start',
      gap: token.marginXXS,
      height: '100%',
      boxSizing: 'border-box',
      paddingBlock: token.paddingXS,
      borderInlineEnd: `${token.lineWidth}px ${token.lineType} ${token.colorBorderSecondary}`,
    },

    '&-field-tab': {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      minHeight: token.fieldTabHeight,
      minWidth: 0,
      paddingInline: token.fieldTabPaddingInline,
      margin: 0,
      fontSize: token.fontSize,
      textAlign: 'start',
      color: token.colorTextSecondary,
      cursor: 'pointer',
      borderRadius: token.borderRadiusSM,

      '&:hover': {
        color: token.colorPrimary,
        background: token.colorFillSecondary,
      },

      '&:focus-visible': {
        outline: `${token.lineWidthFocus}px ${token.lineType} ${token.colorPrimary}`,
        outlineOffset: -token.lineWidthFocus,
      },

      '&[aria-disabled="true"]': {
        color: token.colorTextDisabled,
        cursor: 'not-allowed',
      },
    },

    '&-field-tab-label': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },

    '&-field-tab-active': {
      background: token.fieldActiveBg,
      color: token.colorPrimary,
      borderInlineStart: `${token.lineWidthBold}px ${token.lineType} ${token.colorPrimary}`,
    },

    '&-field-control-summary': {
      color: token.colorTextSecondary,
      fontSize: token.fontSizeSM,
      lineHeight: token.lineHeight,
    },

    '&-editor': {
      display: 'flex',
      minWidth: 0,
      width: '100%',
      height: '100%',
    },

    [`&-editor ${token.componentCls}-field`]: {
      width: '100%',
      minWidth: 0,
    },

    '&-field-title': {
      fontWeight: token.fontWeightStrong,
    },

    '&-controls': {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: token.marginXS,
    },

    '&-presets': {
      display: 'flex',
      flexWrap: 'wrap',
      gap: token.marginXS,
    },

    '&-preview': {
      display: 'grid',
      gap: token.marginXXS,
      padding: token.paddingSM,
      color: token.colorTextSecondary,
      background: token.previewBg,
      borderRadius: token.borderRadiusSM,
    },

    '&-preview-list': {
      display: 'grid',
      gap: token.marginXXS,
      margin: 0,
      paddingInlineStart: token.padding,
    },

    '&-specific-select': {
      width: '100%',
    },

    [`&-small ${token.componentCls}-field-tab`]: {
      minHeight: token.controlHeightSM,
      paddingInline: token.paddingXS,
      fontSize: token.fontSizeSM,
    },

    [`&-small ${token.componentCls}-field`]: {
      gap: token.marginXXS,
      padding: token.paddingXS,
    },

    [`&-large ${token.componentCls}-field-tab`]: {
      minHeight: token.controlHeightLG,
      paddingInline: token.padding,
      fontSize: token.fontSizeLG,
    },

    [`&-large ${token.componentCls}-field`]: {
      gap: token.marginSM,
      padding: token.padding,
    },

    '&-error': {
      color: token.errorColor,
    },

    '&-rtl': {
      direction: 'rtl',
    },

    '@media (max-width: 480px)': {
      '&-fields': {
        gridTemplateColumns: '1fr',
      },

      '&-field-tabs': {
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      },

    },
  },
})

export default genStyleHooks('Cron', genCronStyle, prepareComponentToken)
