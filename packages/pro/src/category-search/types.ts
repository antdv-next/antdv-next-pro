import type { SizeType } from 'antdv-next'
import type { Variant } from 'antdv-next/config-provider/context'
import type { CSSProperties } from 'vue'

type VueNode = any

/**
 * 维度的值类型，决定值编辑面板与值的结构。
 *
 * Value type of a dimension; decides the value editor and the shape of the value.
 */
export type CategorySearchType = 'select' | 'dateRange' | 'numberRange' | 'input' | 'custom'

export type CategorySearchOptionValue = string | number

/**
 * 候选值，结构与 Select 的 option 一致。
 *
 * Candidate value, same shape as a Select option.
 */
export interface CategorySearchValueOption {
  label?: VueNode
  value: CategorySearchOptionValue
  disabled?: boolean
  [key: string]: any
}

/**
 * 维度。
 *
 * Dimension (category).
 */
export interface CategorySearchOption {
  /** 维度名称 / Dimension name */
  label?: VueNode
  /** 维度标识，对应已选条件的 `key` / Dimension id, matches `key` of a selected item */
  value: CategorySearchOptionValue
  /**
   * 值类型 / Value type
   * @default 'select'
   */
  type?: CategorySearchType
  /** `type` 为 `select` 时的候选值 / Candidate values when `type` is `select` */
  children?: CategorySearchValueOption[]
  /**
   * `type` 为 `select` 时是否多选 / Whether `select` allows multiple values
   * @default false
   */
  multiple?: boolean
  /**
   * 生成的标签是否可删除 / Whether the generated tag can be removed
   * @default true
   */
  closable?: boolean
  disabled?: boolean
  /** 透传给值编辑控件（Checkbox.Group / RangePicker / InputNumber / Input）/ Props passed to the value editor */
  componentProps?: Record<string, any>
  [key: string]: any
}

/**
 * 维度分组，写法与 Select 的分组一致。
 *
 * Dimension group, same shape as a Select option group.
 */
export interface CategorySearchOptionGroup {
  label: VueNode
  key?: CategorySearchOptionValue
  options: CategorySearchOption[]
  [key: string]: any
}

export interface CategorySearchFieldNames {
  label?: string
  value?: string
  children?: string
  options?: string
}

/**
 * 一个已选条件。同一维度最多出现一次。
 *
 * A selected condition. Each dimension appears at most once.
 */
export interface CategorySearchValueItem {
  /** 对应维度的 `value` / The `value` of the dimension */
  key: CategorySearchOptionValue
  /** 由维度 `type` 决定的值 / Value whose shape depends on the dimension `type` */
  value: any
}

export type CategorySearchValue = CategorySearchValueItem[]

export type CategorySearchChangeType = 'add' | 'update' | 'remove' | 'clear'

export interface CategorySearchChangeInfo {
  type: CategorySearchChangeType
  /** 发生变化的维度；`clear` 时为空 / Changed dimension; empty for `clear` */
  option?: CategorySearchOption
  /** 变化后的条件；`remove` / `clear` 时为空 / Item after the change; empty for `remove` / `clear` */
  item?: CategorySearchValueItem
  /** 变化前的条件 / Item before the change */
  prevItem?: CategorySearchValueItem
}

export interface CategorySearchLabelRenderInfo {
  option: CategorySearchOption
  item: CategorySearchValueItem
}

export interface CategorySearchTagRenderInfo extends CategorySearchLabelRenderInfo {
  /** 默认渲染的标签内容 / Default tag content */
  label: VueNode
  closable: boolean
  onClose: (event?: MouseEvent) => void
}

export interface CategorySearchPanelRenderInfo {
  option: CategorySearchOption
  /** 面板里尚未提交的值 / Draft value in the panel */
  value: any
  setValue: (value: any) => void
  /** 提交当前值（可传入新值）/ Commit the draft (or the given value) */
  confirm: (value?: any) => void
  cancel: () => void
}

export interface CategorySearchSemanticClassNames {
  /** 根节点 / Root element */
  root?: string
  /** 前缀 / Prefix */
  prefix?: string
  /** 标签区域 / Tag area */
  content?: string
  /** 标签 / Tag */
  tag?: string
  /** 关键字输入框 / Keyword input */
  input?: string
  /** 后缀 / Suffix */
  suffix?: string
  /** 清空按钮 / Clear button */
  clear?: string
  popup?: {
    /** 浮层根节点 / Popup root */
    root?: string
    /** 维度列表 / Dimension list */
    list?: string
    /** 值编辑面板 / Value panel */
    panel?: string
  }
}

export interface CategorySearchSemanticStyles {
  root?: CSSProperties
  prefix?: CSSProperties
  content?: CSSProperties
  tag?: CSSProperties
  input?: CSSProperties
  suffix?: CSSProperties
  clear?: CSSProperties
  popup?: {
    root?: CSSProperties
    list?: CSSProperties
    panel?: CSSProperties
  }
}

