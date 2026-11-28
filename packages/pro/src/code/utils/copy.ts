import type { CodeLine } from './diff'

export interface GetCopyTextOptions {
  /** 原始输入 */
  content: string
  /** Diff 解析成功时的行数据；普通模式或解析失败时不传 */
  diffLines?: CodeLine[]
  /** Diff 输入是否以换行符结尾 */
  trailingNewline?: boolean
}

/**
 * 生成复制文本，只依赖行数据，不读 DOM。
 *
 * - 普通模式（以及 Diff 解析失败回退为纯文本时）：原样返回输入；
 * - Diff 模式：只保留未变化行和新增行的源码，用 `\n` 连接；原文以换行结尾的，结果也补一个换行。
 */
export function getCopyText({ content, diffLines, trailingNewline }: GetCopyTextOptions): string {
  if (!diffLines)
    return content

  const kept = diffLines.filter(line => line.type !== 'removed')
  if (kept.length === 0)
    return ''

  const text = kept.map(line => line.content).join('\n')
  return trailingNewline ? `${text}\n` : text
}
