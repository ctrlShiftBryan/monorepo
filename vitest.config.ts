import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    deps: {
      inline: ["@fastify/autoload"],
    },
    globals: true,
    environment: 'node',
  },
});
