import { Router, Request, Response } from 'express';
import { getPrismaClient } from './infrastructure/db/prismaClientFactory';

const router = Router();

// Helper: check DB availability
function isDbAvailable() {
  return Boolean(process.env.DATABASE_URL);
}

// GET /api/projects
router.get('/', async (req: Request, res: Response) => {
  if (!isDbAvailable()) {
    return res.status(503).json({ status: 'db_unavailable', reason: 'DATABASE_URL missing' });
  }
  try {
    const prisma = await getPrismaClient();
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// POST /api/projects
router.post('/', async (req: Request, res: Response) => {
  if (!isDbAvailable()) {
    return res.status(503).json({ status: 'db_unavailable', reason: 'DATABASE_URL missing' });
  }
  const { name, category, tags, status, deployed_url, notes } = req.body || {};
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Project name is required' });
  }
  try {
    const prisma = await getPrismaClient();
    const created = await prisma.project.create({
      data: { name, category, tags, status, deployed_url, notes },
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

export default router;
