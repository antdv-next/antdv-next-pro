declare module 'antdv-next/theme/interface/components' {
  interface ComponentTokenMap {
    Code?: import('../code/style').ComponentToken
    Cron?: import('../cron/style').ComponentToken
    Scrollbar?: import('../scrollbar/style').ComponentToken
    Heatmap?: import('../heatmap/style').ComponentToken
    InputTag?: import('../input-tag/style').ComponentToken
  }
}

export {}
