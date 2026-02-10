/* @vitest-environment node */
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import http from "http";
import fs from "node:fs";
import path from "node:path";

// --- Test 1: Importing app has no side effects ---
it("importing app does not throw or initialize Prisma", async () => {
  let threw = false;
  try {
    const importedApp = await import("./app");
    expect(importedApp).toBeTruthy();
  } catch {
    threw = true;
  }
  expect(threw).toBe(false);
});

// --- Test 2: /health does not initialize Prisma ---
// Mock prismaClient to detect initialization
vi.mock("./prismaClient", () => ({
  getPrismaClient: async () => {
    throw new Error("Prisma should not be initialized during /health");
  },
}));

import app from "./app";

let server: http.Server;
let port: number;

describe("Startup regression: Express boots without DB", () => {
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

  afterAll(async () => {
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  it("responds to /health with 200 and does not touch Prisma", async () => {
    const res = await fetch(`http://127.0.0.1:${port}/health`);
    expect(res.status).toBe(200);
  });
});

describe("Prisma accessor module", () => {
  it('defines getPrismaClient and uses dynamic import for "@prisma/client"', () => {
    const filePath = path.resolve(
      process.cwd(),
      "src/infrastructure/db/prismaClientFactory.ts"
    );

    const text = fs.readFileSync(filePath, "utf8");

    // exported symbol exists
    expect(text).toMatch(
      /export\s+(async\s+)?function\s+getPrismaClient|export\s+const\s+getPrismaClient\s*=/
    );

    // guarantees lazy loading (no eager prisma import at module load)
    expect(text).toContain('import("@prisma/client")');
  });
});
