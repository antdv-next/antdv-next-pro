export type CodeLineType = 'normal' | 'added' | 'removed'

export interface CodeLine {
  type: CodeLineType
  /** 去掉 Diff 行前缀之后的源码，不含换行符 */
  content: string
  /** 旧文本中的行号；新增行没有 */
  oldNumber?: number
  /** 新文本中的行号；删除行没有。普通模式下就是行号 */
  newNumber?: number
}

export interface ParsedCode {
  lines: CodeLine[]
  /** 输入是否以换行符结尾 */
  trailingNewline: boolean
}

export type ParseDiffResult
  = | ({ ok: true } & ParsedCode)
    | { ok: false, error: Error }

const LINE_BREAK = /\r\n|\r|\n/

/**
 * 按换行切分。输入末尾的换行符不额外产生一条空记录。
 */
function splitLines(content: string): { rows: string[], trailingNewline: boolean } {
  if (content === '')
    return { rows: [], trailingNewline: false }
  const rows = content.split(LINE_BREAK)
  const trailingNewline = rows[rows.length - 1] === ''
  if (trailingNewline)
    rows.pop()
  return { rows, trailingNewline }
}

/**
 * 普通模式：每个逻辑行一条记录，不解析任何前缀。
 */
export function parsePlain(content: string): ParsedCode {
  const { rows, trailingNewline } = splitLines(content)
  return {
    lines: rows.map((row, index) => ({ type: 'normal', content: row, newNumber: index + 1 })),
    trailingNewline,
  }
}

const PREFIX_TYPES: Record<string, CodeLineType> = {
  '+': 'added',
  '-': 'removed',
  ' ': 'normal',
}

/**
 * Diff 模式：每行首字符是状态标记（`+` 新增、`-` 删除、空格 未变化），其余是源码。
 *
 * 只要有一行不合法（裸空行，或首字符不是这三种），就整段失败，不做部分解析。
 * 空字符串合法，表示没有内容。
 */
export function parseDiff(content: string): ParseDiffResult {
  const { rows, trailingNewline } = splitLines(content)
  const lines: CodeLine[] = []
  let oldNumber = 0
  let newNumber = 0

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index]!
    const type = PREFIX_TYPES[row.charAt(0)]
    if (!type) {
      return {
        ok: false,
        error: new Error(
          row === ''
            ? `[Code] Invalid diff content: line ${index + 1} is empty. Every line must start with "+", "-" or a space.`
            : `[Code] Invalid diff content: line ${index + 1} starts with ${JSON.stringify(row.charAt(0))}. Every line must start with "+", "-" or a space.`,
        ),
      }
    }

    const line: CodeLine = { type, content: row.slice(1) }
    if (type !== 'added')
      line.oldNumber = ++oldNumber
    if (type !== 'removed')
      line.newNumber = ++newNumber
    lines.push(line)
  }

  return { ok: true, lines, trailingNewline }
}
