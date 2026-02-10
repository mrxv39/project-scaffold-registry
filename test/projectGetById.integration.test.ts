import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { describeDb } from '../src/testUtils/describeDb';

const API = '/api/projects';

// 1) returns 503 when DATABASE_URL missing

describe('GET /api/projects/:id', () => {
  const originalEnv = process.env.DATABASE_URL;

  afterEach(() => {
    if (originalEnv === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = originalEnv;
  });

  it('returns 503 when DATABASE_URL missing', async () => {
    delete process.env.DATABASE_URL;
    const res = await request(app).get(`${API}/123`);
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ status: 'db_unavailable', reason: 'DATABASE_URL missing' });
  });
});

// 2) returns 404 when project does not exist
// 3) returns 200 when project exists

describeDb('GET /api/projects/:id DB cases', () => {
  let createdId: string;

  beforeEach(async () => {
    // Clean up all projects if needed (optional, for determinism)
    // You can add a cleanup here if your repo supports it
  });

  it('returns 404 when project does not exist', async () => {
    const res = await request(app).get(`${API}/nonexistent-id`);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ status: 'not_found' });
  });

  it('returns 200 when project exists', async () => {
    // Create a project first
    const createRes = await request(app)
      .post(API)
      .send({ name: 'Project A' });
    expect(createRes.status).toBe(201);
    expect(createRes.body).toHaveProperty('id');
    createdId = createRes.body.id;
    // Now GET by id
    const getRes = await request(app).get(`${API}/${createdId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body).toHaveProperty('id', createdId);
    expect(getRes.body).toHaveProperty('name', 'Project A');
  });
});
