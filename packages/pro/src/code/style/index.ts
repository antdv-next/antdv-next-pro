import type { CSSObject } from '@antdv-next/cssinjs'
import type { FullToken, GenerateStyle } from 'antdv-next/theme/internal'
import { unit } from '@antdv-next/cssinjs'
import { genStyleHooks } from 'antdv-next/theme/internal'
import { prepareComponentToken } from './token'

export type { ComponentToken } from './token'

interface CodeStyleToken extends FullToken<'Code'> {}

const genCodeStyle: GenerateStyle<CodeStyleToken, CSSObject> = (token) => {
  const { componentCls } = token

  return {
    [componentCls]: {
      position: 'relative',
      boxSizing: 'border-box',
      color: token.colorText,
      fontSize: token.codeFontSize,
      lineHeight: token.codeLineHeight,
      background: token.bg,
      border: `${unit(token.lineWidth)} ${token.lineType} ${token.borderColor}`,
      borderRadius: token.radius,
      overflow: 'hidden',

      '&-rtl': {
        direction: 'rtl',
      },

      '&-header': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        columnGap: token.marginXXS,
        padding: token.headerPadding,
        borderBottom: `${unit(token.lineWidth)} ${token.lineType} ${token.borderColor}`,
        fontFamily: token.fontFamily,
      },

      '&-extra': {
        display: 'flex',
        alignItems: 'center',
        columnGap: token.marginXXS,
        minWidth: 0,
      },

      // 代码本身不镜像：RTL 下只镜像头部，行号列和代码保持从左到右。
      '&-pre': {
        direction: 'ltr',
        textAlign: 'start',
        margin: 0,
        paddingBlock: token.codePadding,
        paddingInline: 0,
        overflow: 'auto',
        fontFamily: token.codeFontFamily,
        fontSize: 'inherit',
        lineHeight: 'inherit',
        background: 'transparent',
        border: 0,
        borderRadius: 0,
        tabSize: 2,

        '&:focus-visible': {
          outline: `${unit(token.lineWidthFocus)} solid ${token.colorPrimaryBorder}`,
          outlineOffset: `calc(${unit(token.lineWidthFocus)} * -1)`,
        },
      },

      '&-code': {
        display: 'block',
        // 不换行时让每一行和最长的那一行一样宽，横向滚动后增删行的背景不会断。
        width: 'max-content',
        minWidth: '100%',
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
        fontFamily: 'inherit',
        fontSize: 'inherit',
        background: 'transparent',
        border: 0,
        borderRadius: 0,
      },

      '&-line': {
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        // 空行没有任何文本节点，靠最小高度撑出一行。
        minHeight: `calc(${token.codeLineHeight} * 1em)`,
        paddingInline: token.codePadding,

        '&-added': {
          background: token.addedBg,
        },

        '&-removed': {
          background: token.removedBg,
        },
      },

      '&-line-number': {
        flex: 'none',
        boxSizing: 'content-box',
        minWidth: token.lineNumberMinWidth,
        paddingInlineEnd: token.codePadding,
        color: token.lineNumberColor,
        textAlign: 'end',
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
        userSelect: 'none',
      },

      '&-marker': {
        flex: 'none',
        width: '1ch',
        marginInlineEnd: '1ch',
        textAlign: 'center',
        whiteSpace: 'pre',
        userSelect: 'none',
      },

      [`&-line-added ${componentCls}-marker`]: {
        color: token.addedMarkerColor,
      },

      [`&-line-removed ${componentCls}-marker`]: {
        color: token.removedMarkerColor,
      },

      // 只给读屏器的 Diff 状态文本。
      '&-sr-only': {
        position: 'absolute',
        width: 1,
        height: 1,
        margin: -1,
        padding: 0,
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
        userSelect: 'none',
      },

      '&-line-content': {
        flex: 'auto',
        minWidth: 0,
        whiteSpace: 'pre',
      },

      // token 颜色由高亮器给出，通过两个 CSS 变量传进来，切换明暗时不用重新分词。
      // 没有颜色的 token 不设置变量，`color` 在计算值阶段失效并回退为继承。
      '&-token': {
        color: 'var(--ant-code-c)',
      },

      [`&-dark ${componentCls}-token`]: {
        color: 'var(--ant-code-c-dark, var(--ant-code-c))',
      },

      '&-word-wrap': {
        [`${componentCls}-code`]: {
          width: 'auto',
        },

        [`${componentCls}-line-content`]: {
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
        },
      },
    },
  }
}

export default genStyleHooks('Code', genCodeStyle, prepareComponentToken, {
  // 行高是无单位的倍数。CSS 变量模式下不声明的话会被补上 `px`，行高变成 1.57px。
  unitless: {
    codeLineHeight: true,
  },
})
