export interface ComponentToken {
  /**
   * @desc 容器背景色。
   * @descEN Background color of the container.
   */
  containerBg: string
  /**
   * @desc 容器边框颜色。
   * @descEN Border color of the container.
   */
  containerBorderColor: string
  /**
   * @desc 面板内边距。
   * @descEN Padding of the panel.
   */
  panelPadding: number
  /**
   * @desc 字段编辑区背景色。
   * @descEN Background color of the field editor.
   */
  fieldBg: string
  /**
   * @desc 字段页签激活背景色。
   * @descEN Background color of the active field tab.
   */
  fieldActiveBg: string
  /**
   * @desc 预览区背景色。
   * @descEN Background color of the preview area.
   */
  previewBg: string
  /**
   * @desc 错误文本颜色。
   * @descEN Text color of validation errors.
   */
  errorColor: string
  /**
   * @desc 字段区间距。
   * @descEN Gap between field sections.
   */
  fieldGap: number
  /**
   * @desc 字段页签高度。
   * @descEN Height of the field tab.
   */
  fieldTabHeight: number
  /**
   * @desc 字段页签水平内边距。
   * @descEN Horizontal padding of the field tab.
   */
  fieldTabPaddingInline: number
  /**
   * @desc 字段面板内边距。
   * @descEN Padding of the field panel.
   */
  fieldPanelPadding: number
}

export function prepareComponentToken(token: any): ComponentToken {
  return {
    containerBg: token.colorBgContainer,
    containerBorderColor: token.colorBorderSecondary,
    panelPadding: token.padding,
    fieldBg: token.colorBgContainer,
    fieldActiveBg: token.controlItemBgActive,
    previewBg: token.colorFillTertiary,
    errorColor: token.colorError,
    fieldGap: token.marginXS,
    fieldTabHeight: token.controlHeight,
    fieldTabPaddingInline: token.paddingSM,
    fieldPanelPadding: token.paddingSM,
  }
}
