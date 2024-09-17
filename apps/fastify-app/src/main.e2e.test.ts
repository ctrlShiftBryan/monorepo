import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { app } from './app/app';
import Fastify from 'fastify';
import getPort from 'get-port';

describe('Fastify Server E2E Tests', () => {
  let server: FastifyInstance;
  let baseUrl: string;

  beforeAll(async () => {
    server = Fastify();
    await server.register(app);
    await server.ready();

    const port = await getPort();
    await server.listen({ port });
    baseUrl = `http://localhost:${port}`;
  });

  afterAll(async () => {
    await server.close();
  });

  it('should fetch Hello API using fetch', async () => {
    const response = await fetch(`${baseUrl}/`);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toEqual({ message: 'Hello API' });
  });
});
