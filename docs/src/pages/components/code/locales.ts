export const locales = {
  cn: {
    root: 'Code 根容器，承载背景、边框、圆角和代码字号。',
    header: '头部，放 extra 与复制按钮，只在有内容时渲染。',
    pre: '滚动容器 pre，代码固定从左到右排版。',
    line: '单个逻辑行；Diff 下新增行、删除行另有状态类名。',
    lineNumber: '行号单元格，Diff 下每行有旧、新两个。',
    marker: 'Diff 的 + / - 标记，只在 Diff 模式下渲染。',
    copy: '复制按钮。',
  },
  en: {
    root: 'Code root container with the background, border, radius and code font size.',
    header: 'Header holding extra and the copy button, rendered only when it has content.',
    pre: 'The pre scroll container; code is always laid out left to right.',
    line: 'A logical line; added and removed lines get extra state classes in diff mode.',
    lineNumber: 'Line number cell; two per line (old and new) in diff mode.',
    marker: 'The + / - diff marker, rendered only in diff mode.',
    copy: 'Copy button.',
  },
}
