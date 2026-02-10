// C:\Users\Usuario\projects\project-scaffold-registry\src\apiProjectsRouter.ts
import { Router, type Request, type Response } from "express";
import { createProject, getProjectById, listProjects } from "./db/projectRepo";

const router = Router();

function isDbAvailable() {
  return !!process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0;
}

function respondDbUnavailable(res: Response) {
  return res.status(503).json({ status: "db_unavailable", reason: "DATABASE_URL missing" });
}

/**
 * GET /api/projects
 */
router.get("/", async (req: Request, res: Response) => {
  if (!isDbAvailable()) return respondDbUnavailable(res);

  const limitRaw = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
  const offsetRaw = Array.isArray(req.query.offset) ? req.query.offset[0] : req.query.offset;

  const limit = typeof limitRaw === "string" ? Number.parseInt(limitRaw, 10) : 10;
  const offset = typeof offsetRaw === "string" ? Number.parseInt(offsetRaw, 10) : 0;

  const safeLimit = Number.isFinite(limit) && limit > 0 && limit <= 100 ? limit : 10;
  const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0;

  try {
    const projects = await listProjects(safeLimit, safeOffset);
    return res.status(200).json(projects);
  } catch {
    return res.status(503).json({ status: "db_unavailable", reason: "prisma_unavailable" });
  }
});

/**
 * POST /api/projects
 * Body: { name: string, category?: string, status?: string }
 *
 * NOTE: Prisma schema requires category + status, so we provide safe defaults
 * to keep the MVP create flow working with just "name".
 */
router.post("/", async (req: Request, res: Response) => {
  if (!isDbAvailable()) return respondDbUnavailable(res);

  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  if (!name) return res.status(400).json({ status: "bad_request", reason: "name_required" });

  // Allow optional overrides but keep defaults for MVP
  const category = typeof req.body?.category === "string" && req.body.category.trim()
    ? req.body.category.trim()
    : "infrastructure";

  const status = typeof req.body?.status === "string" && req.body.status.trim()
    ? req.body.status.trim()
    : "PENDING";

  try {
    const created = await createProject({ name, category, status });
    return res.status(201).json(created);
  } catch {
    return res.status(503).json({ status: "db_unavailable", reason: "prisma_unavailable" });
  }
});

/**
 * GET /api/projects/:id
 */
router.get("/:id", async (req: Request, res: Response) => {
  if (!isDbAvailable()) return respondDbUnavailable(res);

  const id = String(req.params.id || "").trim();
  if (!id) return res.status(400).json({ status: "bad_request", reason: "id_required" });

  try {
    const project = await getProjectById(id);
    if (!project) return res.status(404).json({ status: "not_found" });
    return res.status(200).json(project);
  } catch {
    return res.status(503).json({ status: "db_unavailable", reason: "prisma_unavailable" });
  }
});

export default router;
