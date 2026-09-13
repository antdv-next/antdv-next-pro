import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/id_ID'

const cronLocale = {
  fields: {
    second: 'Detik',
    minute: 'Menit',
    hour: 'Jam',
    day: 'Hari',
    month: 'Bulan',
    week: 'Minggu',
    year: 'Tahun',
  },
  modes: {
    every: 'Setiap',
    interval: 'Jeda',
    specified: 'Ditentukan',
    range: 'Rentang',
    special: 'Khusus',
  },
  notSpecified: 'Tidak ditentukan',
  everyField: 'Setiap {field}',
  everyStep: 'Jalankan setiap {step} {field}',
  intervalField: 'Mulai pada  {start}, lalu jalankan setiap {step} {field}',
  specifiedField: '{values}',
  rangeField: '{start} sampai {end}',
  unspecifiedDay: 'Tanggal tidak ditentukan; ikuti kolom minggu',
  unspecifiedWeek: 'Minggu tidak ditentukan; ikuti kolom hari',
  valueSeparator: ', ',
  expression: 'Ekspresi cron',
  fieldList: 'Bidang cron',
  fieldStart: '{field} mulai',
  fieldInterval: '{field} selang waktu',
  fieldRangeStart: '{field} rentang mulai',
  fieldRangeEnd: '{field} rentang berakhir',
  fieldValues: '{field} nilai',
  nextRun: 'Proses selanjutnya: {value}',
  noFutureRun: 'Tidak ada masa depan yang berjalan',
  specialLastDay: 'hari terakhir setiap bulan',
  specialLastWeekday: 'hari kerja terakhir setiap bulan',
  specialNearestWeekday: 'hari kerja terdekat ke tanggal {day} setiap bulan',
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
    invalidStep: 'Ekspresi langkah tidak valid',
    stepOutOfRange: 'Langkah harus berupa nilai positif dalam rentang bidang',
    invalidRange: 'Ekspresi rentang tidak valid',
    valueOutOfRange: 'Nilai harus antara {min} dan {max}',
    rangeOrder: 'Rentang awal tidak boleh lebih besar dari rentang akhir',
    fieldRequired: 'Kolom wajib diisi',
    questionMarkField: 'Tanda tanya hanya didukung untuk kolom hari dan minggu',
    questionMarkAlone: 'Tanda tanya harus menjadi satu-satunya nilai bidang',
    unsupportedCharacter: 'Karakter tidak didukung di lapangan',
    expectedFields: 'Bidang {count} yang diharapkan untuk format Kuarsa yang dipilih',
    expectedUnixFields: 'Unix cron membutuhkan 5 bidang',
    dayWeekQuestionMark: 'Dalam ekspresi Kuarsa, kolom hari atau kolom minggu harus ?, namun tidak keduanya',
    unixQuestionMark: 'Tanda tanya tidak didukung di Unix cron',
    unsupportedSpecial: 'Sintaks khusus ini tidak didukung',
    invalidExpression: 'Ekspresi cron tidak valid',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'Peta panas',
    less: 'Lebih sedikit',
    more: 'Lebih banyak',
    noData: 'Tidak ada data',
    level: 'Tingkat',
  },
  InputTag: {
    clear: 'Hapus',
    showMore: 'Tampilkan semua tag',
  },
} satisfies ProLocale

export default proLocale
