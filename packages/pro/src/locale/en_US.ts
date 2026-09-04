import type { ProLocale } from './types'
import locale from 'antdv-next/locale/en_US'

// 原地扩展：保持与 antdv-next locale 的引用一致（locale.test.ts 有引用校验）
const proLocale = locale as ProLocale
proLocale.InputTag = {
  clear: 'Clear',
  showMore: 'Show all tags',
}

export default proLocale
