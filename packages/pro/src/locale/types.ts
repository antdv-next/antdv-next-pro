import type { Locale as AntLocale } from 'antdv-next/locale/index'

export interface ProLocale extends AntLocale {
  InputTag?: {
    /** 清空按钮的 aria-label */
    clear?: string
    /** 折叠标签展开按钮的 aria-label */
    showMore?: string
  }
}
