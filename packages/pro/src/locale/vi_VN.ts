import type { ProLocale } from './types'
import locale from 'antdv-next/locale/vi_VN'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'Bản đồ nhiệt',
    less: 'Ít hơn',
    more: 'Nhiều hơn',
    noData: 'Không có dữ liệu',
    level: 'Cấp độ',
  },
} satisfies ProLocale

export default proLocale
