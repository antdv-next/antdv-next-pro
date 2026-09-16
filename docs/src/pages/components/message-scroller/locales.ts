export const locales = {
  cn: {
    root: '组件根元素，承载尺寸、定位与主题样式。',
    viewport: '原生滚动视口，负责真实的流式贴底滚动与手势判定。',
    content: '视口内容层，承载消息节点并参与尺寸观测。',
    rail: '消息导航导轨容器，承载全部消息刻度项。',
    railItem: '导轨中的单个消息刻度项，可聚焦并点击定位。',
    railTick: '导轨刻度条，按与当前项的距离衰减宽度。',
    preview: '单例预览卡片，在各激活项之间连续滑动。',
    backToBottom: '回到最新区域，仅在脱离跟随时出现，内部默认渲染回到最新按钮。',
  },
  en: {
    root: 'Root element with sizing, positioning, and themed styles.',
    viewport: 'Native scroll viewport that performs streaming follow and gesture detection.',
    content: 'Inner content layer that hosts message nodes and participates in size observation.',
    rail: 'Message navigation rail container holding every tick item.',
    railItem: 'A single rail item that can be focused and clicked to navigate.',
    railTick: 'Rail tick whose width is attenuated by distance to the active item.',
    preview: 'Singleton preview card that slides between active items.',
    backToBottom: 'Back-to-latest area, rendered only while detached and defaulting to a back-to-latest button.',
  },
}
