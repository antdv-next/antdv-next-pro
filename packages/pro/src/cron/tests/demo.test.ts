import MockDate from 'mockdate'
import { afterAll } from 'vitest'
import demoTest from '/@tests/shared/demoTest'

MockDate.set('2026-09-08T00:00:00+08:00')
afterAll(() => MockDate.reset())
demoTest('cron')
