import { Router, Request, Response } from 'express';
import { getPrismaClient } from './infrastructure/db/prismaClientFactory';

const dbHealthRouter = Router();

// GET /db/health
// Checks DB readiness without touching app tables
// Returns 200 { status: 'ok', db: 'ok' } or 503 { status: 'db_unavailable', reason }
dbHealthRouter.get('/health', async (req: Request, res: Response) => {
  res.set('Cache-Control', 'no-store');
  if (!process.env.DATABASE_URL) {
    console.log('[DB] DATABASE_URL missing');
    return res.status(503).json({ status: 'db_unavailable', reason: 'DATABASE_URL missing' });
  } else {
    console.log('[DB] DATABASE_URL detected');
  }
  try {
    const prisma = await getPrismaClient();
    // Use a minimal, fast query that does not touch app tables
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({ status: 'ok', db: 'ok' });
  } catch (err: any) {
    // Map known error types to short, safe reasons
    let reason = 'db_connection_failed';
    if (err?.message?.includes('prisma') || err?.message?.includes('not found')) {
      reason = 'prisma_unavailable';
    }
    return res.status(503).json({ status: 'db_unavailable', reason });
  }
});

export default dbHealthRouter;
