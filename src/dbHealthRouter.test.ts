
import { describe, it, expect, afterEach, vi } from 'vitest';
import request from 'supertest';
import app from './app';
import * as prismaFactory from './infrastructure/db/prismaClientFactory';
import { describeDb } from './testUtils/describeDb';

const DB_HEALTH_PATH = '/db/health';

describe('GET /db/health', () => {
  const originalEnv = process.env.DATABASE_URL;

  afterEach(() => {
    process.env.DATABASE_URL = originalEnv;
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('returns 503 if DATABASE_URL is missing', async () => {
    delete process.env.DATABASE_URL;
    const res = await request(app).get(DB_HEALTH_PATH);
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ status: 'db_unavailable', reason: 'DATABASE_URL missing' });
  });

  describeDb('returns 200 and ok if DB is available', () => {
    it('returns 200 and ok', async () => {
      const res = await request(app).get(DB_HEALTH_PATH);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok', db: 'ok' });
    });
  });

  it('returns 503 and short reason if DB ping fails', async () => {
    process.env.DATABASE_URL = 'dummy';
    vi.spyOn(prismaFactory, 'getPrismaClient').mockImplementation(async () => ({
      $queryRaw: async () => { throw new Error('Simulated DB failure'); }
    }) as any);
    const res = await request(app).get(DB_HEALTH_PATH);
    expect(res.status).toBe(503);
    expect(res.body.status).toBe('db_unavailable');
    expect(typeof res.body.reason).toBe('string');
    expect(res.body.reason.length).toBeGreaterThan(0);
  });
});
