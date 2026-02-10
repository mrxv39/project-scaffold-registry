import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { describeDb } from './utils/db';
import app from '../src/app';



describe('Regression: /health and /db/health endpoints', () => {
  it('GET /health returns 200 even if Prisma accessor throws', async () => {
    // Mock getPrismaClient to always throw
    vi.doMock('../src/db/getPrismaClient', () => ({
      getPrismaClient: async () => { throw new Error('Prisma error'); }
    }));
    // Re-import app to use the mocked module
    const { default: mockedApp } = await import('../src/app');
    const { default: request } = await import('supertest');
    const res = await request(mockedApp).get('/health');
    expect(res.status).toBe(200);
    vi.resetModules();
  });

  it.skip('GET /db/health returns 503 when Prisma accessor throws', async () => {
    // TODO: enable when /db/health is implemented
    vi.doMock('../src/db/getPrismaClient', () => ({
      getPrismaClient: async () => { throw new Error('Prisma error'); }
    }));
    const { default: mockedApp } = await import('../src/app');
    const { default: request } = await import('supertest');
    const res = await request(mockedApp).get('/db/health');
    expect(res.status).toBe(503);
    expect(res.body.ok).toBe(false);
    expect(res.body.error).toMatch(/Prisma error/);
    vi.resetModules();
  });
});

describeDb('Integration: /api/v1/projects', () => {
  let createdId: string;

  it('POST /api/v1/projects creates a project', async () => {
    const request = (await import('supertest')).default;
    const res = await request(app)
      .post('/api/v1/projects')
      .send({ name: 'IntegrationTest', category: 'test', status: 'PENDING', tags: ['a', 'b'] });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('IntegrationTest');
    expect(Array.isArray(res.body.tags)).toBe(true);
    createdId = res.body.id;
  });

  it('GET /api/v1/projects returns created project', async () => {
    const request = (await import('supertest')).default;
    const res = await request(app).get('/api/v1/projects');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((p: any) => p.id === createdId)).toBe(true);
  });
});