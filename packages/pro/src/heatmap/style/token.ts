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
   * @desc 第 1 档活跃颜色（数值略高于最低档）。
   * @descEN Active color of level 1, just above the minimum level.
   */
  activeColor1: string
  /**
   * @desc 第 2 档活跃颜色。
   * @descEN Active color of level 2.
   */
  activeColor2: string
  /**
   * @desc 第 3 档活跃颜色。
   * @descEN Active color of level 3.
   */
  activeColor3: string
  /**
   * @desc 第 4 档活跃颜色（最高档）。
   * @descEN Active color of level 4, the highest level.
   */
  activeColor4: string
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
    // 默认色阶从主色派生：跟随 `colorPrimary`，暗色算法下自动换成暗色色板。
    activeColor1: token.colorPrimaryBorder,
    activeColor2: token.colorPrimaryHover,
    activeColor3: token.colorPrimary,
    activeColor4: token.colorPrimaryActive,
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
