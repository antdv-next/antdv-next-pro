import type { CSSObject } from '@antdv-next/cssinjs'
import type { FullToken, GenerateStyle } from 'antdv-next/theme/internal'
import { genStyleHooks } from 'antdv-next/theme/internal'
import { prepareComponentToken } from './token'

export type { ComponentToken } from './token'

interface HighlightToken extends FullToken<'Highlight'> {
  highlightBg: string
  highlightColor: string
  highlightFontWeight: number | string
  highlightPaddingInline: number
  highlightBorderRadius: number
}

const genHighlightStyle: GenerateStyle<HighlightToken, CSSObject> = (token) => {
  const { componentCls } = token

  return {
    // 根节点不设置字号、行高、颜色，继承宿主排版。
    [componentCls]: {
      '&-rtl': {
        direction: 'rtl',
      },

      [`${componentCls}-highlight`]: {
        // 显式写出背景与文字颜色，覆盖 UA 对 `<mark>` 的默认黄底黑字；默认是主色文字、透明背景。
        margin: 0,
        paddingBlock: 0,
        paddingInline: token.highlightPaddingInline,
        color: token.highlightColor,
        fontWeight: token.highlightFontWeight,
        backgroundColor: token.highlightBg,
        borderRadius: token.highlightBorderRadius,
        // 换行时每一段都保留完整的背景、内边距与圆角。
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone',
      },
    },
  }
}

// 行内文本组件：不重置字体，完全继承宿主排版（和 antdv-next 的 Input 等组件一致）。
// 字重是无单位数值，CSS 变量模式下不能补 px。
export default genStyleHooks('Highlight', genHighlightStyle, prepareComponentToken, {
  resetFont: false,
  unitless: { highlightFontWeight: true },
})
