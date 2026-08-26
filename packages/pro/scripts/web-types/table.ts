import type Token from 'markdown-it/lib/token.d.mts'
import { cleanText } from './utils'

export interface ParsedTable {
  headers: string[]
  rows: string[][]
  endIndex: number
}

export function parseTable(tokens: Token[], startIndex: number): ParsedTable {
  const headers: string[] = []
  const rows: string[][] = []
  let currentRow: string[] = []
  let inThead = false
  let endIndex = startIndex

  for (let i = startIndex; i < tokens.length; i++) {
    const token = tokens![i!]!
    if (token.type === 'thead_open')
      inThead = true
    if (token.type === 'thead_close')
      inThead = false
    if (token.type === 'tr_open')
      currentRow = []
    if (token.type === 'tr_close') {
      if (!inThead && currentRow.length > 0)
        rows.push(currentRow)
    }
    if (token.type === 'th_open' || token.type === 'td_open') {
      const contentToken = tokens[i + 1]
      const text = contentToken && contentToken.type === 'inline' ? cleanText(contentToken.content) : ''
      if (inThead)
        headers.push(text.toLowerCase())
      else currentRow.push(text)
    }
    if (token.type === 'table_close') {
      endIndex = i
      break
    }
  }
  return { headers, rows, endIndex }
}
