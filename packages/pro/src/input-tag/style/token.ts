export interface ComponentToken {
  /**
   * @desc 标签之间的间距。
   * @descEN Gap between tags.
   */
  tagGap: number
  /**
   * @desc 内部编辑器的最小宽度。
   * @descEN Minimum width of the internal editor.
   */
  inputMinWidth: number
}

export function prepareComponentToken(token: any): ComponentToken {
  return {
    tagGap: token.marginXXS,
    inputMinWidth: 48,
  }
}
