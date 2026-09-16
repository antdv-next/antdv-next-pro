import type { App, SlotsType } from 'vue'
import type { CommentActionName, CommentClassNamesType, CommentEmits, CommentProps, CommentSemanticClassNames, CommentSemanticStyles, CommentSlots, CommentStylesType } from './types'
import {
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  DislikeOutlined,
  EditOutlined,
  EllipsisOutlined,
  FlagOutlined,
  HeartOutlined,
  LikeOutlined,
  MessageOutlined,
  RollbackOutlined,
  ShareAltOutlined,
  StarOutlined,
  WarningOutlined,
} from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import { Avatar, Flex, Space } from 'antdv-next'
import { useBaseConfig } from 'antdv-next/config-provider/context'
import useCSSVarCls from 'antdv-next/config-provider/hooks/useCSSVarCls'
import { computed, defineComponent } from 'vue'
import { useMergeSemantic } from '../_util/semantic'
import { useProComponentConfig } from '../config-provider'
import useStyle from './style'

const ACTION_ICONS: Record<CommentActionName, typeof LikeOutlined> = {
  reply: MessageOutlined,
  comment: MessageOutlined,
  like: LikeOutlined,
  dislike: DislikeOutlined,
  edit: EditOutlined,
  delete: DeleteOutlined,
  remove: DeleteOutlined,
  share: ShareAltOutlined,
  copy: CopyOutlined,
  flag: FlagOutlined,
  star: StarOutlined,
  favorite: HeartOutlined,
  close: CloseOutlined,
  cancel: CloseOutlined,
  more: EllipsisOutlined,
  ellipsis: EllipsisOutlined,
  back: RollbackOutlined,
  report: WarningOutlined,
}

/**
 * `actions` 里的字符串若命中内置动作名（大小写不敏感），渲染为**纯图标**；
 * 未命中的字符串按纯文本渲染。
 *
 * 这里刻意不渲染 `Button`：字符串条目本身无法携带回调，渲染成按钮等于给出
 * 「可点击」的错误承诺，还会让组件在纯展示前提下凭空制造可聚焦控件。
 * 名称由图标的 `aria-label`（`role="img"`）与容器的 `title` 承载，因此组件
 * 不需要内置一份需要翻译的动作词表 —— 可见文案与交互都留给 `#actions` 插槽。
 */
function resolveActionNode(action: string | unknown, prefix: string) {
  if (typeof action !== 'string') {
    return action
  }
  const Icon = ACTION_ICONS[action.toLowerCase() as CommentActionName]
  if (!Icon) {
    return action
  }
  return (
    <span class={`${prefix}-action`} title={action}>
      <Icon aria-label={action} />
    </span>
  )
}

function omitClassAndStyle(attrs: Record<string, any>) {
  const nextAttrs = { ...attrs }
  delete nextAttrs.class
  delete nextAttrs.style
  return nextAttrs
}

/**
 * 只有真正有内容的语义节点才渲染。
 *
 * 容器上有 `column-gap` / `row-gap`，空节点同样会占一份间距，
 * 所以这里必须按存在性渲染，而不是补空占位。
 */
function hasNode(value: unknown) {
  if (value == null || value === false)
    return false
  return !Array.isArray(value) || value.length > 0
}

const Comment = defineComponent<
  CommentProps,
  CommentEmits,
  string,
  SlotsType<CommentSlots>
