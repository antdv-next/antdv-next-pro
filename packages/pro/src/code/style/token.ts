import { unit } from '@antdv-next/cssinjs'

export interface ComponentToken {
  /**
   * @desc 代码字体。
   * @descEN Font family of the code.
   */
  codeFontFamily: string
  /**
   * @desc 代码字号。
   * @descEN Font size of the code.
   */
  codeFontSize: number
  /**
   * @desc 代码行高。
   * @descEN Line height of the code.
   */
  codeLineHeight: number
  /**
   * @desc 容器背景色。
   * @descEN Background color of the container.
   */
  bg: string
  /**
   * @desc 容器边框颜色。
   * @descEN Border color of the container.
   */
  borderColor: string
  /**
   * @desc 容器圆角。
   * @descEN Border radius of the container.
   */
  radius: number
  /**
   * @desc 代码区域的内间距。
   * @descEN Padding of the code area.
   */
  codePadding: number
  /**
   * @desc 头部的内间距。
   * @descEN Padding of the header.
   */
  headerPadding: string
  /**
   * @desc 行号颜色。
   * @descEN Color of line numbers.
   */
  lineNumberColor: string
  /**
   * @desc 行号列的最小宽度。
   * @descEN Minimum width of the line number column.
   */
  lineNumberMinWidth: string
  /**
   * @desc 新增行的背景色。
   * @descEN Background color of added lines.
   */
  addedBg: string
  /**
   * @desc 新增行标记的颜色。
   * @descEN Color of the marker of added lines.
   */
  addedMarkerColor: string
  /**
   * @desc 删除行的背景色。
   * @descEN Background color of removed lines.
   */
  removedBg: string
  /**
   * @desc 删除行标记的颜色。
   * @descEN Color of the marker of removed lines.
   */
  removedMarkerColor: string
}

export function prepareComponentToken(token: any): ComponentToken {
  return {
    codeFontFamily: token.fontFamilyCode,
    codeFontSize: token.fontSizeSM,
    codeLineHeight: token.lineHeight,
    bg: token.colorFillQuaternary,
    borderColor: token.colorBorderSecondary,
    radius: token.borderRadiusLG,
    codePadding: token.paddingSM,
    headerPadding: `${unit(token.paddingXXS)} ${unit(token.paddingXS)}`,
    lineNumberColor: token.colorTextQuaternary,
    lineNumberMinWidth: `calc(${unit(token.fontSizeSM)} * 2)`,
    addedBg: token.colorSuccessBg,
    addedMarkerColor: token.colorSuccess,
    removedBg: token.colorErrorBg,
    removedMarkerColor: token.colorError,
  }
}
