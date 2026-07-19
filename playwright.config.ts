import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  use: {
    baseURL: 'http://localhost:5197',
  },
  webServer: {
    command: 'node e2e/serve.mjs',
    port: 5197,
    reuseExistingServer: !process.env.CI,
  },
});
