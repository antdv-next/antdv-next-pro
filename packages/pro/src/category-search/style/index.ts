import type { CSSObject } from '@antdv-next/cssinjs'
import type { FullToken, GenerateStyle } from 'antdv-next/theme/internal'
import { unit } from '@antdv-next/cssinjs'
import { genStyleHooks } from 'antdv-next/theme/internal'
import { prepareComponentToken } from './token'

export type { ComponentToken } from './token'

interface CategorySearchToken extends FullToken<'CategorySearch'> {
  tagMaxWidth: number
  popupListMinWidth: number
  panelMinWidth: number
  groupTitleColor: string
}

const genSelectorStyle: GenerateStyle<CategorySearchToken, CSSObject> = (token) => {
  const { componentCls, antCls } = token

  return {
    [componentCls]: {
      position: 'relative',
      display: 'block',
      width: '100%',

      '&-rtl': {
        direction: 'rtl',
      },

      [`${componentCls}-selector`]: {
        height: 'auto',
        minHeight: token.controlHeight,
        alignItems: 'center',
        flexWrap: 'wrap',
        cursor: 'text',

        [`& ${antCls}-input-prefix`]: {
          display: 'contents',
          marginInlineEnd: 0,
        },

        [`& ${antCls}-input`]: {
          flex: '1 1 0',
          minWidth: token.controlHeight * 2,
          width: 'auto',
          paddingInline: 0,
        },
      },

      [`&${componentCls}-readonly-input ${antCls}-input`]: {
        cursor: 'pointer',
      },

      [`${componentCls}-prefix`]: {
        display: 'inline-flex',
        alignItems: 'center',
      },

      [`${componentCls}-content`]: {
        display: 'inline-flex',
        maxWidth: '100%',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: token.marginXXS,
        paddingInlineEnd: token.marginXXS,

        '&:empty': {
          display: 'none',
        },
      },

      [`${componentCls}-tag`]: {
        display: 'inline-flex',
        alignItems: 'center',
        maxWidth: token.tagMaxWidth,
        marginInlineEnd: 0,
        cursor: 'pointer',
      },

      [`${componentCls}-tag-text`]: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      },

      [`${componentCls}-tag-label`]: {
        color: token.colorTextSecondary,
      },

      [`${componentCls}-tag-static`]: {
        cursor: 'default',
      },

      [`${componentCls}-suffix`]: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: token.marginXXS,
      },

      [`${componentCls}-clear`]: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
        border: 0,
        color: token.colorTextTertiary,
        background: 'transparent',
        cursor: 'pointer',
        transition: `color ${token.motionDurationMid}`,

        '&:hover': {
          color: token.colorText,
        },
      },

      [`&${componentCls}-disabled`]: {
        [`${componentCls}-tag`]: {
          cursor: 'not-allowed',
        },
      },
    },
  }
}

const genPopupStyle: GenerateStyle<CategorySearchToken, CSSObject> = (token) => {
  const { componentCls, antCls } = token
  const popupCls = `${componentCls}-popup`
  const itemPadding = `${unit(token.paddingXXS)} ${unit(token.paddingSM)}`

  return {
    [popupCls]: {
      [`${antCls}-popover-container`]: {
        padding: token.paddingXXS,
      },

      [`${antCls}-popover-content`]: {
        padding: 0,
      },

      '&-rtl': {
        direction: 'rtl',
      },

      [`${popupCls}-list`]: {
        minWidth: token.popupListMinWidth,
        maxHeight: token.controlHeight * 8,
        margin: 0,
        padding: 0,
        overflowY: 'auto',
        listStyle: 'none',
        outline: 'none',
      },

      [`${popupCls}-group`]: {
        padding: itemPadding,
        color: token.groupTitleColor,
        fontSize: token.fontSizeSM,
        lineHeight: unit(token.controlHeightSM),
        cursor: 'default',
      },

      [`${popupCls}-item`]: {
        display: 'flex',
        alignItems: 'center',
        gap: token.marginXS,
        minHeight: token.controlHeight,
        padding: itemPadding,
        color: token.colorText,
        borderRadius: token.borderRadiusSM,
        cursor: 'pointer',
        transition: `background-color ${token.motionDurationMid}`,

        '&-grouped': {
          paddingInlineStart: token.calc(token.paddingSM).mul(2).equal(),
        },

        '&-content': {
          flex: 'auto',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        },

        '&-active': {
          backgroundColor: token.controlItemBgHover,
        },

        '&-selected': {
          fontWeight: token.fontWeightStrong,
          backgroundColor: token.controlItemBgActive,
        },

        '&-disabled': {
          color: token.colorTextDisabled,
          cursor: 'not-allowed',
          backgroundColor: 'transparent',
        },
      },

      [`${popupCls}-empty`]: {
        padding: token.paddingXS,
      },

      [`${popupCls}-panel`]: {
        display: 'flex',
        flexDirection: 'column',
        gap: token.marginXS,
        minWidth: token.panelMinWidth,
        padding: token.paddingXS,

        '&-select': {
          padding: 0,
        },
      },

      [`${popupCls}-panel-title`]: {
        color: token.colorTextSecondary,
        fontSize: token.fontSizeSM,
      },

      [`${popupCls}-panel-body`]: {
        display: 'flex',
        flexDirection: 'column',
        gap: token.marginXS,
        maxHeight: token.controlHeight * 8,
        overflowY: 'auto',
      },

      [`${popupCls}-range`]: {
        display: 'flex',
        alignItems: 'center',
        gap: token.marginXS,

        [`${antCls}-input-number`]: {
          flex: 1,
          width: 'auto',
        },
      },

      [`${popupCls}-footer`]: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: token.marginXS,
      },
    },
  }
}

const genCategorySearchStyle: GenerateStyle<CategorySearchToken, CSSObject[]> = token => [
  genSelectorStyle(token),
  genPopupStyle(token),
]

export default genStyleHooks('CategorySearch', genCategorySearchStyle as any, prepareComponentToken)
