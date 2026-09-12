import type { App, Plugin } from 'vue'
import type { ComponentToken as CronComponentToken } from './cron/style'
import type { ComponentToken as HeatmapComponentToken } from './heatmap/style'
import type { ComponentToken as InputTagComponentToken } from './input-tag/style'
import type { ComponentToken as ScrollbarComponentToken } from './scrollbar/style'
import * as components from './components'

declare module 'antdv-next/theme/interface/components' {
  interface ComponentTokenMap {
    Cron?: CronComponentToken
    Heatmap?: HeatmapComponentToken
    Scrollbar?: ScrollbarComponentToken
    InputTag?: InputTagComponentToken
  }
}

export * from './components'
export { default as ProConfigProvider } from './config-provider'
export type {
  CronConfig,
  HeatmapConfig,
  InputTagConfig,
  ProConfigProviderProps,
  ScrollbarConfig,
  ScrollbarFade,
  ScrollbarMotion,
  ScrollbarVisibility,
} from './config-provider'
export type {
  CronClassNamesType,
  CronEditorMode,
  CronEmits,
  CronError,
  CronErrorCode,
  CronFieldDescriptions,
  CronFieldMode,
  CronFieldModeDescription,
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
  HeatmapTooltipSlotProps,
} from './heatmap'
export type {
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
