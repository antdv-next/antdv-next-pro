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

export function prepareComponentToken(token: any): ComponentToken {
  return {
    trackBg: token.colorFillTertiary,
    thumbBg: token.colorTextTertiary,
    thumbHoverBg: token.colorTextSecondary,
    thumbActiveBg: token.colorText,
    size: 8,
    radius: token.borderRadiusSM,
    inset: token.paddingXXS,
  }
}