export type CategorySearchSemanticName = Exclude<keyof CategorySearchSemanticClassNames, 'popup'>
// `popup` 是嵌套的语义节点（同 antdv-next Select），所以不套用只接受扁平结构的 SemanticClassNamesType。
export type CategorySearchClassNamesType
  = | Readonly<CategorySearchSemanticClassNames>
    | ((info: { props: CategorySearchProps }) => Readonly<CategorySearchSemanticClassNames>)
export type CategorySearchStylesType
  = | Readonly<CategorySearchSemanticStyles>
    | ((info: { props: CategorySearchProps }) => Readonly<CategorySearchSemanticStyles>)

export type CategorySearchPlacement = 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'

export interface CategorySearchProps {
  prefixCls?: string
  rootClass?: string
  /**
   * 可选维度，支持分组
   * @default []
   */
  options?: (CategorySearchOption | CategorySearchOptionGroup)[]
  /** 自定义 options 中 label / value / children / options 的字段名 */
  fieldNames?: CategorySearchFieldNames
  /** 已选条件（受控），`v-model:value` */
  value?: CategorySearchValue
  /** 初始已选条件 */
  defaultValue?: CategorySearchValue
  /** 关键字（受控），`v-model:searchValue` */
  searchValue?: string
  /** 初始关键字 */
  defaultSearchValue?: string
  /**
   * 是否允许输入关键字
   * @default true
   */
  showSearch?: boolean
  /** 占位文字，默认读取 locale */
  placeholder?: string
  /**
   * 是否显示清空按钮；清空时保留 `closable: false` 的条件
   * @default false
   */
  allowClear?: boolean | { clearIcon?: VueNode }
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean
  size?: SizeType
  variant?: Variant
  status?: 'error' | 'warning'
  /** 最多显示多少个标签，其余折叠 */
  maxTagCount?: number
  /** 标签值文字的最大长度，超出显示省略号 */
  maxTagTextLength?: number
  /** 折叠标签的内容 */
  maxTagPlaceholder?: VueNode | ((omittedValues: CategorySearchValueItem[]) => VueNode)
  /** 浮层是否展开（受控），`v-model:open` */
  open?: boolean
  /**
   * 浮层默认是否展开
   * @default false
   */
  defaultOpen?: boolean
  /**
   * 浮层位置
   * @default 'bottomLeft'
   */
  placement?: CategorySearchPlacement
  /** 浮层渲染的父节点 */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  /**
   * 浮层是否与输入框同宽；为数字时设置固定宽度
   * @default false
   */
  popupMatchSelectWidth?: boolean | number
  /** 自定义标签里值的显示 */
  labelRender?: (info: CategorySearchLabelRenderInfo) => VueNode
  /** 增、改、删、清空前调用，返回 `false` 或 reject 时取消变更 */
  beforeChange?: (info: CategorySearchChangeInfo) => boolean | void | Promise<boolean | void>
  /** 语义化 class，支持对象或函数 */
  classes?: CategorySearchClassNamesType
  /** 语义化 style，支持对象或函数 */
  styles?: CategorySearchStylesType
}

export interface CategorySearchEmits {
  'update:value': (value: CategorySearchValue) => void
  'change': (value: CategorySearchValue, info: CategorySearchChangeInfo) => void
  'update:searchValue': (value: string) => void
  'search': (searchValue: string, value: CategorySearchValue) => void
  'clear': () => void
  'update:open': (open: boolean) => void
  'openChange': (open: boolean) => void
  'focus': (event: FocusEvent) => void
  'blur': (event: FocusEvent) => void
  [key: string]: (...args: any[]) => void
}

export interface CategorySearchSlots {
  prefix?: () => any
  suffix?: () => any
  clearIcon?: () => any
  tag?: (info: CategorySearchTagRenderInfo) => any
  labelRender?: (info: CategorySearchLabelRenderInfo) => any
  optionRender?: (info: { option: CategorySearchOption }) => any
  panel?: (info: CategorySearchPanelRenderInfo) => any
  maxTagPlaceholder?: (info: { omittedValues: CategorySearchValueItem[] }) => any
  notFoundContent?: () => any
}

export interface CategorySearchRef {
  focus: (options?: FocusOptions) => void
  blur: () => void
  /** 打开浮层；传入维度 `value` 时直接打开该维度的值面板 */
  open: (optionValue?: CategorySearchOptionValue) => void
  nativeElement: HTMLElement | null
}

export interface CategorySearchConfig {
  allowClear?: CategorySearchProps['allowClear']
  showSearch?: boolean
  maxTagCount?: number
  variant?: Variant
  class?: string
  style?: CSSProperties
  classes?: CategorySearchClassNamesType
  styles?: CategorySearchStylesType
}
