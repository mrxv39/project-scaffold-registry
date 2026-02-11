// C:\Users\Usuario\projects\project-scaffold-registry\src\apiProjectsRouter.ts

import { Router, type Request, type Response } from "express";
import {
  createProject,
  deleteProjectById,
  getProjectById,
  listProjects,
  updateProjectById,
} from "./db/projectRepo";

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
  } catch (err: any) {
    if (!process.env.DATABASE_URL) {
      return respondDbUnavailable(res);
    }
    throw err;
  }
});

/**
 * POST /api/projects
 * Body: { name: string, category?: string, status?: string }
 */
router.post("/", async (req: Request, res: Response) => {
  if (!isDbAvailable()) return respondDbUnavailable(res);

  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  if (!name) return res.status(400).json({ status: "bad_request", reason: "name_required" });

  // Prisma schema requires these; keep safe defaults for MVP
  const category =
    typeof req.body?.category === "string" && req.body.category.trim()
      ? req.body.category.trim()
      : "infrastructure";

  const status =
    typeof req.body?.status === "string" && req.body.status.trim() ? req.body.status.trim() : "PENDING";

  try {
    const created = await createProject({ name, category, status });
    return res.status(201).json(created);
  } catch (err: any) {
    if (!process.env.DATABASE_URL) {
      return respondDbUnavailable(res);
    }
    throw err;
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
  } catch (err: any) {
    if (!process.env.DATABASE_URL) {
      return respondDbUnavailable(res);
    }
    throw err;
  }
});

/**
 * PATCH /api/projects/:id
 * Body: { name?, category?, tags?, status?, deployed_url?, notes? }
 */
router.patch("/:id", async (req: Request, res: Response) => {
  if (!isDbAvailable()) return respondDbUnavailable(res);

  const id = String(req.params.id || "").trim();
  if (!id) return res.status(400).json({ status: "bad_request", reason: "id_required" });

  const allowedFields = ["name", "category", "tags", "status", "deployed_url", "notes"] as const;

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const update: Record<string, unknown> = {};

  for (const key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(body, key)) {
      update[key] = (body as any)[key];
    }
  }

  // Validation: body must not be empty
  if (Object.keys(update).length === 0) {
    return res.status(400).json({ status: "bad_request", reason: "empty_body" });
  }

  // Validation: name cannot be empty string
  if (
    Object.prototype.hasOwnProperty.call(update, "name") &&
    (typeof update.name !== "string" || !update.name.trim())
  ) {
    return res.status(400).json({ status: "bad_request", reason: "name_required" });
  }

  if (typeof update.name === "string") update.name = update.name.trim();
  if (typeof update.category === "string") update.category = update.category.trim();
  if (typeof update.status === "string") update.status = update.status.trim();
  if (typeof update.deployed_url === "string") update.deployed_url = update.deployed_url.trim();
  if (typeof update.notes === "string") update.notes = update.notes.trim();
  if (Array.isArray(update.tags)) {
    // keep as-is; repo layer can validate further if needed
  }

  try {
    const updated = await updateProjectById(id, update as any);
    if (!updated) return res.status(404).json({ status: "not_found" });
    return res.status(200).json(updated);
  } catch (err: any) {
    if (!process.env.DATABASE_URL) {
      return respondDbUnavailable(res);
    }
    throw err;
  }
});

/**
 * DELETE /api/projects/:id
 * - 503 if DB missing
 * - 404 if not found
 * - 204 if deleted
 */
router.delete("/:id", async (req: Request, res: Response) => {
  if (!isDbAvailable()) return respondDbUnavailable(res);

  const id = String(req.params.id || "").trim();
  if (!id) return res.status(400).json({ status: "bad_request", reason: "id_required" });

  try {
    const deleted = await deleteProjectById(id);
    if (!deleted) return res.status(404).json({ status: "not_found" });
    return res.status(204).send();
  } catch (err: any) {
    if (!process.env.DATABASE_URL) {
      return respondDbUnavailable(res);
    }
    throw err;
  }
});

export default router;
