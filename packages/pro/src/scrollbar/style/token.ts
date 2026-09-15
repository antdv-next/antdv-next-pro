export interface ComponentToken {
  /**
   * @desc 轨道背景色。
   * @descEN Background color of the scrollbar track.
   */
  trackBg: string
  /**
   * @desc 滑块背景色。
   * @descEN Background color of the scrollbar thumb.
   */
  thumbBg: string
  /**
   * @desc 滑块悬浮背景色。
   * @descEN Background color of the scrollbar thumb on hover.
   */
  thumbHoverBg: string
  /**
   * @desc 滑块激活背景色。
   * @descEN Background color of the scrollbar thumb while dragging.
   */
  thumbActiveBg: string
  /**
   * @desc 滚动条尺寸。
   * @descEN Width or height of the scrollbar track.
   */
  size: number
  /**
   * @desc 圆角。
   * @descEN Border radius of the scrollbar track and thumb.
   */
  radius: number
  /**
   * @desc 内缩距离。
   * @descEN Inset between the scrollbar track and its container edge.
   */
  inset: number
}

/**
 * Default track size, in px.
 *
 * Shared by `prepareComponentToken` (which feeds the CSS) and the component
 * (which needs the same number in the thumb geometry).
 *
 * Note this cannot be read back off a design token the way `inset` can: `size`
 * is a Scrollbar *component* token, while `GlobalToken` carries its own,
 * unrelated `size` (16 in the default theme), so a token lookup would silently
 * return the wrong number.
 */
export const DEFAULT_SCROLLBAR_SIZE = 8

/**
 * Resolve the track inset from a design token.
 *
 * Exported because the JS geometry in `useScrollbarState` has to agree with the
 * CSS `inset` applied to the track in `style/index.ts`. Both read the value
 * through this single helper so they cannot drift apart.
 */
export function resolveScrollbarInset(token: any): number {
  return token?.paddingXXS ?? 0
}

export function prepareComponentToken(token: any): ComponentToken {
  return {
    trackBg: token.colorFillTertiary,
    thumbBg: token.colorTextTertiary,
    thumbHoverBg: token.colorTextSecondary,
    thumbActiveBg: token.colorText,
    size: DEFAULT_SCROLLBAR_SIZE,
    radius: token.borderRadiusSM,
    inset: resolveScrollbarInset(token),
  }
}
