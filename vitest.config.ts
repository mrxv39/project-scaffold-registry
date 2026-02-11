import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    hookTimeout: 20000,
    teardownTimeout: 20000,
    isolate: true,
    pool: 'forks',
    detectOpenHandles: true,
    exclude: [
      "web/**",
      "web/**/*",
      "dist/**",
      "**/dist/**"
    ],
  },
});
