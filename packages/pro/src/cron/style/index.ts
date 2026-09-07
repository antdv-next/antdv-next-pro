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

    '&-fields': {
      display: 'grid',
      gap: token.fieldGap,
    },

    '&-field': {
      display: 'grid',
      gap: token.marginXS,
      padding: token.paddingSM,
      background: token.fieldBg,
      borderRadius: token.borderRadiusSM,
    },

    '&-field-tabs': {
      display: 'flex',
      flexWrap: 'wrap',
      gap: token.marginXXS,
    },

    '&-field-tab': {
      minWidth: token.controlHeightSM,
    },

    '&-field-tab-active': {
      background: token.fieldActiveBg,
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

    '&-error': {
      color: token.errorColor,
    },

    '&-rtl': {
      direction: 'rtl',
    },
  },
})

export default genStyleHooks('Cron', genCronStyle, prepareComponentToken)
