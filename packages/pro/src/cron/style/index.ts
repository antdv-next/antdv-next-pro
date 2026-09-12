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
      alignContent: 'start',
      gap: token.marginXS,
      padding: token.fieldPanelPadding,
      background: token.fieldBg,
      borderRadius: token.borderRadiusSM,
      boxSizing: 'border-box',
      height: '100%',
    },

    '&-field-modes': {
      justifySelf: 'start',
      alignSelf: 'start',
      width: 'max-content',
      maxWidth: '100%',
      minHeight: token.controlHeight,
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
      transition: `color ${token.motionDurationMid}, background-color ${token.motionDurationMid}`,

      [`&:not(${token.componentCls}-field-tab-active):hover`]: {
        color: token.colorText,
        background: token.colorBgTextHover,
      },

      [`&:not(${token.componentCls}-field-tab-active):active`]: {
        background: token.controlItemBgActive,
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
      color: token.colorPrimary,
      background: token.fieldActiveBg,
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
      gap: token.marginXS,
      padding: token.paddingSM,
      background: token.previewBg,
      borderRadius: token.borderRadiusSM,
    },

    '&-preview-description': {
      color: token.colorText,
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
    },

    '&-preview-runs': {
      display: 'grid',
      gap: token.marginXXS,
    },

    '&-preview-run': {
      display: 'flex',
      alignItems: 'center',
      gap: token.marginXS,
      minWidth: 0,
      color: token.colorTextSecondary,
      fontSize: token.fontSizeSM,
      lineHeight: token.lineHeight,

      '&::before': {
        content: '""',
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: token.colorPrimary,
        flex: 'none',
      },
    },

    '&-preview-empty': {
      color: token.colorTextTertiary,
      fontSize: token.fontSizeSM,
      lineHeight: token.lineHeight,
    },

    '&-specific-select': {
      width: '100%',
    },

    '&-special': {
      display: 'grid',
      gap: token.marginXS,
      width: '100%',
    },

    '&-special-week': {
      minWidth: 120,
      maxWidth: 220,
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

    [`&-small ${token.componentCls}-field-modes`]: {
      minHeight: token.controlHeightSM,
    },

    [`&-small ${token.componentCls}-preview`]: {
      padding: token.paddingXS,
      gap: token.marginXXS,
    },

    [`&-small ${token.componentCls}-preview-description`]: {
      fontSize: token.fontSizeSM,
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

    [`&-large ${token.componentCls}-field-modes`]: {
      minHeight: token.controlHeightLG,
    },

    [`&-large ${token.componentCls}-preview`]: {
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

  [`html.dark ${token.componentCls}, [data-theme="dark"] ${token.componentCls}`]: {
    [`${token.componentCls}-field-tab:not(${token.componentCls}-field-tab-active)`]: {
      '&:hover': {
        color: token.colorTextLightSolid,
        background: 'transparent',
      },
      '&:active': {
        background: 'transparent',
      },
    },

    [`${token.componentCls}-field-tab-active`]: {
      color: token.colorTextLightSolid,
      background: token.colorPrimary,
    },
  },
})

export default genStyleHooks('Cron', genCronStyle, prepareComponentToken)
