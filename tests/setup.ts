import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";

// vitest.config.ts does not enable `test.globals`, so Testing Library's
// automatic afterEach cleanup detection (which relies on a global
// `afterEach`) never registers. Register it explicitly instead, so each
// test starts from an empty DOM.
afterEach(() => {
  cleanup();
});
