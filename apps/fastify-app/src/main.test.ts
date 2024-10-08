import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { app } from './app/app';
import Fastify from 'fastify';
import supertest from 'supertest';

describe('Fastify Server Integration Tests', () => {
  let server: FastifyInstance;
  let request: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    server = Fastify();
    await server.register(app);
    await server.ready();

    request = supertest(server.server);
  });

  afterAll(async () => {
    await server.close();
  });

  it('should respond with Hello API using Supertest', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello API' });
  });
});
