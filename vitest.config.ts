import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    deps: {
      inline: ['@fastify/autoload'],
    },
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'coverage/**',
        'dist/**',
        '**/node_modules/**',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/vite.config.ts',
        '**/vite.config.e2e.ts',
        'tmp/**',
        'apps/fastify-app/src/main.ts',
        'apps/fastify-app/src/app/plugins/**',
        'apps/fastify-app/src/app/routes/**',
      ],
    },
  },
});
