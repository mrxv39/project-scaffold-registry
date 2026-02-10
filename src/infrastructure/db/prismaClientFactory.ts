// src/infrastructure/db/prismaClientFactory.ts
import type { PrismaClient } from "@prisma/client";

let prismaClient: PrismaClient | undefined;

/**
 * Returns a singleton PrismaClient instance, initialized lazily.
 * Important: Prisma is imported dynamically so the app can boot even if the Prisma client
 * has not been generated yet (e.g. before `prisma generate`).
 */
export async function getPrismaClient(): Promise<PrismaClient> {
  if (prismaClient) return prismaClient;

  const prismaModule = await import("@prisma/client");
  prismaClient = new prismaModule.PrismaClient();

  return prismaClient;
}
