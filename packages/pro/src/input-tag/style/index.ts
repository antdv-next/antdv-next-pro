import type { CSSObject } from '@antdv-next/cssinjs'
import type { FullToken, GenerateStyle } from 'antdv-next/theme/internal'
import { unit } from '@antdv-next/cssinjs'
import { genStyleHooks } from 'antdv-next/theme/internal'
import { prepareComponentToken } from './token'

export type { ComponentToken } from './token'

interface InputTagToken extends FullToken<'InputTag'> {
  tagGap: number
  inputMinWidth: number
}

const genInputTagStyle: GenerateStyle<InputTagToken, CSSObject> = (token) => {
  const { componentCls, antCls, tagGap, inputMinWidth } = token

  return {
    [componentCls]: {
      height: 'auto',
      minHeight: token.controlHeight,
      alignItems: 'center',
      flexWrap: 'wrap',

      // 根节点就是 Input 的 affix wrapper，尺寸类名由它给出；最小高度要跟着尺寸走
      [`&${antCls}-input-affix-wrapper-sm`]: {
        minHeight: token.controlHeightSM,
      },

      [`&${antCls}-input-affix-wrapper-lg`]: {
        minHeight: token.controlHeightLG,
      },

      [`& ${antCls}-input-prefix`]: {
        display: 'contents',
        marginInlineEnd: 0,
      },

      [`& ${antCls}-input`]: {
        flex: '1 1 0',
        minWidth: inputMinWidth,
        width: 'auto',
        paddingInline: 0,
      },

      '&-content': {
        display: 'inline-flex',
        maxWidth: '100%',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: tagGap,
      },

      '&-rtl': {
        direction: 'rtl',
      },

      '&-tag': {
        marginInlineEnd: 0,
      },

      '&-tag-dragging': {
        opacity: token.opacityLoading,
      },

      // 插入位置指示：inline-start 半区 -> 目标前，inline-end 半区 -> 目标后
      '&-tag-drag-before': {
        boxShadow: `-2px 0 0 0 ${token.colorPrimary}`,
      },

      '&-tag-drag-after': {
        boxShadow: `2px 0 0 0 ${token.colorPrimary}`,
      },

      [`&-rtl ${componentCls}-tag-drag-before`]: {
        boxShadow: `2px 0 0 0 ${token.colorPrimary}`,
      },

      [`&-rtl ${componentCls}-tag-drag-after`]: {
        boxShadow: `-2px 0 0 0 ${token.colorPrimary}`,
      },

      '&-collapse': {
        marginInlineEnd: 0,
        cursor: 'pointer',
      },

      '&-collapse-content': {
        display: 'inline-flex',
        flexWrap: 'wrap',
        gap: tagGap,
      },

      '&-suffix': {
        display: 'inline-flex',
        alignItems: 'center',
        gap: token.marginXXS,
      },

      '&-clear': {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
        border: 0,
        lineHeight: 0,
        color: token.colorTextQuaternary,
        fontSize: token.fontSizeIcon,
        background: 'transparent',
        cursor: 'pointer',
        outline: 'none',
        transition: `color ${token.motionDurationSlow}`,

        '&:hover': {
          color: token.colorIcon,
        },

        '&:focus-visible': {
          color: token.colorIcon,
          borderRadius: token.borderRadiusSM,
          outline: `${unit(token.lineWidthFocus)} solid ${token.colorPrimaryBorder}`,
          outlineOffset: 1,
        },

        '&:active': {
          color: token.colorText,
        },
      },

      '&[data-readonly="true"]': {
        cursor: 'default',
      },
    },
  }
}

export default genStyleHooks('InputTag', genInputTagStyle, prepareComponentToken)
