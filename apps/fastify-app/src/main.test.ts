import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { app } from './app/app';
import Fastify from 'fastify';
import supertest from 'supertest';
import getPort from 'get-port';

describe('Fastify Server', () => {
  let server: FastifyInstance;
  let request: supertest.SuperTest<supertest.Test>;
  let baseUrl: string;

  beforeAll(async () => {
    // Setup for both Supertest and fetch testing
    server = Fastify();
    await server.register(app);
    await server.ready();

    // Supertest setup
    // Pros: Tests full HTTP stack, good for integration testing
    // Cons: Slower than injection testing, requires server instance
    request = supertest(server.server);

    // Fetch testing setup
    // Pros: Tests server as external client, good for end-to-end testing
    // Cons: Slowest method, requires managing server lifecycle
    const port = await getPort();
    await server.listen({ port });
    baseUrl = `http://localhost:${port}`;
  });

  afterAll(async () => {
    await server.close();
  });

  // Supertest example
  // Use for integration tests of API endpoints
  it('should respond with Hello API using Supertest', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello API' });
  });

  // Fetch testing example
  // Use for end-to-end tests or when testing specific HTTP behaviors
  it('should fetch Hello API using fetch', async () => {
    const response = await fetch(`${baseUrl}/`);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toEqual({ message: 'Hello API' });
  });
});
