import { defineConfig } from "@playwright/test";

const port = process.env.PW_PORT ?? "5173";
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  reporter: isCI ? [["list"], ["html", { open: "never" }]] : "list",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    // En CI se usa el Chromium instalado y versionado por Playwright.
    ...(isCI ? {} : { channel: "chrome" }),
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    // En CI el build ya se ejecutó como paso bloqueante anterior.
    command: isCI
      ? `pnpm preview --port ${port} --host 127.0.0.1`
      : `pnpm build && pnpm preview --port ${port} --host 127.0.0.1`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
