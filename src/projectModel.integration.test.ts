
import { describe, it, beforeAll, beforeEach, afterAll, expect } from 'vitest';
import { getPrismaClient } from './db/getPrismaClient';
import type { PrismaClient } from '@prisma/client';
import { ProjectStatus } from '@prisma/client';
import { describeDb } from './testUtils/describeDb';

describeDb('Prisma Project model integration', () => {
  let prisma: PrismaClient | undefined;

  beforeAll(async () => {
    prisma = await getPrismaClient();
  });

  beforeEach(async () => {
    if (prisma) await prisma.project.deleteMany();
  });

  afterAll(async () => {
    if (prisma) await prisma.$disconnect();
  });

  it('can create and read a project by id', async () => {
    if (!prisma) throw new Error('Prisma client not initialized');
    const data = {
      name: 'Test Project',
      category: 'test',
      tags: ['integration', 'vitest'],
      status: ProjectStatus.PENDING,
    };
    const created = await prisma.project.create({ data });
    const found = await prisma.project.findUnique({ where: { id: created.id } });
    expect(found).not.toBeNull();
    if (!found) throw new Error('Expected project to exist');
    expect(found.name).toBe(data.name);
    expect(found.category).toBe(data.category);
    expect(found.tags).toEqual(data.tags);
    expect(found.status).toBe(data.status);
  });

  it('can list projects with limit/offset', async () => {
    if (!prisma) throw new Error('Prisma client not initialized');
    const projects = [
      { name: 'A', category: 'cat', tags: [], status: ProjectStatus.PENDING },
      { name: 'B', category: 'cat', tags: [], status: ProjectStatus.ACTIVE },
      { name: 'C', category: 'cat', tags: [], status: ProjectStatus.ARCHIVED },
    ];
    await prisma.project.createMany({ data: projects });
    const all = await prisma.project.findMany({ orderBy: { name: 'asc' } });
    expect(all.length).toBe(3);
    const paged = await prisma.project.findMany({ orderBy: { name: 'asc' }, skip: 1, take: 1 });
    expect(paged.length).toBe(1);
    expect(paged[0].name).toBe('B');
  });

  it('defaults are applied (deployedUrl, notes, timestamps)', async () => {
    if (!prisma) throw new Error('Prisma client not initialized');
    const data = {
      name: 'Defaults',
      category: 'misc',
      tags: [],
      status: ProjectStatus.PENDING,
    };
    const created = await prisma.project.create({ data });
    expect(created.deployedUrl).toBe('');
    expect(created.notes).toBe('');
    expect(created.createdAt).toBeInstanceOf(Date);
    expect(created.updatedAt).toBeInstanceOf(Date);
  });
});
