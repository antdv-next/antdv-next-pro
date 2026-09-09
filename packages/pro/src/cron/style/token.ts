export interface ComponentToken {
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

export function prepareComponentToken(token: any): ComponentToken {
  return {
    containerBg: token.colorBgContainer,
    containerBorderColor: token.colorBorderSecondary,
    panelPadding: token.padding,
    fieldBg: token.colorFillTertiary,
    fieldActiveBg: token.colorPrimaryBg,
    previewBg: token.colorFillTertiary,
    errorColor: token.colorError,
    fieldGap: token.marginXS,
    fieldTabHeight: token.controlHeight,
    fieldTabPaddingInline: token.paddingSM,
    fieldPanelPadding: token.paddingSM,
  }
}
