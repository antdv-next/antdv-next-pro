import type MarkdownIt from 'markdown-it'
import type StateCore from 'markdown-it/lib/rules_core/state_core.mjs'

export function tablePlugin(md: MarkdownIt) {
  md.core.ruler.push('table_api_attribute', (state: StateCore) => {
    const tokens = state.tokens
    let inApiSection = false

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]

      // 检测 ## 标题
      if (token.type === 'heading_open' && token.tag === 'h2') {
        // 获取标题内容（下一个 token 是 inline）
        const inlineToken = tokens[i + 1]
        if (inlineToken && inlineToken.type === 'inline') {
          const headingText = inlineToken.content.trim().toLowerCase()
          // 检查是否是 Api 标题（支持 Api、API、api 等）
          if (headingText === 'api') {
            inApiSection = true
          }
          else {
            // 遇到其他 ## 标题，结束 Api 区域
            inApiSection = false
          }
        }
      }

      // 如果在 Api 区域内，给 table 添加类名
      if (inApiSection && token.type === 'table_open') {
        const existingClass = token.attrGet('class') || ''
        const newClass = existingClass ? `${existingClass} component-table-api` : 'component-table-api'
        token.attrSet('class', newClass)
      }
    }

    return true
  })
}
