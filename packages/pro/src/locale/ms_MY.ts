import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/ms_MY'

const cronLocale = {
  fields: {
    second: 'Kedua',
    minute: 'Minit',
    hour: 'Jam',
    day: 'Hari',
    month: 'Bulan',
    week: 'Minggu',
    year: 'Tahun',
  },
  modes: {
    every: 'Setiap',
    interval: 'Selang',
    specified: 'Dinyatakan',
    range: 'Julat',
    special: 'Khas',
  },
  notSpecified: 'Tidak dinyatakan',
  everyField: 'Setiap {field}',
  everyStep: 'Laksanakan setiap {step} {field}',
  intervalField: 'Mula pada  {start}, kemudian laksanakan setiap {step} {field}',
  specifiedField: '{values}',
  rangeField: '{start} hingga {end}',
  unspecifiedDay: 'Hari tidak ditentukan; ikut medan minggu',
  unspecifiedWeek: 'Minggu tidak ditentukan; ikut medan hari',
  valueSeparator: ', ',
  expression: 'Ungkapan cron',
  fieldList: 'Medan Cron',
  fieldStart: '{field} mula',
  fieldInterval: '{field} selang',
  fieldRangeStart: '{field} mula julat',
  fieldRangeEnd: '{field} hujung julat',
  fieldValues: '{field} nilai',
  nextRun: 'Larian seterusnya: {value}',
  noFutureRun: 'Tiada larian masa hadapan',
  specialLastDay: 'hari terakhir setiap bulan',
  specialLastWeekday: 'hari bekerja terakhir setiap bulan',
  specialNearestWeekday: 'hari bekerja terdekat dengan hari {day} setiap bulan',
  specialLastDayOfWeek: '{week} terakhir setiap bulan',
  specialNthDayOfWeek: '{week} ke-{nth} setiap bulan',
  specialLast: 'Terakhir',
  specialNth: 'Ke-n',
  nthLabels: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  },
  validation: {
    invalidStep: 'Ungkapan langkah tidak sah',
    stepOutOfRange: 'Langkah mestilah nilai positif dalam julat medan',
    invalidRange: 'Ungkapan julat tidak sah',
    valueOutOfRange: 'Nilai mestilah antara {min} dan {max}',
    rangeOrder: 'Julat mula tidak boleh lebih besar daripada julat akhir',
    fieldRequired: 'Medan diperlukan',
    questionMarkField: 'Tanda soal hanya disokong untuk medan hari dan minggu',
    questionMarkAlone: 'Tanda soal mestilah satu-satunya nilai medan',
    unsupportedCharacter: 'Watak tidak disokong dalam medan',
    expectedFields: 'Jangkaan {count} medan untuk format Kuarza yang dipilih',
    expectedUnixFields: 'Unix cron memerlukan 5 medan',
    dayWeekQuestionMark: 'Dalam ungkapan Kuarza, sama ada medan hari atau medan minggu mestilah ?, tetapi bukan kedua-duanya',
    unixQuestionMark: 'Tanda soal tidak disokong dalam Unix cron',
    unsupportedSpecial: 'Sintaks khas ini tidak disokong',
    invalidExpression: 'Ungkapan cron tidak sah',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'Peta haba',
    less: 'Kurang',
    more: 'Lebih',
    noData: 'Tiada data',
    level: 'Tahap',
  },
  InputTag: {
    clear: 'Kosongkan',
    showMore: 'Tunjukkan semua tag',
  },
} satisfies ProLocale

export default proLocale
