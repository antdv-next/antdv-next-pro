interface Covers {
  [key: string]: {
    cover: string
    coverDark: string
  }
}

export const covers: Covers = {
  ConfigProvider: {
    cover: 'https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*NVKORa7BCVwAAAAAAAAAAAAADrJ8AQ/original',
    coverDark: 'https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*YC4ERpGAddoAAAAAAAAAAAAADrJ8AQ/original',
  },
  Cron: {
    cover: '/component-overview/cron.svg',
    coverDark: '/component-overview/cron-dark.svg',
  },
  Heatmap: {
    cover: '/component-overview/heatmap.svg',
    coverDark: '/component-overview/heatmap-dark.svg',
  },
  InputTag: {
    cover: '/component-overview/input-tag.svg',
    coverDark: '/component-overview/input-tag-dark.svg',
  },
  Scrollbar: {
    cover: '/component-overview/scrollbar.svg',
    coverDark: '/component-overview/scrollbar-dark.svg',
  },
}
