import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    deps: {
      inline: ["@fastify/autoload"],
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
        '**/vitest.config.ts',
        'tmp/**',
        // Add more specific exclusions here
        'apps/fastify-app/src/main.ts',
        'apps/fastify-app/src/app/plugins/**',
        'apps/fastify-app/src/app/routes/**',
      ],
      // You can also use 'include' to explicitly specify files to include
      // include: [
      //   'apps/fastify-app/src/**/*.ts',
      // ],
    },
  },
});
