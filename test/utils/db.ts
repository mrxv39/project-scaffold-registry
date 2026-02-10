import { describe } from "vitest";
/**
 * describeDb - Conditionally runs or skips a test suite based on DATABASE_URL presence.
 * Use for DB-dependent integration tests. Compatible with Vitest/Jest.
 * @param {string} name - Suite name
 * @param {Function} fn - Suite function
 */
export function describeDb(name, fn) {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return describe.skip(name + ' (skipped: DATABASE_URL not set)', fn);
  }
  return describe(name, fn);
}
