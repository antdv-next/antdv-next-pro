interface Covers {
  [key: string]: {
    cover: string
    coverDark: string
  }
}

export const covers: Covers = {
  Scrollbar: {
    cover: '/component-overview/scrollbar.svg',
    coverDark: '/component-overview/scrollbar-dark.svg',
  },
}
