import { defineConfig, devices } from "@playwright/test";

// アクセシビリティ・スモークは静的エクスポート（`out/`）に対する狭い検証であり、
// 汎用的な E2E シナリオではない。そのため Chromium のみを対象とし、
// Vitest とテスト対象が重ならない `tests/a11y/` だけを走査する。
export default defineConfig({
  testDir: "./tests/a11y",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // `next build` が生成した `out/` をそのまま配信する。専用の依存を増やさず
  // `scripts/serve-static.mjs` を使う（詳細はそのコメントを参照）。
  webServer: {
    command: "node scripts/serve-static.mjs out 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
