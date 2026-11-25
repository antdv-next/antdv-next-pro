export interface ComponentToken {
  /**
   * @desc 命中片段的背景色，默认与 Typography `mark` 一致。
   * @descEN Background color of highlighted chunks, same as Typography `mark` by default.
   */
  highlightBg: string
  /**
   * @desc 命中片段的文字颜色，默认继承。
   * @descEN Text color of highlighted chunks, inherited by default.
   */
  highlightColor: string
  /**
   * @desc 命中片段的字重，默认继承。
   * @descEN Font weight of highlighted chunks, inherited by default.
   */
  highlightFontWeight: number | string
  /**
   * @desc 命中片段的水平内边距。背景透明时请保持为 0，避免词内出现空隙。
   * @descEN Inline padding of highlighted chunks. Keep it 0 with a transparent background to avoid gaps inside words.
   */
  highlightPaddingInline: number
  /**
   * @desc 命中片段的圆角。
   * @descEN Border radius of highlighted chunks.
   */
  highlightBorderRadius: number
}

export function prepareComponentToken(token: any): ComponentToken {
  return {
    // Typography `mark` 使用 `@ant-design/colors` 的 `gold[2]`，对应色板 Token `gold3`。
    highlightBg: token.gold3,
    highlightColor: 'inherit',
    highlightFontWeight: 'inherit',
    highlightPaddingInline: 0,
    highlightBorderRadius: token.borderRadiusXS,
  }
}
