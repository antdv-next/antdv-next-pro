export const locales = {
  cn: {
    root: '根元素，包含滚动容器的定位、圆角、边框和主题样式。',
    container: '原生滚动容器，负责真实的横向和纵向滚动行为。',
    content: '内容包装层，承载默认插槽内容，并参与内容尺寸变化的观测。',
    track: '滚动轨道通用层，承载横纵轴轨道的基础外观。',
    trackX: '横向滚动轨道，定位在容器底部，用于承载横向 thumb。',
    trackY: '纵向滚动轨道，定位在容器右侧，用于承载纵向 thumb。',
    thumb: '滚动 thumb 通用层，负责可拖拽的可视滚动块样式。',
    thumbX: '横向滚动 thumb，反映并控制横向滚动位置。',
    thumbY: '纵向滚动 thumb，反映并控制纵向滚动位置。',
  },
  en: {
    root: 'Root element with positioning, border radius, border, and themed container styles.',
    container: 'Native scroll container that performs the actual horizontal and vertical scrolling.',
    content: 'Inner content wrapper that hosts slot content and participates in content-size observation.',
    track: 'Shared scrollbar track layer that provides the base track appearance for both axes.',
    trackX: 'Horizontal scrollbar track positioned at the bottom of the container.',
    trackY: 'Vertical scrollbar track positioned on the right side of the container.',
    thumb: 'Shared scrollbar thumb layer for the draggable visible scroll handle.',
    thumbX: 'Horizontal scrollbar thumb that reflects and controls horizontal scroll position.',
    thumbY: 'Vertical scrollbar thumb that reflects and controls vertical scroll position.',
  },
}
