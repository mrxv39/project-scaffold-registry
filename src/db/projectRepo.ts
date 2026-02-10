import { getPrismaClient } from './getPrismaClient';
import type { Project, Prisma } from '@prisma/client';

export async function createProject(data: Omit<Prisma.ProjectCreateInput, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  const prisma = await getPrismaClient();
  return prisma.project.create({ data });
}

export async function getProjectById(id: string): Promise<Project | null> {
  const prisma = await getPrismaClient();
  return prisma.project.findUnique({ where: { id } });
}

export async function listProjects(limit = 10, offset = 0): Promise<Project[]> {
  const prisma = await getPrismaClient();
  return prisma.project.findMany({
    skip: offset,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
}
