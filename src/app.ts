import express, { Request, Response, NextFunction } from 'express';
import { getPrismaClient } from './infrastructure/db/prismaClientFactory';

const app = express();

// Simple request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// No DB connection at startup. Use getPrismaClient() inside route handlers or services.

// /health endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

// Basic error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
