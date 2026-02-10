import { describe, it, beforeAll, beforeEach, afterAll, expect } from 'vitest';
import { execSync } from 'child_process';
import { getPrismaClient } from './db/getPrismaClient';

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  describe.skip('Prisma Project model integration (skipped: no DATABASE_URL)', () => {
    it('skips all tests because DATABASE_URL is not set', () => {
      expect(true).toBe(true);
    });
  });
} else {
  describe('Prisma Project model integration', () => {
    let prisma;

    beforeAll(async () => {
      execSync('npx prisma generate', { stdio: 'inherit' });
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      prisma = await getPrismaClient();
    });

    beforeEach(async () => {
      await prisma.project.deleteMany();
    });

    afterAll(async () => {
      await prisma.$disconnect();
    });

    it('can create and read a project by id', async () => {
      const data = {
        name: 'Test Project',
        category: 'test',
        tags: ['integration', 'vitest'],
        status: 'PENDING',
      };
      const created = await prisma.project.create({ data });
      const found = await prisma.project.findUnique({ where: { id: created.id } });
      expect(found).not.toBeNull();
      expect(found.name).toBe(data.name);
      expect(found.category).toBe(data.category);
      expect(found.tags).toEqual(data.tags);
      expect(found.status).toBe(data.status);
    });

    it('can list projects with limit/offset', async () => {
      const projects = [
        { name: 'A', category: 'cat', tags: [], status: 'PENDING' },
        { name: 'B', category: 'cat', tags: [], status: 'ACTIVE' },
        { name: 'C', category: 'cat', tags: [], status: 'ARCHIVED' },
      ];
      await prisma.project.createMany({ data: projects });
      const all = await prisma.project.findMany({ orderBy: { name: 'asc' } });
      expect(all.length).toBe(3);
      const paged = await prisma.project.findMany({ orderBy: { name: 'asc' }, skip: 1, take: 1 });
      expect(paged.length).toBe(1);
      expect(paged[0].name).toBe('B');
    });

    it('defaults are applied (deployedUrl, notes, timestamps)', async () => {
      const data = {
        name: 'Defaults',
        category: 'misc',
        tags: [],
        status: 'PENDING',
      };
      const created = await prisma.project.create({ data });
      expect(created.deployedUrl).toBe('');
      expect(created.notes).toBe('');
      expect(created.createdAt).toBeInstanceOf(Date);
      expect(created.updatedAt).toBeInstanceOf(Date);
    });
  });
}
