import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    pool: "threads",
    fileParallelism: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/server.ts"],
    },
  },
});
