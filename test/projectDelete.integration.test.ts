import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { describeDb } from '../src/testUtils/describeDb';

// 1) always-run: DB unavailable
it('DELETE /api/projects/:id returns 503 if DB unavailable', async () => {
  const originalEnv = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  const res = await request(app)
    .delete('/api/projects/123');
  expect(res.status).toBe(503);
  expect(res.headers['content-type']).toContain('application/json');
  expect(res.body).toEqual({ status: 'db_unavailable', reason: 'DATABASE_URL missing' });
  if (originalEnv !== undefined) process.env.DATABASE_URL = originalEnv;
});

// 2) describeDb: DELETE nonexistent

describeDb('DELETE /api/projects/:id returns 404 for nonexistent project', () => {
  it('returns 404 and { status: "not_found" }', async () => {
    const res = await request(app)
      .delete('/api/projects/nonexistent-id');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ status: 'not_found' });
  });
});

// 3) describeDb: DELETE existing

describeDb('DELETE /api/projects/:id deletes project and returns 204', () => {
  it('creates, deletes, and verifies deletion', async () => {
    // Create project
    const createRes = await request(app)
      .post('/api/projects')
      .send({ name: 'To Delete' });
    expect(createRes.status).toBe(201);
    const id = createRes.body.id;
    expect(typeof id).toBe('string');

    // Delete project
    const deleteRes = await request(app)
      .delete(`/api/projects/${id}`);
    expect(deleteRes.status).toBe(204);

    // Verify deletion
    const getRes = await request(app)
      .get(`/api/projects/${id}`);
    expect(getRes.status).toBe(404);
    expect(getRes.body).toEqual({ status: 'not_found' });
  });
});
