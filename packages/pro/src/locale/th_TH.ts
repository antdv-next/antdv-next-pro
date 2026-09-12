import type { ProLocale } from './types'
import locale from 'antdv-next/locale/th_TH'

const proLocale = {
  ...locale,
  Heatmap: {
    label: 'แผนที่ความร้อน',
    less: 'น้อย',
    more: 'มาก',
    noData: 'ไม่มีข้อมูล',
    level: 'ระดับ',
  },
} satisfies ProLocale

export default proLocale
