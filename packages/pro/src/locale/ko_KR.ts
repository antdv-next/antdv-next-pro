import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ko_KR'

const proLocale = {
  ...locale,
  Heatmap: {
    label: '히트맵',
    less: '적음',
    more: '많음',
    noData: '데이터 없음',
    level: '레벨',
  },
} satisfies ProLocale

export default proLocale
