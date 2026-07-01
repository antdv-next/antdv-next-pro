export interface ComponentToken {
  trackBg: string
  thumbBg: string
  thumbHoverBg: string
  thumbActiveBg: string
  size: number
  radius: number
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
