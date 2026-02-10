import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './app';
import { describeDb } from './testUtils/describeDb';

describeDb('GET /db/health', () => {
  it('returns 200 and { status: "ok", db: "ok" } when DB is available', async () => {
    const res = await request(app).get('/db/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', db: 'ok' });
  });
});
