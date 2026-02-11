
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { describeDb } from '../src/testUtils/describeDb';

const API = '/api/projects';

// 1) returns 503 when DATABASE_URL missing

describe('PATCH /api/projects/:id', () => {
  const originalEnv = process.env.DATABASE_URL;

  afterEach(() => {
    if (originalEnv === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = originalEnv;
  });

  it('returns 503 when DATABASE_URL missing', async () => {
    delete process.env.DATABASE_URL;
    const res = await request(app)
      .patch(`${API}/123`)
      .send({ name: 'x' });
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ status: 'db_unavailable', reason: 'DATABASE_URL missing' });
  });
});

describeDb('PATCH /api/projects/:id DB cases', () => {
  let createdId: string;

  beforeEach(async () => {
    // Create a project for update tests
    const res = await request(app)
      .post(API)
      .send({ name: 'PatchMe', category: 'oldcat' });
    createdId = res.body.id;
  });

  it('returns 404 when project does not exist', async () => {
    const res = await request(app)
      .patch(`${API}/nonexistent-id`)
      .send({ name: 'new' });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ status: 'not_found' });
  });

  it('updates a project successfully', async () => {
    const patch = { name: 'Updated', category: 'newcat' };
    const res = await request(app)
      .patch(`${API}/${createdId}`)
      .send(patch);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated');
    expect(res.body.category).toBe('newcat');
  });

  it('returns 400 on empty body', async () => {
    const res = await request(app)
      .patch(`${API}/${createdId}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('bad_request');
    expect(res.body.reason).toBe('empty_body');
  });

  it('returns 400 on invalid name', async () => {
    const res = await request(app)
      .patch(`${API}/${createdId}`)
      .send({ name: '   ' });
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('bad_request');
    expect(res.body.reason).toMatch(/name/);
  });
});
