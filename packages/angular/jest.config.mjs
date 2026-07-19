export default {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: ['<rootDir>/tests/**/*.spec.ts'],
  // @opentagcloud/core ships ESM — let the Angular transformer compile it
  transformIgnorePatterns: ['node_modules/(?!@opentagcloud|.*\\.mjs$)'],
};
