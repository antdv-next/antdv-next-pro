export interface ComponentToken {
  /**
   * @desc 命中片段的背景色，默认透明。
   * @descEN Background color of highlighted chunks, transparent by default.
   */
  highlightBg: string
  /**
   * @desc 命中片段的文字颜色，默认为品牌主色。
   * @descEN Text color of highlighted chunks, the brand primary color by default.
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
    // 默认外观保持克制：只把命中文字变成品牌主色，不加背景。
    highlightBg: 'transparent',
    highlightColor: token.colorPrimary,
    highlightFontWeight: 'inherit',
    highlightPaddingInline: 0,
    highlightBorderRadius: token.borderRadiusXS,
  }
}