>(
  (props, { attrs, slots }) => {
    const { prefixCls, direction } = useBaseConfig('comment', props)
    const proConfig = useProComponentConfig('comment')
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    const mergedDatetimePlacement = computed(
      () => props.datetimePlacement ?? proConfig.value.datetimePlacement ?? 'inline',
    )
    const mergedAlign = computed(() => props.align ?? proConfig.value.align ?? 'start')

    const mergedSemanticProps = computed<CommentProps>(() => ({
      ...props,
      datetimePlacement: mergedDatetimePlacement.value,
      align: mergedAlign.value,
    }))
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      CommentSemanticClassNames,
      CommentSemanticStyles,
      CommentProps
    >(
      computed(() => [proConfig.value.classes as CommentClassNamesType | undefined, props.classes]),
      computed(() => [proConfig.value.styles as CommentStylesType | undefined, props.styles]),
      computed(() => ({ props: mergedSemanticProps.value })),
    )

    const mergedClassName = computed(() => clsx(
      prefixCls.value,
      hashId.value,
      cssVarCls.value,
      rootCls.value,
      { [`${prefixCls.value}-rtl`]: direction.value === 'rtl' },
      proConfig.value.class,
      props.rootClass,
      mergedClassNames.value.root,
      (attrs as any).class,
    ))
    const mergedStyle = computed(() => [
      mergedStyles.value.root,
      proConfig.value.style,
      (attrs as any).style,
    ])

    return () => {
      const prefix = prefixCls.value
      const classNames = mergedClassNames.value
      const styles = mergedStyles.value
      const isBlock = mergedDatetimePlacement.value === 'block'
      const isEnd = mergedAlign.value === 'end'

      const authorContent = slots.author ? slots.author() : props.author
      const datetimeContent = slots.datetime ? slots.datetime() : props.datetime
      const bodyContent = slots.content ? slots.content() : props.content
      const avatarContent = slots.avatar
        ? slots.avatar()
        : props.avatar
          ? (
              <Avatar
                class={`${prefix}-avatar-inner`}
                src={props.avatar}
                alt={typeof props.author === 'string' ? props.author : undefined}
              />
            )
          : null

      const rawActions = slots.actions ? slots.actions() : props.actions
      const actionList = rawActions == null
        ? []
        : Array.isArray(rawActions) ? rawActions : [rawActions]
      const actionNodes = actionList.map(action => resolveActionNode(action, prefix))

      const hasAuthor = hasNode(authorContent)
      const hasDatetime = hasNode(datetimeContent)
      const hasHeader = hasAuthor || hasDatetime

      return (
        <div
          class={mergedClassName.value}
          style={mergedStyle.value}
          {...omitClassAndStyle(attrs as Record<string, any>)}
        >
          <Flex
            class={clsx(`${prefix}-inner`, classNames.inner)}
            style={styles.inner}
            align="flex-start"
          >
            {hasNode(avatarContent) && (
              <div class={clsx(`${prefix}-avatar`, classNames.avatar)} style={styles.avatar}>
                {avatarContent}
              </div>
            )}
            <Flex
              vertical
              class={clsx(`${prefix}-content`, classNames.content)}
              style={styles.content}
            >
              {hasHeader && (
                <Flex
                  class={clsx(`${prefix}-header`, classNames.header)}
                  style={styles.header}
                  vertical={isBlock}
                  align={isBlock ? (isEnd ? 'flex-end' : 'flex-start') : 'center'}
                  justify={isBlock ? undefined : (isEnd ? 'space-between' : 'flex-start')}
                >
                  {hasAuthor && (
                    <div class={clsx(`${prefix}-author`, classNames.author)} style={styles.author}>
                      {authorContent}
                    </div>
                  )}
                  {hasDatetime && (
                    <div class={clsx(`${prefix}-datetime`, classNames.datetime)} style={styles.datetime}>
                      {datetimeContent}
                    </div>
                  )}
                </Flex>
              )}
              {hasNode(bodyContent) && (
                <div class={clsx(`${prefix}-body`, classNames.body)} style={styles.body}>
                  {bodyContent}
                </div>
              )}
              {actionNodes.length > 0 && (
                <Space
                  class={clsx(`${prefix}-actions`, classNames.actions)}
                  style={styles.actions}
                  size={0}
                  wrap
                >
                  {actionNodes}
                </Space>
              )}
            </Flex>
          </Flex>
          {slots.default && (
            <Flex
              vertical
              class={clsx(`${prefix}-children`, classNames.children)}
              style={styles.children}
            >
              {slots.default()}
            </Flex>
          )}
        </div>
      )
    }
  },
  {
    name: 'AComment',
    inheritAttrs: false,
  },
)

;(Comment as any).install = (app: App) => {
  app.component(Comment.name, Comment)
}

export type {
  CommentActionName,
  CommentAlign,
  CommentClassNamesType,
  CommentConfig,
  CommentDatetimePlacement,
  CommentEmits,
  CommentProps,
  CommentSemanticClassNames,
  CommentSemanticName,
  CommentSemanticStyles,
  CommentSlots,
  CommentStylesType,
} from './types'
export default Comment
export { Comment }
