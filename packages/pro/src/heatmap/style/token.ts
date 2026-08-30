export interface ComponentToken {
  /**
   * @desc 无数据单元格颜色。
   * @descEN Color of a cell without data.
   */
  emptyCellColor: string
  /**
   * @desc 最低有效数值颜色。
   * @descEN Color of the minimum valid value.
   */
  minimumColor: string
  /**
   * @desc 默认活跃颜色等级。
   * @descEN Default active color scale.
   */
  colorScale: string[]
  /**
   * @desc 小尺寸单元格边长。
   * @descEN Small cell size.
   */
  cellSizeSM: number
  /**
   * @desc 默认单元格边长。
   * @descEN Default cell size.
   */
  cellSize: number
  /**
   * @desc 大尺寸单元格边长。
   * @descEN Large cell size.
   */
  cellSizeLG: number
  /**
   * @desc 单元格圆角。
   * @descEN Cell border radius.
   */
  cellRadius: number
  /**
   * @desc 标签颜色。
   * @descEN Label color.
   */
  labelColor: string
  /**
   * @desc 标签字号。
   * @descEN Label font size.
   */
  labelFontSize: number
  /**
   * @desc 标签行高。
   * @descEN Label line height.
   */
  labelLineHeight: number
  /**
   * @desc 指示器文字颜色。
   * @descEN Indicator text color.
   */
  indicatorTextColor: string
  /**
   * @desc 聚焦轮廓颜色。
   * @descEN Focus outline color.
   */
  focusOutlineColor: string
}

export function prepareComponentToken(token: any): ComponentToken {
  return {
    emptyCellColor: token.colorFillTertiary,
    minimumColor: token.colorFillSecondary,
    colorScale: ['#9be9a8', '#40c463', '#30a14e', '#216e39'],
    cellSizeSM: 12,
    cellSize: 14,
    cellSizeLG: 16,
    cellRadius: token.borderRadiusSM,
    labelColor: token.colorTextSecondary,
    labelFontSize: token.fontSizeSM,
    labelLineHeight: token.fontSizeSM * token.lineHeightSM,
    indicatorTextColor: token.colorTextSecondary,
    focusOutlineColor: token.colorPrimary,
  }
}
