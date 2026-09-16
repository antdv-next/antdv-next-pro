import type { CSSObject } from '@antdv-next/cssinjs'
import type { FullToken, GenerateStyle } from 'antdv-next/theme/internal'
import { genStyleHooks } from 'antdv-next/theme/internal'
import { prepareComponentToken } from './token'

export type { ComponentToken } from './token'

interface CommentToken extends FullToken<'Comment'> {
  avatarSize: number
  contentGap: number
  actionGap: number
  authorColor: string
  datetimeColor: string
  bodyColor: string
  actionColor: string
}

const genCommentStyle: GenerateStyle<CommentToken, CSSObject> = (token) => {
  const { componentCls } = token
  // 组件 Token 在 CSS 变量模式下是 `var(--ant-comment-*)` 字符串，
  // 直接用 `+` 拼接会生成 `var(--a)var(--b)` 并被浏览器静默丢弃，必须交给 calc。
  const nestedIndent = `calc(${token.avatarSize} + ${token.contentGap})`

  return {
    [componentCls]: {
      display: 'flex',
      flexDirection: 'column',
      rowGap: token.contentGap,
      color: token.bodyColor,
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      wordBreak: 'break-word',

      '&-rtl': {
        direction: 'rtl',
      },

      // 以下三段容器由 Flex 负责 display / direction，这里只补 Token 化的间距。
      '&-inner': {
        columnGap: token.contentGap,
      },

      '&-content': {
        // 作为 inner 的 flex item，默认 `flex-grow: 0` 只会占内容宽度。
        // 必须显式撑满剩余宽度，否则 header 的 `align: 'end'` 只在内容宽度内生效，
        // 正文很短时看起来完全没有效果。
        flex: 'auto',
        minWidth: 0,
        rowGap: token.contentGap,
      },

      '&-header': {
        columnGap: token.contentGap,
      },

      '&-children': {
        // 逻辑属性，RTL 下自动镜像；基准是 root 左边缘。
        paddingInlineStart: nestedIndent,
        rowGap: token.contentGap,
      },

      '&-avatar': {
        flex: 'none',
        display: 'flex',
        alignItems: 'flex-start',
      },

      '&-author': {
        color: token.authorColor,
        fontWeight: token.fontWeightStrong,
        minWidth: 0,
      },

      '&-datetime': {
        color: token.datetimeColor,
        fontSize: token.fontSizeSM,
        whiteSpace: 'nowrap',
      },

      '&-body': {
        color: token.bodyColor,
      },

      '&-actions': {
        color: token.actionColor,
        columnGap: token.actionGap,
      },

      // 内置动作名的纯图标形态。它不是控件，所以没有 hover / focus 反馈，
      // 只保证与相邻文本基线对齐。
      '&-action': {
        display: 'inline-flex',
        alignItems: 'center',
      },
    },

    // 两个类名组合以提高特异性，稳定压过 Avatar 自身的尺寸样式。
    [`${componentCls}-avatar ${componentCls}-avatar-inner`]: {
      flex: 'none',
      width: token.avatarSize,
      height: token.avatarSize,
    },
  }
}

export default genStyleHooks('Comment', genCommentStyle, prepareComponentToken)
