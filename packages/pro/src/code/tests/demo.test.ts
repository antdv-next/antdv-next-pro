import type { CodeHighlighter } from '../types'
import { vi } from 'vitest'
import demoTest from '/@tests/shared/demoTest'

// demo 里用的是真实的 Shiki 适配器，语言是异步加载的。快照只记录挂载时的纯文本首帧，
// 这里换成一个永远加载不完的高亮器，避免测试结束后还有动态 import 在跑。
vi.mock('@antdv-next/pro/code/shiki', () => ({
  createShikiCodeHighlighter: (): CodeHighlighter => ({
    hasLanguage: () => false,
    loadLanguage: () => new Promise<boolean>(() => {}),
    tokenize: () => [],
  }),
}))

demoTest('code')
