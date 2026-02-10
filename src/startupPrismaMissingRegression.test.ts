/* @vitest-environment node */
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import http from "http";

// Mock the prisma accessor module used in app.ts
vi.mock("./infrastructure/db/prismaClientFactory", () => ({
  getPrismaClient: () => {
    throw new Error("Prisma should not be called on startup");
  }
}));

import app from "./app";

let server: http.Server;
let port: number;

describe("Regression: server boots without touching Prisma", () => {
  beforeAll(async () => {
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address();
        if (typeof address === "object" && address && "port" in address) {
          port = (address as any).port;
          resolve();
          return;
        }
        throw new Error("Could not determine server port from server.address()");
      });
    });
  });

  afterAll(() => {
    if (server) server.close();
  });

  it("/health works even if Prisma is mocked to throw", async () => {
    const res = await fetch(`http://127.0.0.1:${port}/health`);
    expect(res.status).toBe(200);
  });
});
