export interface ComponentToken {
  /**
   * @desc 单个标签的最大宽度，超出显示省略号。
   * @descEN Max width of a single tag; overflowing text is truncated with an ellipsis.
   */
  tagMaxWidth: number
  /**
   * @desc 维度列表的最小宽度。
   * @descEN Min width of the dimension list.
   */
  popupListMinWidth: number
  /**
   * @desc 值编辑面板的最小宽度。
   * @descEN Min width of the value panel.
   */
  panelMinWidth: number
  /**
   * @desc 维度分组标题的文字颜色。
   * @descEN Text color of dimension group titles.
   */
  groupTitleColor: string
}

export function prepareComponentToken(token: any): ComponentToken {
  return {
    tagMaxWidth: token.controlHeight * 8,
    popupListMinWidth: token.controlHeight * 5,
    panelMinWidth: token.controlHeight * 8,
    groupTitleColor: token.colorTextDescription,
  }
}
