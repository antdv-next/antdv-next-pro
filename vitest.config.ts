import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      './packages/*',
    ],
    coverage: {
      provider: 'v8',
      include: [
        'packages/pro/src/**/*.{ts,tsx}',
      ],
      exclude: [
        'packages/**/locale/*.{ts,tsx}',
      ],
    },
  },
})
