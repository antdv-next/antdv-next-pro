import type { App, SlotsType } from 'vue'
import type { CommentClassNamesType, CommentEmits, CommentProps, CommentSemanticClassNames, CommentSemanticStyles, CommentSlots, CommentStylesType } from './types'
import { clsx } from '@v-c/util'
import { Avatar, Flex, Space } from 'antdv-next'
import { useBaseConfig } from 'antdv-next/config-provider/context'
import useCSSVarCls from 'antdv-next/config-provider/hooks/useCSSVarCls'
import { computed, defineComponent } from 'vue'
import { useMergeSemantic } from '../_util/semantic'
import { useProComponentConfig } from '../config-provider'
import useStyle from './style'

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

      const actionsContent = slots.actions ? slots.actions() : null

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
              {hasNode(actionsContent) && (
                <Space
                  class={clsx(`${prefix}-actions`, classNames.actions)}
                  style={styles.actions}
                  size={0}
                  wrap
                >
                  {actionsContent}
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
