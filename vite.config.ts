import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vitest/config";

const tslibEsm = createRequire(import.meta.url).resolve("tslib/tslib.es6.mjs");

const commitSha =
  process.env.WORKERS_CI_COMMIT_SHA ||
  spawnSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).stdout?.trim() ||
  "unknown";

const config = defineConfig({
  define: {
    "import.meta.env.VITE_COMMIT_SHA": JSON.stringify(commitSha),
  },
  resolve: {
    tsconfigPaths: true,
    // tslib resolves to its CJS wrapper on Workers; default export is undefined there
    alias: { tslib: tslibEsm },
  },
  test: {
    server: { deps: { inline: ["@scritto/react", "@scritto/core"] } },
  },
  plugins: [
    devtools(),
    nitro({
      rollupConfig: { external: [/^@sentry\//] },
      output: { dir: "./dist" },
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
});

export default config;
