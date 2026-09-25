export interface ComponentToken {
  /**
   * @desc 头像边长，同时决定嵌套评论的缩进基准。
   * @descEN Avatar size, also the indent base of nested comments.
   */
  avatarSize: number
  /**
   * @desc 头像与正文的间距，以及正文内部各区块的纵向间距。
   * @descEN Gap between the avatar and the content, and between content blocks.
   */
  contentGap: number
  /**
   * @desc 评论操作之间的间距。
   * @descEN Gap between comment actions.
   */
  actionGap: number
  /**
   * @desc 作者文字颜色。
   * @descEN Author text color.
   */
  authorColor: string
  /**
   * @desc 时间文字颜色。
   * @descEN Datetime text color.
   */
  datetimeColor: string
  /**
   * @desc 正文文字颜色。
   * @descEN Content text color.
   */
  bodyColor: string
  /**
   * @desc 操作文字颜色。
   * @descEN Action text color.
   */
  actionColor: string
}

export function prepareComponentToken(token: any): ComponentToken {
  return {
    avatarSize: token.controlHeight,
    contentGap: token.marginSM,
    actionGap: token.marginXS,
    authorColor: token.colorText,
    datetimeColor: token.colorTextTertiary,
    bodyColor: token.colorText,
    actionColor: token.colorTextTertiary,
  }
}
