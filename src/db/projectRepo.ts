// C:\Users\Usuario\projects\project-scaffold-registry\src\db\projectRepo.ts
import { getPrismaClient } from "./getPrismaClient";
import type { Project, Prisma } from "@prisma/client";

export async function createProject(
  data: Omit<Prisma.ProjectCreateInput, "id" | "createdAt" | "updatedAt">
): Promise<Project> {
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
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Returns true if deleted, false if not found.
 */
export async function deleteProjectById(id: string): Promise<boolean> {
  const prisma = await getPrismaClient();

  try {
    await prisma.project.delete({ where: { id } });
    return true;
  } catch (err: any) {
    // Prisma "record not found" usually maps to code P2025
    const code = err?.code ?? err?.meta?.cause?.code;
    if (code === "P2025") return false;

    // Some prisma errors nest differently; also check message as fallback (safe)
    const msg = String(err?.message || "");
    if (msg.includes("P2025") || msg.toLowerCase().includes("record to delete does not exist")) {
      return false;
    }

    throw err;
  }
}
