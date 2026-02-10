import { it, expect } from 'vitest';
import request from 'supertest';
import app from './app';

it('db health does not return "DATABASE_URL missing" when env is set', async () => {
  process.env.DATABASE_URL = 'dummy';
  const res = await request(app).get('/db/health');
  expect(res.body.reason).not.toBe('DATABASE_URL missing');
});
