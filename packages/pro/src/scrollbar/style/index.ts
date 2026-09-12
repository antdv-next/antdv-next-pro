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

const fadeMaskCommon: CSSObject = {
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
  maskSize: '100% 100%',
  WebkitMaskSize: '100% 100%',
}

const genScrollbarStyle: GenerateStyle<ScrollbarToken, CSSObject> = (token) => {
  const { componentCls, trackBg, thumbBg, thumbHoverBg, thumbActiveBg, size, radius, inset } = token
  const trackMotionCls = `${componentCls}-track-motion`
  const trackFadeMotionCls = `${componentCls}-track-fade-motion`

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

      [`&-container-fade-vertical`]: {
        ...fadeMaskCommon,
        '--scrollbar-fade-overflow-top': 'inherit',
        '--scrollbar-fade-overflow-bottom': 'inherit',
        '--scrollbar-fade-top': 'min(var(--scrollbar-fade-size), var(--scrollbar-fade-overflow-top, 0px))',
        '--scrollbar-fade-bottom': 'min(var(--scrollbar-fade-size), var(--scrollbar-fade-overflow-bottom, 0px))',
        maskImage: 'linear-gradient(to bottom, transparent 0, #000 var(--scrollbar-fade-top), #000 calc(100% - var(--scrollbar-fade-bottom)), transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 var(--scrollbar-fade-top), #000 calc(100% - var(--scrollbar-fade-bottom)), transparent 100%)',
      },

      [`&-container-fade-horizontal`]: {
        ...fadeMaskCommon,
        '--scrollbar-fade-overflow-left': 'inherit',
        '--scrollbar-fade-overflow-right': 'inherit',
        '--scrollbar-fade-left': 'min(var(--scrollbar-fade-size), var(--scrollbar-fade-overflow-left, 0px))',
        '--scrollbar-fade-right': 'min(var(--scrollbar-fade-size), var(--scrollbar-fade-overflow-right, 0px))',
        maskImage: 'linear-gradient(to right, transparent 0, #000 var(--scrollbar-fade-left), #000 calc(100% - var(--scrollbar-fade-right)), transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0, #000 var(--scrollbar-fade-left), #000 calc(100% - var(--scrollbar-fade-right)), transparent 100%)',
      },

      [`&-container-fade-both`]: {
        ...fadeMaskCommon,
        '--scrollbar-fade-overflow-top': 'inherit',
        '--scrollbar-fade-overflow-bottom': 'inherit',
        '--scrollbar-fade-overflow-left': 'inherit',
        '--scrollbar-fade-overflow-right': 'inherit',
        '--scrollbar-fade-top': 'min(var(--scrollbar-fade-size), var(--scrollbar-fade-overflow-top, 0px))',
        '--scrollbar-fade-bottom': 'min(var(--scrollbar-fade-size), var(--scrollbar-fade-overflow-bottom, 0px))',
        '--scrollbar-fade-left': 'min(var(--scrollbar-fade-size), var(--scrollbar-fade-overflow-left, 0px))',
        '--scrollbar-fade-right': 'min(var(--scrollbar-fade-size), var(--scrollbar-fade-overflow-right, 0px))',
        maskComposite: 'intersect',
        WebkitMaskComposite: 'source-in',
        maskImage: [
          'linear-gradient(to bottom, transparent 0, #000 var(--scrollbar-fade-top), #000 calc(100% - var(--scrollbar-fade-bottom)), transparent 100%)',
          'linear-gradient(to right, transparent 0, #000 var(--scrollbar-fade-left), #000 calc(100% - var(--scrollbar-fade-right)), transparent 100%)',
        ].join(', '),
        WebkitMaskImage: [
          'linear-gradient(to bottom, transparent 0, #000 var(--scrollbar-fade-top), #000 calc(100% - var(--scrollbar-fade-bottom)), transparent 100%)',
          'linear-gradient(to right, transparent 0, #000 var(--scrollbar-fade-left), #000 calc(100% - var(--scrollbar-fade-right)), transparent 100%)',
        ].join(', '),
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

      [`${trackMotionCls}-enter-start`]: {
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

      [`${trackFadeMotionCls}-enter-start`]: {
        opacity: 0,
      },

      [`
        ${trackFadeMotionCls}-enter-active,
        ${trackFadeMotionCls}-appear-active,
        ${trackFadeMotionCls}-leave-active
      `]: {
        transition: `opacity ${token.motionDurationMid} ${token.motionEaseOutCirc}`,
      },

      [`${trackFadeMotionCls}-leave`]: {
        opacity: 1,
      },

      [`${trackFadeMotionCls}-leave-active`]: {
        opacity: 0,
      },
    },
  }
}

export default genStyleHooks('Scrollbar', genScrollbarStyle, prepareComponentToken)
