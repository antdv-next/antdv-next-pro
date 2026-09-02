import type { CSSObject } from '@antdv-next/cssinjs'
import type { FullToken, GenerateStyle } from 'antdv-next/theme/internal'
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

      '&-tag': {
        marginInlineEnd: 0,
      },

      '&-tag-dragging': {
        opacity: 0.5,
      },

      '&-tag-drag-over': {
        outline: `1px dashed ${token.colorPrimary}`,
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
        color: token.colorTextTertiary,
        background: 'transparent',
        cursor: 'pointer',

        '&:hover': {
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
