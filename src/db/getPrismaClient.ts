// Lazy singleton accessor for PrismaClient
import type { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | undefined;

export async function getPrismaClient(): Promise<PrismaClient> {
  if (!prisma) {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
  }
  return prisma;
}
