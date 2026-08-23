import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

// vitest.config.ts で `test.globals` を有効化していないため、グローバルな
// `afterEach` に依存する Testing Library の自動クリーンアップ検出は登録されない。
// 各テストが空の DOM から始まるよう、ここで明示的に登録する。
afterEach(() => {
  cleanup();
});
