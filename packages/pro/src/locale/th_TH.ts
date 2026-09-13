import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/th_TH'

const cronLocale = {
  fields: {
    second: 'วินาที',
    minute: 'นาที',
    hour: 'ชั่วโมง',
    day: 'วัน',
    month: 'เดือน',
    week: 'สัปดาห์',
    year: 'ปี',
  },
  modes: {
    every: 'ทุก',
    interval: 'ช่วงเวลา',
    specified: 'ระบุ',
    range: 'พิสัย',
    special: 'พิเศษ',
  },
  notSpecified: 'ไม่ได้ระบุ',
  everyField: 'ทุก {field}',
  everyStep: 'ทำงานทุก {step} {field}',
  intervalField: 'เริ่มที่  {start} แล้วทำงานทุก {step} {field}',
  specifiedField: '{values}',
  rangeField: '{start} ถึง {end}',
  unspecifiedDay: 'ไม่ระบุวันที่ ให้ใช้ฟิลด์สัปดาห์',
  unspecifiedWeek: 'ไม่ระบุวันในสัปดาห์ ให้ใช้ฟิลด์วัน',
  valueSeparator: ', ',
  expression: 'การแสดงออกของครอน',
  fieldList: 'ฟิลด์ครอน',
  fieldStart: '{field} เริ่มต้น',
  fieldInterval: '{field} ช่วงเวลา',
  fieldRangeStart: '{field} เริ่มต้นช่วง',
  fieldRangeEnd: '{field} สิ้นสุดช่วง',
  fieldValues: '{field} ค่า',
  nextRun: 'วิ่งครั้งต่อไป: {value}',
  noFutureRun: 'ไม่มีการวิ่งในอนาคต',
  specialLastDay: 'วันสุดท้ายของทุกเดือน',
  specialLastWeekday: 'วันทำการสุดท้ายของทุกเดือน',
  specialNearestWeekday: 'วันทำการที่ใกล้กับวันที่ {day} ของทุกเดือนมากที่สุด',
  specialLastDayOfWeek: '{week} สุดท้ายของทุกเดือน',
  specialNthDayOfWeek: '{week} ที่ {nth} ของทุกเดือน',
  specialLast: 'สุดท้าย',
  specialNth: 'ลำดับที่ n',
  nthLabels: {
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
  },
  validation: {
    invalidStep: 'นิพจน์ขั้นตอนไม่ถูกต้อง',
    stepOutOfRange: 'ขั้นตอนต้องเป็นค่าบวกภายในช่วงฟิลด์',
    invalidRange: 'นิพจน์ช่วงไม่ถูกต้อง',
    valueOutOfRange: 'ค่าต้องอยู่ระหว่าง {min} ถึง {max}',
    rangeOrder: 'การเริ่มต้นช่วงต้องไม่มากกว่าจุดสิ้นสุดของช่วง',
    fieldRequired: 'ต้องระบุข้อมูล',
    questionMarkField: 'เครื่องหมายคำถามรองรับเฉพาะช่องวันและสัปดาห์เท่านั้น',
    questionMarkAlone: 'เครื่องหมายคำถามต้องเป็นค่าในช่องเดียว',
    unsupportedCharacter: 'ไม่รองรับอักขระในฟิลด์',
    expectedFields: 'คาดหวัง {count} ฟิลด์สำหรับรูปแบบควอตซ์ที่เลือก',
    expectedUnixFields: 'Unix cron ต้องมี 5 ฟิลด์',
    dayWeekQuestionMark: 'ในนิพจน์ Quartz ฟิลด์วันหรือฟิลด์สัปดาห์ต้องเป็น ? แต่ไม่ใช่ทั้งสองอย่าง',
    unixQuestionMark: 'Unix cron ไม่รองรับเครื่องหมายคำถาม',
    unsupportedSpecial: 'ไวยากรณ์พิเศษนี้ไม่รองรับ',
    invalidExpression: 'นิพจน์ cron ไม่ถูกต้อง',
  },
} satisfies CronLocale

const proLocale = {
  ...locale,
  Cron: cronLocale,
  Heatmap: {
    label: 'แผนที่ความร้อน',
    less: 'น้อย',
    more: 'มาก',
    noData: 'ไม่มีข้อมูล',
    level: 'ระดับ',
  },
  InputTag: {
    clear: 'ล้าง',
    showMore: 'แสดงแท็กทั้งหมด',
  },
} satisfies ProLocale

export default proLocale
