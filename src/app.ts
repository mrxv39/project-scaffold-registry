import express, { Request, Response, NextFunction } from 'express';
import { getPrismaClient } from './infrastructure/db/prismaClientFactory';


const app = express();
app.use(express.json());

// Simple request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// No DB connection at startup. Use getPrismaClient() inside route handlers or services.


// /health endpoint (must remain DB-independent)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});


// /db/health endpoint (DB readiness, does not break lazy guarantees)
import dbHealthRouter from './dbHealthRouter';
app.use('/db', dbHealthRouter);

// Projects API
import apiProjectsRouter from './apiProjectsRouter';
app.use('/api/projects', apiProjectsRouter);

// Basic error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
