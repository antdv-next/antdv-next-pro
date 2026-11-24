import { afterAll, beforeAll } from 'vitest'
import { resetMockDate, setMockDate } from '../../../../../tests/utils'
import demoTest from '/@tests/shared/demoTest'

beforeAll(() => {
  setMockDate('2026-09-16T12:00:00.000Z')
})

afterAll(() => {
  resetMockDate()
})

demoTest('comment')
