import type { App, SlotsType } from 'vue'
import type {
  HighlightClassNamesType,
  HighlightEmits,
  HighlightProps,
  HighlightRenderInfo,
  HighlightSemanticClassNames,
  HighlightSemanticStyles,
  HighlightSlots,
  HighlightStylesType,
} from './types'
import { clsx } from '@v-c/util'
import { useBaseConfig } from 'antdv-next/config-provider/context'
import useCSSVarCls from 'antdv-next/config-provider/hooks/useCSSVarCls'
import { computed, defineComponent, h, shallowRef, watch } from 'vue'
import { getSlotPropsFnRun } from '../_util'
import { useMergeSemantic } from '../_util/semantic'
import { useProComponentConfig } from '../config-provider'
import useStyle from './style'
import { getHighlightChunks, getKeywordsSignature } from './utils'

function omitClassAndStyle(attrs: Record<string, any>) {
  const nextAttrs = { ...attrs }
  delete nextAttrs.class
  delete nextAttrs.style
  return nextAttrs
}

const Highlight = defineComponent<
  HighlightProps,
  HighlightEmits,
  string,
  SlotsType<HighlightSlots>
>(
  (props, { attrs, slots, expose }) => {
    const { prefixCls, direction } = useBaseConfig('highlight', props)
    const proConfig = useProComponentConfig('highlight')
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)
    const rootRef = shallowRef<HTMLElement | null>(null)

    const mergedCaseSensitive = computed(() => props.caseSensitive ?? proConfig.value.caseSensitive ?? false)
    const mergedHighlightTag = computed(() => props.highlightTag ?? proConfig.value.highlightTag ?? 'mark')

    // 模板里写字面量数组时，每次 render 都是新引用。按内容签名比较，内容没变就不重新切分。
    const keywordsSignature = computed(() => getKeywordsSignature(props.keywords))
    const stableKeywords = shallowRef(props.keywords)
    watch(keywordsSignature, () => {
      stableKeywords.value = props.keywords
    }, { flush: 'sync' })

    const chunks = computed(() => getHighlightChunks(
      props.content ?? '',
      stableKeywords.value,
      { caseSensitive: mergedCaseSensitive.value, findChunks: props.findChunks },
    ))

    const mergedSemanticProps = computed<HighlightProps>(() => ({
      ...props,
      caseSensitive: mergedCaseSensitive.value,
      highlightTag: mergedHighlightTag.value,
    }))
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      HighlightSemanticClassNames,
      HighlightSemanticStyles,
      HighlightProps
    >(
      computed(() => [proConfig.value.classes as HighlightClassNamesType | undefined, props.classes]),
      computed(() => [proConfig.value.styles as HighlightStylesType | undefined, props.styles]),
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

    expose({
      get nativeElement() {
        return rootRef.value
      },
    })

    return () => {
      const prefix = prefixCls.value
      const HighlightTag = mergedHighlightTag.value as any
      const highlightCls = clsx(`${prefix}-highlight`, mergedClassNames.value.highlight)
      const highlightStyle = mergedStyles.value.highlight

      const children = chunks.value.map((chunk) => {
        if (!chunk.highlight)
          return chunk.text

        const info: HighlightRenderInfo = {
          text: chunk.text,
          index: chunk.index!,
          start: chunk.start,
          end: chunk.end,
          keyword: chunk.keyword,
        }
        // 插槽优先、prop 兜底；返回空节点时回退到原文本，命中的文字不会消失。
        const custom = getSlotPropsFnRun(
          { highlight: slots.highlight },
          { highlight: props.highlightRender },
          'highlight',
          true,
          info,
        )
        const content = custom ?? chunk.text

        const nodeProps = { key: `${chunk.start}-${chunk.end}`, class: highlightCls, style: highlightStyle }
        return typeof HighlightTag === 'string'
          ? h(HighlightTag, nodeProps, content)
          : h(HighlightTag, nodeProps, { default: () => content })
      })

      // 直接把片段作为 span 的子节点：用 JSX 的数组子节点会多包一层 Fragment（带两个空文本锚点）。
      return h('span', {
        ...omitClassAndStyle(attrs as Record<string, any>),
        ref: rootRef,
        class: mergedClassName.value,
        style: mergedStyle.value,
      }, children)
    }
  },
  {
    name: 'AHighlight',
    inheritAttrs: false,
  },
)

;(Highlight as any).install = (app: App) => {
  app.component(Highlight.name, Highlight)
}

export type {
  GetHighlightChunksOptions,
  HighlightChunk,
  HighlightClassNamesType,
  HighlightConfig,
  HighlightEmits,
  HighlightFindChunks,
  HighlightFindChunksParams,
  HighlightKeyword,
  HighlightProps,
  HighlightRange,
  HighlightRef,
  HighlightRenderInfo,
  HighlightSemanticClassNames,
  HighlightSemanticName,
  HighlightSemanticStyles,
  HighlightSlots,
  HighlightStylesType,
} from './types'
export { getHighlightChunks } from './utils'
export default Highlight
export { Highlight }
