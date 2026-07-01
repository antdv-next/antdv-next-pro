import type { CSSObject } from '@antdv-next/cssinjs'
import type { FullToken, GenerateStyle } from 'antdv-next/theme/internal'
import { genStyleHooks } from 'antdv-next/theme/internal'
import { prepareComponentToken } from './token'

export type { ComponentToken } from './token'

interface ScrollbarToken extends FullToken<'Scrollbar'> {
  trackBg: string
  thumbBg: string
  thumbHoverBg: string
  thumbActiveBg: string
  size: number
  radius: number
  inset: number
}

const genScrollbarStyle: GenerateStyle<ScrollbarToken, CSSObject> = (token) => {
  const { componentCls, trackBg, thumbBg, thumbHoverBg, thumbActiveBg, size, radius, inset } = token
  const trackMotionCls = `${componentCls}-track-motion`

  return {
    [componentCls]: {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      boxSizing: 'border-box',

      '&-rtl': {
        direction: 'rtl',
      },

      '&-native': {
        [`${componentCls}-container`]: {
          scrollbarWidth: 'auto',
          msOverflowStyle: 'auto',

          '&::-webkit-scrollbar': {
            display: 'block',
          },
        },
      },

      [`&-container`]: {
        width: '100%',
        height: '100%',
        overflow: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',

        '&::-webkit-scrollbar': {
          display: 'none',
        },
      },

      [`&-content`]: {
        boxSizing: 'border-box',
        minWidth: '100%',
        minHeight: '100%',
        width: 'fit-content',
      },

      [`&-track`]: {
        position: 'absolute',
        background: trackBg,
        borderRadius: radius,

        '&-x': {
          left: inset,
          right: inset,
          bottom: inset,
          height: size,
        },

        '&-y': {
          top: inset,
          right: inset,
          bottom: inset,
          width: size,
        },
      },

      [`&-thumb`]: {
        position: 'absolute',
        top: 0,
        left: 0,
        background: thumbBg,
        borderRadius: radius,
        cursor: 'pointer',
        userSelect: 'none',

        '&:hover': {
          background: thumbHoverBg,
        },

        '&:active': {
          background: thumbActiveBg,
        },

        '&-x': {
          height: '100%',
        },

        '&-y': {
          width: '100%',
        },
      },

      [`
        ${trackMotionCls}-enter,
        ${trackMotionCls}-appear
      `]: {
        opacity: 0,
        transform: 'translate3d(100%, 0, 0)',
      },

      [`
        ${trackMotionCls}-enter-active,
        ${trackMotionCls}-appear-active,
        ${trackMotionCls}-leave-active
      `]: {
        transition: `transform ${token.motionDurationMid} ${token.motionEaseOutCirc}, opacity ${token.motionDurationMid} ${token.motionEaseOutCirc}`,
      },

      [`${trackMotionCls}-leave`]: {
        opacity: 1,
        transform: 'translate3d(0, 0, 0)',
      },

      [`${trackMotionCls}-leave-active`]: {
        opacity: 0,
        transform: 'translate3d(100%, 0, 0)',
      },
    },
  }
}

export default genStyleHooks('Scrollbar', genScrollbarStyle, prepareComponentToken)
