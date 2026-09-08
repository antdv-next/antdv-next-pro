import type { CronLocale } from '../cron/types'
import type { ProLocale } from './types'
import locale from 'antdv-next/locale/th_TH'

const cronLocale: CronLocale = {
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
    list: 'รายการ',
  },
  any: 'อะไรก็ได้',
  notSpecified: 'ไม่ได้ระบุ',
  every: 'ทุก',
  everyField: 'ทุก {field}',
  to: 'ถึง',
  expression: 'การแสดงออกของครอน',
  fieldList: 'ฟิลด์ครอน',
  fieldStart: '{field} เริ่มต้น',
  fieldInterval: '{field} ช่วงเวลา',
  fieldRangeStart: '{field} เริ่มต้นช่วง',
  fieldRangeEnd: '{field} สิ้นสุดช่วง',
  fieldValue: 'ค่า {field}',
  fieldValues: '{field} ค่า',
  nextRun: 'วิ่งครั้งต่อไป: {value}',
  noFutureRun: 'ไม่มีการวิ่งในอนาคต',
  everySeconds: 'ทุกๆ {value} วินาที',
  everyMinutes: 'ทุก {value} นาที',
  everyDayAt: 'ทุกวัน เวลา {value}',
  customSchedule: 'กำหนดการที่กำหนดเอง',
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
    dayWeekQuestionMark: 'ในนิพจน์ Quartz ฟิลด์วันหรือฟิลด์สัปดาห์ต้องเป็น ? แต่ไม่ใช่ทั้งสองอย่าง',
    invalidExpression: 'นิพจน์ cron ไม่ถูกต้อง',
  },
}

const proLocale = {
  ...locale,
  Cron: cronLocale,
} satisfies ProLocale

export default proLocale
