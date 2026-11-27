import type { App, Plugin } from 'vue'
import type { ComponentToken as CategorySearchComponentToken } from './category-search/style'
import type { ComponentToken as CommentComponentToken } from './comment/style'
import type { ComponentToken as CronComponentToken } from './cron/style'
import type { ComponentToken as HeatmapComponentToken } from './heatmap/style'
import type { ComponentToken as HighlightComponentToken } from './highlight/style'
import type { ComponentToken as InputTagComponentToken } from './input-tag/style'
import type { ComponentToken as ScrollbarComponentToken } from './scrollbar/style'
import * as components from './components'

declare module 'antdv-next/theme/interface/components' {
  interface ComponentTokenMap {
    CategorySearch?: CategorySearchComponentToken
    Comment?: CommentComponentToken
    Cron?: CronComponentToken
    Heatmap?: HeatmapComponentToken
    Highlight?: HighlightComponentToken
    Scrollbar?: ScrollbarComponentToken
    InputTag?: InputTagComponentToken
  }
}

export type {
  CategorySearchChangeInfo,
  CategorySearchChangeType,
  CategorySearchClassNamesType,
  CategorySearchEmits,
  CategorySearchFieldNames,
  CategorySearchLabelRenderInfo,
  CategorySearchOption,
  CategorySearchOptionGroup,
  CategorySearchOptionValue,
  CategorySearchPanelRenderInfo,
  CategorySearchPlacement,
  CategorySearchProps,
  CategorySearchRef,
  CategorySearchSemanticClassNames,
  CategorySearchSemanticName,
  CategorySearchSemanticStyles,
  CategorySearchSlots,
  CategorySearchStylesType,
  CategorySearchTagRenderInfo,
  CategorySearchType,
  CategorySearchValue,
  CategorySearchValueItem,
  CategorySearchValueOption,
} from './category-search'
export type {
  CommentAlign,
  CommentClassNamesType,
  CommentDatetimePlacement,
  CommentEmits,
  CommentProps,
  CommentSemanticClassNames,
  CommentSemanticName,
  CommentSemanticStyles,
  CommentSlots,
  CommentStylesType,
} from './comment'
export * from './components'
export { default as ProConfigProvider } from './config-provider'
export type {
  CategorySearchConfig,
  CommentConfig,
  CronConfig,
  HeatmapConfig,
  HighlightConfig,
  InputTagConfig,
  ProConfigProviderProps,
  ScrollbarConfig,
  ScrollbarFade,
  ScrollbarMotion,
  ScrollbarVisibility,
} from './config-provider'
export type {
  CronClassNamesType,
  CronDescriptionLocale,
  CronEditorMode,
  CronEmits,
  CronError,
  CronErrorCode,
  CronFieldMode,
  CronFieldName,
  CronFields,
  CronFieldSlotProps,
  CronFormat,
  CronLocale,
  CronOptions,
  CronPreset,
  CronPreviewResult,
  CronProps,
  CronSemanticClassNames,
  CronSemanticName,
  CronSemanticStyles,
  CronSize,
  CronSlots,
  CronStatus,
  CronStylesType,
  CronValidateResult,
  CronValidateStatus,
} from './cron'
export type {
  HeatmapClassNamesType,
  HeatmapColorScale,
  HeatmapColorTheme,
  HeatmapData,
  HeatmapDataItem,
  HeatmapEmits,
  HeatmapFirstDayOfWeek,
  HeatmapProps,
  HeatmapRange,
  HeatmapSemanticClassNames,
  HeatmapSemanticName,
  HeatmapSemanticStyles,
  HeatmapSize,
  HeatmapSlots,
  HeatmapStylesType,
  HeatmapTimeZone,
  HeatmapTooltipSlotProps,
} from './heatmap'
export type {
  GetHighlightChunksOptions,
  HighlightChunk,
  HighlightClassNamesType,
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
} from './highlight'
export type {
  InputTagAllowClearConfig,
  InputTagClassNamesType,
  InputTagEmits,
  InputTagInputProps,
  InputTagProps,
  InputTagRef,
  InputTagSemanticClassNames,
  InputTagSemanticName,
  InputTagSemanticStyles,
  InputTagStylesType,
  InputTagTagProps,
  InputTagValue,
} from './input-tag'
export type {
  ScrollbarClassNamesType,
  ScrollbarEmits,
  ScrollbarProps,
  ScrollbarRef,
  ScrollbarSemanticClassNames,
  ScrollbarSemanticName,
  ScrollbarSemanticStyles,
  ScrollbarSlots,
  ScrollbarStylesType,
} from './scrollbar'

export default {
  install(app: App) {
    Object.keys(components).forEach((key) => {
      const component = (components as any)[key]
      if (component && 'install' in component) {
        app.use(component)
      }
    })
  },
} as Plugin
