import type { ProLocale } from './types'
import locale from 'antdv-next/locale/zh_CN'

// 原地扩展：保持与 antdv-next locale 的引用一致（locale.test.ts 有引用校验）
const proLocale = locale as ProLocale
proLocale.InputTag = {
  clear: '清空',
  showMore: '展开全部标签',
}

export default proLocale
