import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { resolve as r } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~': r('src'),
    },
  },
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      // https://vitest.dev/config/browser/playwright
      instances: [
        // { browser: 'chromium' },
        { browser: 'firefox' },
        // { browser: 'webkit' },
      ],
    },
  },
})
