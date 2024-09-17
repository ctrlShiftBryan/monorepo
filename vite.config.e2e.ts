import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.e2e.test.ts'],
    globals: true,
    environment: 'node',
    deps: {
      inline: ["@fastify/autoload"],
    },
  },
});
