import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { describeDb } from "../../src/testUtils/describeDb";

describe("describeDb helper", () => {
  const original = process.env.DATABASE_URL;

  beforeAll(() => { delete process.env.DATABASE_URL; });
  afterAll(() => {
    if (original !== undefined) process.env.DATABASE_URL = original;
    else delete process.env.DATABASE_URL;
  });

  it("does not throw when DATABASE_URL is missing", () => {
    expect(() => describeDb("db suite", () => {})).not.toThrow();
  });
});
