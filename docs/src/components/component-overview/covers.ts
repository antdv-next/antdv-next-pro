interface Covers {
  [key: string]: {
    cover: string
    coverDark: string
  }
}

export const covers: Covers = {
  Heatmap: {
    cover: '/component-overview/heatmap.svg',
    coverDark: '/component-overview/heatmap-dark.svg',
  },
  Scrollbar: {
    cover: '/component-overview/scrollbar.svg',
    coverDark: '/component-overview/scrollbar-dark.svg',
  },
}
