import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './app';
import { describeDb } from './testUtils/describeDb';

describeDb('DB consistency: /db/health and /api/projects', () => {
  it('GET /db/health returns 200', async () => {
    const res = await request(app).get('/db/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', db: 'ok' });
  });

  it('GET /api/projects returns 200 and an array', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
