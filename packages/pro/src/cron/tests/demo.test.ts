import MockDate from 'mockdate'
import { afterAll } from 'vitest'
import demoTest from '/@tests/shared/demoTest'

const originalTimeZone = process.env.TZ

process.env.TZ = 'Asia/Shanghai'
MockDate.set('2026-09-08T00:00:00+08:00')
afterAll(() => {
  MockDate.reset()
  if (originalTimeZone === undefined)
    delete process.env.TZ
  else
    process.env.TZ = originalTimeZone
})
demoTest('cron')
