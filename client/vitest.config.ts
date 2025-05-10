import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.ts", "unit/**/*.{test,spec}.ts"],
    exclude: ["e2e/**", "node_modules/**", "dist/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});
